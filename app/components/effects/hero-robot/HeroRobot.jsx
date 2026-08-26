'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroRobotSkeleton from './HeroRobotSkeleton';

const HeroRobotR3F = dynamic(() => import('./HeroRobotR3F'), {
  ssr: false,
  loading: () => <HeroRobotSkeleton />,
});

/**
 * Hero robot slot — lazy-loaded R3F character above the name.
 * Pass Framer MotionValue scrollProgress for scroll-driven camera.
 *
 * @param {{ scrollProgress?: import('framer-motion').MotionValue<number> | null }} props
 */
export default function HeroRobot({ scrollProgress = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="pointer-events-none relative mx-auto mb-3 h-[120px] w-[120px] sm:mb-4 sm:h-[160px] sm:w-[160px] md:mb-5 md:h-[200px] md:w-[200px]"
      aria-hidden="true"
    >
      <div className="pointer-events-auto h-full w-full touch-manipulation">
        {mounted ? (
          <Suspense fallback={<HeroRobotSkeleton />}>
            <HeroRobotR3F scrollProgress={scrollProgress} />
          </Suspense>
        ) : (
          <HeroRobotSkeleton />
        )}
      </div>
    </div>
  );
}
