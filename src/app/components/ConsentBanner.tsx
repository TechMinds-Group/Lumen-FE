import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CONSENT_EVENT } from '../hooks/useAdConsent';

const CONSENT_KEY = 'lumen_consent';

// Dynamically injects the AdSense script after user consent — never before (LGPD).
// Brand safety: block the following categories manually in the AdSense dashboard:
//   - Politics & elections     → platform neutrality; our content covers political thinkers
//   - Social issues            → avoid partisan associations that could bias users
//   - Gambling                 → audience trust and professional image
//   - Adult content            → inappropriate for an educational platform
//   - Clickbait & sensationalism → contradicts the platform's evidence-based mission
function injectAdSenseScript() {
  if (document.querySelector('script[data-ad-client]')) return;
  const client = import.meta.env.VITE_ADSENSE_CLIENT ?? 'ca-pub-XXXXXXXXXX'; // Replace with your publisher ID
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
  script.setAttribute('data-ad-client', client);
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

export function ConsentBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(CONSENT_KEY) === null;
  });

  if (!visible) return null;

  const dispatch = () => window.dispatchEvent(new Event(CONSENT_EVENT));

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    injectAdSenseScript();
    dispatch();
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem(CONSENT_KEY, 'false');
    dispatch();
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[#C9A84C] bg-[#0F1E35] px-4 py-4 flex flex-col sm:flex-row items-center gap-3 shadow-lg">
      <div className="flex-1 text-center sm:text-left">
        <p className="text-sm text-[#F2EEE2] font-['Inter']">
          {t('consent.message')}
        </p>
        <p className="mt-1 text-xs text-[#4A5E72]">
          <a
            href="https://portal.techminds.net.br/privacy/lumen"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#8A9BB8] transition-colors underline"
          >
            {t('consent.privacy')}
          </a>
          {' · '}
          <a
            href="https://portal.techminds.net.br/terms-of-use/lumen"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#8A9BB8] transition-colors underline"
          >
            {t('consent.terms')}
          </a>
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={refuse}
          className="px-4 py-2 text-sm text-[#8A9BB8] border border-[#8A9BB8]/40 rounded-lg hover:bg-[#1A2E4A] transition-colors"
        >
          {t('consent.refuse')}
        </button>
        <button
          onClick={accept}
          className="px-4 py-2 text-sm bg-[#C9A84C] text-[#0F1E35] font-medium rounded-lg hover:bg-[#D8B85A] transition-colors"
        >
          {t('consent.accept')}
        </button>
      </div>
    </div>
  );
}
