import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SITE_URL = 'https://lumen.techminds.net.br';
const OG_IMAGE = `${SITE_URL}/og-image.png`;   // 1200×630 px recommended

type Lang = 'pt-BR' | 'en' | 'es';

interface SEOHeadProps {
  title?: string;
  description?: string;
  lang?: Lang;
  /** URL path relative to SITE_URL, e.g. "/" or "/en/" */
  path?: string;
}

const OG_LOCALE: Record<Lang, string> = {
  'pt-BR': 'pt_BR',
  en:      'en_US',
  es:      'es_ES',
};

const OG_LOCALE_ALTERNATES: Record<Lang, string[]> = {
  'pt-BR': ['en_US', 'es_ES'],
  en:      ['pt_BR', 'es_ES'],
  es:      ['pt_BR', 'en_US'],
};

const HREFLANG_PATHS: Record<Lang, string> = {
  'pt-BR': '/',
  en:      '/en/',
  es:      '/es/',
};

const DEFAULT_DESCRIPTIONS: Record<Lang, string> = {
  'pt-BR':
    'Explore o pensamento político ocidental em 9 eixos analíticos. Dashboard educacional interativo com filósofos da Antiguidade ao século XXI.',
  en:
    'Explore Western political thought across 9 analytical axes. Interactive educational dashboard covering thinkers from Antiquity to the 21st century.',
  es:
    'Explora el pensamiento político occidental en 9 ejes analíticos. Dashboard educativo interactivo con filósofos desde la Antigüedad al siglo XXI.',
};

const DEFAULT_TITLES: Record<Lang, string> = {
  'pt-BR': 'Lumen — Mapa Multidimensional do Pensamento Político',
  en:      'Lumen — Multidimensional Map of Political Thought',
  es:      'Lumen — Mapa Multidimensional del Pensamiento Político',
};

export function SEOHead({ title, description, lang, path = '/' }: SEOHeadProps) {
  const { i18n } = useTranslation();
  const activeLang = (lang ?? i18n.language) as Lang;

  const resolvedTitle = title ?? DEFAULT_TITLES[activeLang] ?? DEFAULT_TITLES['pt-BR'];
  const resolvedDesc  = description ?? DEFAULT_DESCRIPTIONS[activeLang] ?? DEFAULT_DESCRIPTIONS['pt-BR'];
  const canonical     = `${SITE_URL}${path}`;
  const ogLocale      = OG_LOCALE[activeLang] ?? 'pt_BR';
  const ogAlternates  = OG_LOCALE_ALTERNATES[activeLang] ?? [];

  return (
    <Helmet>
      {/* HTML lang attribute */}
      <html lang={activeLang} />

      {/* Primary */}
      <title>{resolvedTitle}</title>
      <meta name="title"       content={resolvedTitle} />
      <meta name="description" content={resolvedDesc} />
      <meta name="robots"      content="index, follow" />
      <meta name="theme-color" content="#0F1E35" />

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* hreflang */}
      {(Object.entries(HREFLANG_PATHS) as [Lang, string][]).map(([code, langPath]) => (
        <link
          key={code}
          rel="alternate"
          hreflang={code}
          href={`${SITE_URL}${langPath}`}
        />
      ))}
      <link rel="alternate" hreflang="x-default" href={`${SITE_URL}/`} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={canonical} />
      <meta property="og:site_name"   content="Lumen" />
      <meta property="og:title"       content={resolvedTitle} />
      <meta property="og:description" content={resolvedDesc} />
      <meta property="og:image"       content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"   content={resolvedTitle} />
      <meta property="og:locale"      content={ogLocale} />
      {ogAlternates.map(alt => (
        <meta key={alt} property="og:locale:alternate" content={alt} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:url"         content={canonical} />
      <meta name="twitter:title"       content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDesc} />
      <meta name="twitter:image"       content={OG_IMAGE} />
      <meta name="twitter:image:alt"   content={resolvedTitle} />

      {/* Structured Data — WebApplication + Course */}
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            '@id': `${SITE_URL}/#webapp`,
            name: resolvedTitle,
            url: SITE_URL,
            description: resolvedDesc,
            applicationCategory: 'EducationApplication',
            operatingSystem: 'Web Browser',
            inLanguage: ['pt-BR', 'en', 'es'],
            isAccessibleForFree: true,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
            author: { '@type': 'Organization', name: 'Lumen', url: SITE_URL },
          },
          {
            '@type': 'Course',
            '@id': `${SITE_URL}/#course`,
            name: resolvedTitle,
            description: resolvedDesc,
            url: SITE_URL,
            provider: { '@type': 'Organization', name: 'Lumen', url: SITE_URL },
            inLanguage: ['pt-BR', 'en', 'es'],
            isAccessibleForFree: true,
            educationalLevel: 'HigherEducation',
            about: [
              { '@type': 'Thing', name: 'Filosofia Política' },
              { '@type': 'Thing', name: 'Teoria Política' },
              { '@type': 'Thing', name: 'História do Pensamento Político' },
            ],
          },
        ],
      })}</script>
    </Helmet>
  );
}
