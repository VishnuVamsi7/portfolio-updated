/**
 * Wormhole journey — public API.
 *
 * Page usage:
 *   import WormholeCanvas, { StaticFallback } from '@/app/components/wormhole';
 *   import { JourneyCameraRig } from '@/app/components/wormhole';
 *
 *   const { scrollYProgress } = useScroll(); // framer-motion, page-level
 *   <WormholeCanvas progress={scrollYProgress} enabled={!reduceMotion && !isMobile} />
 *
 * Tune the flight in journeyPath.js — never in the rig.
 */
export { default } from './WormholeCanvas';
export { StaticFallback } from './WormholeCanvas';
export { JourneyCameraRig } from './useJourneyCamera';
export {
  WORMHOLE_JOURNEY,
  branchSwingAt,
  createJourneyCurve,
  createJourneyLookCurve,
} from './journeyPath';
export { Starfield } from './Starfield';
export { TunnelRings } from './TunnelRings';
export { BranchGuides, BRANCHES } from './BranchGuides';
export { Constellations, CLUSTERS } from './Constellations';
