'use client';

/**
 * /wormhole — v2 journey preview route.
 *
 * NOT the live homepage. Real station sections (built from the Figma designs
 * and docs/content-spec.md) render as DOM overlays above the fixed WebGL
 * wormhole canvas. Scroll to fly the journey: hero → projects → skills →
 * contact.
 */
import { useEffect, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import WormholeCanvas, { StaticFallback } from '../components/wormhole/WormholeCanvas';
import HeroStation from '../components/wormhole/sections/HeroStation';
import ProjectsStation from '../components/wormhole/sections/ProjectsStation';
import SkillsStation from '../components/wormhole/sections/SkillsStation';
import ContactStation from '../components/wormhole/sections/ContactStation';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    setMobile(mq.matches);
    const onChange = (e) => setMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return mobile;
}

export default function WormholePreviewPage() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 18 });
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const webglOn = !reduceMotion && !isMobile;

  return (
    <main className="relative min-h-screen bg-[#04060d] text-slate-100">
      {webglOn ? (
        <WormholeCanvas progress={smooth} enabled />
      ) : (
        <StaticFallback />
      )}

      {/* DOM overlay: transparent sections float above the fixed canvas */}
      <div className="relative z-10">
        <HeroStation />

        <div className="flex min-h-[130vh] w-full items-center">
          <ProjectsStation />
        </div>

        <div className="flex min-h-[130vh] w-full items-center">
          <SkillsStation />
        </div>

        <ContactStation />
      </div>
    </main>
  );
}
