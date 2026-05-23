/**
 * middleware.ts — Vercel Edge Middleware
 *
 * Intercepts requests from social-media crawlers and returns a minimal
 * pre-rendered HTML shell with hardcoded Open Graph / Twitter Card meta tags.
 * Regular users are passed through to the SPA normally.
 *
 * Runtime: Vercel Edge (standard Web APIs — no Next.js required).
 */

import { next } from '@vercel/edge';

// ─── Constants ────────────────────────────────────────────────────────────────

const SITE_URL  = 'https://lumen.techminds.net.br';
const OG_IMAGE  = `${SITE_URL}/og-image.png`;

const OG_TITLE  = 'Lumen — Mapa Multidimensional do Pensamento Político';
const OG_DESC   = 'Explore o pensamento político ocidental através de 9 eixos analíticos. Dashboard educacional interativo da Antiguidade ao século XXI.';

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some(pattern => ua.includes(pattern.toLowerCase()));
}

/**
 * Builds a minimal HTML document containing only the meta tags that matter
 * for social sharing previews. Bots parse the <head> and stop — no JS needed.
 */
function buildBotShell(url: URL): string {
  const canonical = url.href;

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

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

// Extensions that should never be intercepted by the middleware
const STATIC_EXT_RE = /\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|otf|eot|webp|xml|txt|webmanifest|map|json)$/i;

export default function middleware(request: Request): Response {
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

  // Regular user → pass through to the SPA
  return next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

// Run on every path — static asset / API filtering is done inside the handler above.
export const config = {
  matcher: '/:path*',
};
