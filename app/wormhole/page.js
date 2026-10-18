'use client';

/**
 * /wormhole — scaffold preview route for the v2 journey.
 *
 * NOT the live homepage. This page exists so the rig, stations, and
 * fallbacks can be reviewed in isolation before Phase 2 replaces these
 * placeholder sections with real Figma-designed content.
 */
import { useEffect, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import WormholeCanvas, { StaticFallback } from '../components/wormhole/WormholeCanvas';
import { WORMHOLE_JOURNEY } from '../components/wormhole/journeyPath';

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

function GlassPanel({ kicker, title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur-md">
      {kicker && (
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-teal-300">
          {kicker}
        </div>
      )}
      <h2 className="mb-4 text-3xl font-extrabold text-slate-100">{title}</h2>
      <div className="text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  );
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

      <div className="relative z-10">
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-xl text-center">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300">
              AI Developer · RAG &amp; LLM Engineer
            </div>
            <h1 className="text-5xl font-extrabold leading-tight">
              Sai Vishnu Vamsi
              <br />
              Senagasetty
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-slate-300">
              Scaffold preview — scroll to fly the wormhole. Placeholder copy;
              real hero content arrives in Phase 2.
            </p>
            <div className="mt-2 text-xs text-slate-500">
              {webglOn ? 'WebGL journey live' : 'Static fallback (reduced motion / mobile)'}
            </div>
          </div>
        </section>

        <section className="flex min-h-[130vh] items-center justify-center px-6">
          <div className="w-full max-w-3xl">
            <GlassPanel kicker="Station 02 — Projects" title="Wormhole forks">
              <p>
                Placeholder: three category columns go here —
                <strong className="text-teal-300"> RAG / LLM</strong>,
                <strong className="text-violet-300"> Full-Stack</strong>,
                <strong className="text-amber-300"> Data / ML</strong> — two
                project cards each, built from Figma via MCP in Phase 2.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Camera swings past the three branch light-trails behind this panel.
              </p>
            </GlassPanel>
          </div>
        </section>

        <section className="flex min-h-[130vh] items-center justify-center px-6">
          <div className="w-full max-w-3xl">
            <GlassPanel kicker="Station 03 — Skills" title="Constellations">
              <p>
                Placeholder: three skill-family groups go here — AI / Backend,
                Frontend, Data / DevOps — as connected pill clusters mirroring
                the constellation visuals drifting behind.
              </p>
            </GlassPanel>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-xl text-center">
            <GlassPanel kicker="Station 04 — Contact" title="You've arrived">
              <p>
                Placeholder: email, LinkedIn, GitHub, availability line.
                The journey ends in calm starfield.
              </p>
              <p className="mt-4 text-xs text-slate-500">
                Stations: {WORMHOLE_JOURNEY.stations.map((s) => s.id).join(' → ')}
              </p>
            </GlassPanel>
          </div>
        </section>
      </div>
    </main>
  );
}
