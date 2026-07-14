'use client';

/** Switch hero robot: "r3f" (procedural) or "spline" (embed). Set via NEXT_PUBLIC_HERO_ROBOT. */
export const HERO_ROBOT_MODE = process.env.NEXT_PUBLIC_HERO_ROBOT || 'r3f';

export default function HeroRobotSkeleton() {
  return (
    <div
      className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-2xl border border-line-subtle bg-surface/40 sm:h-[140px] sm:w-[140px] md:h-[168px] md:w-[168px]"
      aria-hidden="true"
    >
      <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" />
    </div>
  );
}
