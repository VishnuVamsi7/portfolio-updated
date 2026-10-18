'use client';

import { Canvas } from '@react-three/fiber';
import { JourneyCameraRig } from './useJourneyCamera';
import { Starfield } from './Starfield';
import { TunnelRings } from './TunnelRings';
import { BranchGuides } from './BranchGuides';
import { Constellations } from './Constellations';
import { WORMHOLE_JOURNEY } from './journeyPath';

/**
 * Fixed full-screen wormhole canvas. Renders behind all DOM content
 * (parent must layer sections above with z-10). Never receives pointer
 * events and is hidden from assistive tech — all content stays in the DOM.
 *
 * Render <StaticFallback/> instead when `enabled` is false (reduced motion,
 * mobile, or WebGL failure).
 */
export default function WormholeCanvas({ progress, enabled = true }) {
  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{
          fov: WORMHOLE_JOURNEY.fov.start,
          position: [0, 0.3, 6.5],
          near: 0.1,
          far: 80,
        }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#04060d']} />
        <Starfield />
        <TunnelRings />
        <BranchGuides />
        <Constellations />
        <JourneyCameraRig progress={progress} enabled={enabled} />
      </Canvas>
    </div>
  );
}

/** Non-WebGL fallback: static starfield gradient. */
export function StaticFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, #0b1430 0%, #04060d 65%), radial-gradient(1px 1px at 20% 30%, rgba(200,220,255,.5) 50%, transparent 51%), radial-gradient(1px 1px at 70% 60%, rgba(200,220,255,.4) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 40% 80%, rgba(200,220,255,.35) 50%, transparent 51%), radial-gradient(1px 1px at 85% 20%, rgba(200,220,255,.45) 50%, transparent 51%)',
      }}
    />
  );
}
