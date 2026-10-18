import * as THREE from 'three';

/**
 * Wormhole journey camera path — page-level scroll rig.
 *
 * Conventions follow app/components/hero/cameraPath.js: tune keyframes here,
 * never in the animation hook. Progress is 0 → 1 across the whole page
 * (framer-motion useScroll), not per-section.
 *
 * Stations (fraction of page scroll):
 *   0.00 hero · 0.36 projects (wormhole forks) · 0.52 experience (trail)
 *   0.68 skills (constellations) · 1.00 contact (emerge)
 */
export const WORMHOLE_JOURNEY = {
  lerpFactor: 0.07,
  fov: { start: 55, end: 42 },

  stations: [
    { id: 'hero', label: 'Hero — starfield', at: 0.0 },
    { id: 'projects', label: 'Projects — wormhole forks', at: 0.36 },
    { id: 'experience', label: 'Experience — trail', at: 0.52 },
    { id: 'skills', label: 'Skills — constellations', at: 0.68 },
    { id: 'contact', label: 'Contact — emerge', at: 1.0 },
  ],

  /** Lateral sway applied while passing the project forks (world units). */
  branchSwing: { center: 0.38, width: 0.1, amount: 0.55 },

  /** World-space keyframes along a Catmull-Rom curve. */
  positions: [
    new THREE.Vector3(0, 0.3, 6.5), // hero — face-on starfield
    new THREE.Vector3(0, 0.2, 4.4), // approach the tunnel mouth
    new THREE.Vector3(0, 0.05, 2.4), // inside the tunnel
    new THREE.Vector3(0.35, 0.1, 2.7), // drift toward branch guides
    new THREE.Vector3(-0.3, 0.2, 3.0), // sweep across the forks
    new THREE.Vector3(0, 0.35, 3.6), // constellations drift by
    new THREE.Vector3(0, 0.5, 5.4), // emerging
    new THREE.Vector3(0, 0.6, 7.2), // contact — calm, pulled back
  ],

  /** Look-at targets (same count as positions). */
  lookAts: [
    new THREE.Vector3(0, 0.1, 0),
    new THREE.Vector3(0, 0.08, 0),
    new THREE.Vector3(0, 0.05, -1),
    new THREE.Vector3(0.1, 0.08, -0.5),
    new THREE.Vector3(-0.1, 0.1, -0.5),
    new THREE.Vector3(0, 0.15, 0),
    new THREE.Vector3(0, 0.2, 0),
    new THREE.Vector3(0, 0.25, 0),
  ],
};

export function createJourneyCurve(path = WORMHOLE_JOURNEY) {
  return new THREE.CatmullRomCurve3(path.positions, false, 'catmullrom', 0.35);
}

export function createJourneyLookCurve(path = WORMHOLE_JOURNEY) {
  return new THREE.CatmullRomCurve3(path.lookAts, false, 'catmullrom', 0.35);
}

/**
 * Lateral sway amount at progress t — peaks while passing the project forks.
 * Returns world-units offset added to camera x.
 */
export function branchSwingAt(t, swing = WORMHOLE_JOURNEY.branchSwing) {
  const g = Math.exp(-Math.pow((t - swing.center) / swing.width, 2));
  const sway = Math.sin(((t - (swing.center - swing.width)) / (swing.width * 2)) * Math.PI * 2);
  return swing.amount * g * sway;
}
