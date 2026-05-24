import { useEffect, useRef } from 'react';
import useAdConsent from '../../hooks/useAdConsent';

export type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical';

interface GoogleAdUnitProps {
  adSlot: string;
  adFormat: AdFormat;
  className?: string;
  responsive?: boolean;
}

const MIN_HEIGHTS: Record<AdFormat, number> = {
  auto: 90,
  rectangle: 250,
  horizontal: 90,
  vertical: 600,
};

export function GoogleAdUnit({
  adSlot,
  adFormat,
  className = '',
  responsive = true,
}: GoogleAdUnitProps) {
  const { consent } = useAdConsent();
  const pushed = useRef(false);

  useEffect(() => {
    if (consent !== 'accepted' || pushed.current || typeof window === 'undefined') return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Script not yet ready — will fire when injected by ConsentBanner
    }
  }, [consent]);

  // User explicitly refused: render nothing, no placeholder (no layout shift)
  if (consent === 'refused') return null;

  const adClient = import.meta.env.VITE_ADSENSE_CLIENT ?? 'ca-pub-XXXXXXXXXX';

  return (
    <div
      className={className}
      // min-height prevents CLS while the ad slot is pending or loading
      style={{ minHeight: MIN_HEIGHTS[adFormat], backgroundColor: 'transparent' }}
    >
      {consent === 'accepted' && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', backgroundColor: 'transparent' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      )}
    </div>
  );
}
