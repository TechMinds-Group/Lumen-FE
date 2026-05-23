import { useEffect, useRef, useState } from 'react';

interface LazyRenderProps {
  children: React.ReactNode;
  /** CSS class for the skeleton placeholder shown before the element enters the viewport */
  skeletonClassName?: string;
  /** Extra margin around the viewport to start loading before the element is visible (default: 300px) */
  rootMargin?: string;
}

/**
 * Defers rendering of children until they are near the viewport.
 * Uses IntersectionObserver; once visible the element stays rendered.
 */
export function LazyRender({
  children,
  skeletonClassName,
  rootMargin = '300px',
}: LazyRenderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  if (isVisible) {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={
        skeletonClassName ??
        'h-48 rounded-lg bg-[#ECE7DA] dark:bg-[#131E30] animate-pulse'
      }
    />
  );
}
