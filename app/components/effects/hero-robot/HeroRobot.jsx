'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroRobotSkeleton, { HERO_ROBOT_MODE } from './HeroRobotSkeleton';

const HeroRobotR3F = dynamic(() => import('./HeroRobotR3F'), {
  ssr: false,
  loading: () => <HeroRobotSkeleton />,
});

const HeroRobotSpline = dynamic(() => import('./HeroRobotSpline'), {
  ssr: false,
  loading: () => <HeroRobotSkeleton />,
});

/**
 * Hero robot slot — lazy-loaded 3D character above the name.
 * Mode: NEXT_PUBLIC_HERO_ROBOT=r3f | spline (default r3f)
 */
export default function HeroRobot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const Robot = HERO_ROBOT_MODE === 'spline' ? HeroRobotSpline : HeroRobotR3F;

  return (
    <div
      className="pointer-events-none relative mx-auto mb-3 h-[100px] w-[100px] sm:mb-4 sm:h-[140px] sm:w-[140px] md:mb-5 md:h-[168px] md:w-[168px]"
      aria-hidden="true"
    >
      <div className="pointer-events-auto h-full w-full touch-manipulation">
        {mounted ? (
          <Suspense fallback={<HeroRobotSkeleton />}>
            <Robot />
          </Suspense>
        ) : (
          <HeroRobotSkeleton />
        )}
      </div>
    </div>
  );
}
