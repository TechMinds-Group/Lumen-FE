import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAdBlockDetected from '../hooks/useAdBlockDetected';
import useAdConsent from '../hooks/useAdConsent';

const DISMISSED_KEY = 'lumen_adblock_dismissed';

export function AdBlockNotice() {
  const { t } = useTranslation();
  const { adBlockDetected, loading } = useAdBlockDetected();
  const { consent } = useAdConsent();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(DISMISSED_KEY) === 'true';
  });

  // Hide if: still probing, no blocker detected, user dismissed, user refused consent
  if (loading || !adBlockDetected || dismissed || consent === 'refused') return null;

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
  };

  return (
    <div className="border-t-2 border-[#C9A84C] bg-[#F2EEE2] dark:bg-[#1A2E4A] px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-sm text-[#0F1E35] dark:text-[#F2EEE2] font-['Inter']">
        {t('adblock.notice')}
      </p>
      <button
        onClick={dismiss}
        aria-label="Fechar"
        className="shrink-0 text-[#6A6355] dark:text-[#8A9BB8] hover:text-[#0F1E35] dark:hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
