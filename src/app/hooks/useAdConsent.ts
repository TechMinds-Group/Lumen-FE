import { useState, useEffect } from 'react';

export type ConsentStatus = 'accepted' | 'refused' | 'pending';

const CONSENT_KEY = 'lumen_consent';
export const CONSENT_EVENT = 'lumen:consent-update';

export default function useAdConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(() => {
    if (typeof window === 'undefined') return 'pending';
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'true') return 'accepted';
    if (stored === 'false') return 'refused';
    return 'pending';
  });

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'true') setConsent('accepted');
      else if (stored === 'false') setConsent('refused');
    };
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);

  return { consent };
}
