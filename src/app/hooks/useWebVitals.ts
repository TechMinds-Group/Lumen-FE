import { useEffect } from 'react';
import type { Metric } from 'web-vitals';

type ReportHandler = (metric: Metric) => void;

/**
 * Reports Core Web Vitals (LCP, INP, CLS, FCP, TTFB) to the provided handler.
 *
 * Usage — console logging (development):
 *   useWebVitals(console.log);
 *
 * Usage — send to analytics endpoint:
 *   useWebVitals((metric) => {
 *     fetch('/api/vitals', {
 *       method: 'POST',
 *       body: JSON.stringify(metric),
 *       headers: { 'Content-Type': 'application/json' },
 *     });
 *   });
 *
 * Usage — Google Analytics 4:
 *   useWebVitals((metric) => {
 *     gtag('event', metric.name, {
 *       value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
 *       event_category: 'Web Vitals',
 *       event_label: metric.id,
 *       non_interaction: true,
 *     });
 *   });
 */
export function useWebVitals(onReport: ReportHandler = () => {}) {
  useEffect(() => {
    let cancelled = false;

    async function register() {
      const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals');
      if (cancelled) return;
      onCLS(onReport);
      onFCP(onReport);
      onINP(onReport);
      onLCP(onReport);
      onTTFB(onReport);
    }

    register();
    return () => { cancelled = true; };
  // onReport is intentionally excluded — changes mid-session are not meaningful
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
