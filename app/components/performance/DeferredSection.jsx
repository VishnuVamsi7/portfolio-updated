'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Keeps below-the-fold interactive bundles out of the critical path while
 * reserving space so navigation and layout remain stable.
 */
export default function DeferredSection({
  id,
  enabled,
  minHeight = 800,
  children,
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || ready) return undefined;
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: '350px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, ready]);

  return (
    <div
      ref={ref}
      id={ready ? undefined : id}
      style={{ minHeight }}
      aria-busy={enabled && !ready ? 'true' : undefined}
    >
      {ready ? children : <span className="sr-only">Loading {id} section</span>}
    </div>
  );
}
