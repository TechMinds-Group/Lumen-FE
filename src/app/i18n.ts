import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBR from '../locales/pt-BR/translation.json';
import en from '../locales/en/translation.json';
import es from '../locales/es/translation.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'pt-BR', label: 'Português', countryCode: 'br' },
  { code: 'en',    label: 'English',   countryCode: 'us' },
  { code: 'es',    label: 'Español',   countryCode: 'es' },
] as const;

export type LangCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];
export const STORAGE_KEY = 'i18n_lang';

function detectLanguage(): LangCode {
  // 1. Saved preference
  const stored = localStorage.getItem(STORAGE_KEY) as LangCode | null;
  if (stored && SUPPORTED_LANGUAGES.some(l => l.code === stored)) return stored;

  // 2. Browser language
  const browserLang =
    (navigator.languages && navigator.languages[0]) || navigator.language || '';

  if (browserLang.toLowerCase().startsWith('pt')) return 'pt-BR';
  if (browserLang.toLowerCase().startsWith('es')) return 'es';
  if (browserLang.toLowerCase().startsWith('en')) return 'en';

  // 3. Fallback
  return 'pt-BR';
}

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    en:      { translation: en  },
    es:      { translation: es  },
  },
  lng: detectLanguage(),
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
});

export function changeLanguage(lang: LangCode) {
  i18n.changeLanguage(lang);
  localStorage.setItem(STORAGE_KEY, lang);
}

export default i18n;