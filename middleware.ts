/**
 * middleware.ts — Vercel Edge Middleware
 *
 * Handles two concerns:
 *
 * 1. Bot shell — social-media crawlers (Googlebot, Twitterbot, etc.) receive a
 *    minimal pre-rendered HTML shell with hardcoded Open Graph / Twitter Card
 *    meta tags. Bots do not execute JavaScript, so react-helmet-async tags are
 *    invisible to them; this middleware makes them visible.
 *
 * 2. AdSense account verification — the AdSense crawler (Googlebot) also does
 *    not execute JS, so <meta name="google-adsense-account"> set via
 *    react-helmet-async is never seen by it. This middleware injects that tag
 *    statically into every HTML response — both the bot shell and the regular
 *    SPA index.html served to human visitors.
 *
 * Why process.env instead of import.meta.env:
 *   This file runs in the Vercel Edge Runtime, which is a V8 isolate with no
 *   Vite build context. import.meta.env is replaced at Vite build time and does
 *   not exist here. process.env is the correct way to read environment variables
 *   inside Edge Middleware on Vercel.
 *
 * Required Vercel environment variable (WITHOUT the VITE_ prefix):
 *   ADSENSE_CLIENT=ca-pub-XXXXXXXXXX
 */

import { next } from '@vercel/edge';

// ─── Constants ────────────────────────────────────────────────────────────────

const SITE_URL = 'https://lumen.techminds.net.br';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

const OG_TITLE = 'Lumen — Mapa Multidimensional do Pensamento Político';
const OG_DESC  = 'Explore o pensamento político ocidental através de 9 eixos analíticos. Dashboard educacional interativo da Antiguidade ao século XXI.';

/**
 * Known social-media / SEO crawler User-Agent substrings.
 * Matching is case-insensitive.
 */
const BOT_PATTERNS: readonly string[] = [
  'Googlebot',
  'Google-InspectionTool',
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  'Slackbot',
  'Discordbot',
  'Pinterest',
  'Applebot',
  'bingbot',
  'YandexBot',
];

// Extensions that should never be intercepted by the middleware
const STATIC_EXT_RE = /\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|otf|eot|webp|xml|txt|webmanifest|map|json)$/i;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some(pattern => ua.includes(pattern.toLowerCase()));
}

/**
 * Returns the <meta name="google-adsense-account"> tag if ADSENSE_CLIENT is
 * defined, or an empty string so callers never inject a broken empty tag.
 *
 * process.env is used intentionally — Edge Runtime has no Vite build context,
 * so import.meta.env is unavailable here.
 */
function adsenseMetaTag(): string {
  const client = process.env.ADSENSE_CLIENT;
  if (!client) return '';
  return `<meta name="google-adsense-account" content="${client}">`;
}

/**
 * Injects the AdSense meta tag immediately after the opening <head> tag.
 * Returns the original HTML unchanged if the tag is empty or <head> is absent.
 */
function injectAdsenseMeta(html: string): string {
  const tag = adsenseMetaTag();
  if (!tag) return html;
  return html.replace('<head>', `<head>\n  ${tag}`);
}

/**
 * Builds a minimal HTML document containing only the meta tags that matter
 * for social sharing previews and AdSense account verification.
 * Bots parse the <head> and stop — no JS needed.
 */
function buildBotShell(url: URL): string {
  const canonical = url.href;
  const adsMeta   = adsenseMetaTag();

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${adsMeta ? `  ${adsMeta}\n` : ''}
  <title>${OG_TITLE}</title>
  <meta name="description" content="${OG_DESC}" />
  <link rel="canonical" href="${canonical}" />

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${canonical}" />
  <meta property="og:title"       content="${OG_TITLE}" />
  <meta property="og:description" content="${OG_DESC}" />
  <meta property="og:image"       content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt"   content="${OG_TITLE}" />
  <meta property="og:site_name"   content="Lumen" />
  <meta property="og:locale"      content="pt_BR" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:url"         content="${canonical}" />
  <meta name="twitter:title"       content="${OG_TITLE}" />
  <meta name="twitter:description" content="${OG_DESC}" />
  <meta name="twitter:image"       content="${OG_IMAGE}" />
  <meta name="twitter:image:alt"   content="${OG_TITLE}" />

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "${OG_TITLE}",
    "url": "${SITE_URL}",
    "description": "${OG_DESC}",
    "applicationCategory": "EducationApplication",
    "inLanguage": ["pt-BR", "en", "es"],
    "isAccessibleForFree": true
  }
  </script>
</head>
<body>
  <!-- Lumen SPA — rendered for social crawlers by Vercel Edge Middleware -->
</body>
</html>`;
}

// ─── Middleware ────────────────────────────────────────────────────────────────

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  // Pass through static assets, Vercel internals and API routes without processing
  if (
    STATIC_EXT_RE.test(pathname) ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/api')
  ) {
    return next();
  }

  const ua = request.headers.get('user-agent') ?? '';

  // Bots get a pre-rendered shell with all meta tags already present
  if (isBot(ua)) {
    return new Response(buildBotShell(url), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Allow CDN to cache the bot shell for 1 hour; revalidate in background
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Robots-Tag': 'index, follow',
      },
    });
  }

  // Regular users — fetch the SPA index.html and inject the AdSense meta tag.
  // We only proceed if ADSENSE_CLIENT is set; otherwise pass through untouched.
  const adsenseClient = process.env.ADSENSE_CLIENT;
  if (!adsenseClient) {
    return next();
  }

  const response = await fetch(request.url, {
    headers: request.headers,
    redirect: 'follow',
  });

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  const html         = await response.text();
  const modifiedHtml = injectAdsenseMeta(html);

  // Preserve all original headers; only the body changes
  const newHeaders = new Headers(response.headers);
  newHeaders.set('content-type', 'text/html; charset=utf-8');

  return new Response(modifiedHtml, {
    status:  response.status,
    headers: newHeaders,
  });
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

// Run on every path — static asset / API filtering is done inside the handler above.
export const config = {
  matcher: '/:path*',
};
