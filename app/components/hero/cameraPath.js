import * as THREE from 'three';

/**
 * Hero scroll-camera path — tune here without touching animation logic.
 *
 * scrollRange: Framer useScroll offsets on the hero pin wrapper
 *   ['start start', 'end start'] = progress 0 when hero top hits viewport top,
 *   progress 1 when hero bottom hits viewport top
 * lerpFactor: per-frame damping toward the target sample (higher = snappier)
 * fov: degrees; subtle FOV shift sells depth without large position deltas
 */
export const HERO_CAMERA_PATH = {
  scrollRange: ['start start', 'end start'],
  lerpFactor: 0.08,
  fov: { start: 42, end: 36 },
  /** World-space keyframes along a Catmull-Rom curve (3–4 is enough). */
  positions: [
    new THREE.Vector3(0, 0.22, 2.45), // open — face-on
    new THREE.Vector3(0.55, 0.35, 2.05), // drift right / closer
    new THREE.Vector3(-0.25, 0.55, 1.65), // rise / slight left
    new THREE.Vector3(0.05, 0.85, 1.35), // exit — pull up toward next section
  ],
  /** Look-at targets (same count as positions; sampled with progress). */
  lookAts: [
    new THREE.Vector3(0, 0.05, 0),
    new THREE.Vector3(0.05, 0.08, 0),
    new THREE.Vector3(0, 0.12, 0),
    new THREE.Vector3(0, 0.2, 0),
  ],
};

export function createHeroCameraCurve(path = HERO_CAMERA_PATH) {
  return new THREE.CatmullRomCurve3(path.positions, false, 'catmullrom', 0.35);
}

export function createHeroLookCurve(path = HERO_CAMERA_PATH) {
  return new THREE.CatmullRomCurve3(path.lookAts, false, 'catmullrom', 0.35);
}
