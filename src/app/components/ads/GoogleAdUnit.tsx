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
  const insRef  = useRef<HTMLModElement>(null);
  const pushed  = useRef(false);

  useEffect(() => {
    if (consent !== 'accepted' || pushed.current || typeof window === 'undefined') return;

    const ins = insRef.current;
    if (!ins) return;

    // Push only once the element has a non-zero layout width.
    // A ResizeObserver fires synchronously after the browser has painted and
    // assigned dimensions — this avoids the "No slot size for availableWidth=0"
    // TagError that occurs when push() is called before the element is sized.
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (width > 0 && !pushed.current) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        } catch {
          // Script not yet ready — ConsentBanner will have injected it by now,
          // but a timing edge case on slow connections can reach here first.
        }
        observer.disconnect();
      }
    });

    observer.observe(ins);
    return () => observer.disconnect();
  }, [consent]);

  if (consent === 'refused') return null;

  const adClient = import.meta.env.VITE_ADSENSE_CLIENT ?? 'ca-pub-XXXXXXXXXX';

  return (
    <div
      className={className}
      style={{ minHeight: MIN_HEIGHTS[adFormat], width: '100%', backgroundColor: 'transparent' }}
    >
      {consent === 'accepted' && (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', backgroundColor: 'transparent' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      )}
    </div>
  );
}
