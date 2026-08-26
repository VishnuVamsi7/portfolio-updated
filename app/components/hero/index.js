/**
 * Scroll-driven hero camera — public API.
 *
 * Inside R3F Canvas:
 *   import { ScrollCameraRig } from '../hero'
 *   <ScrollCameraRig progress={smoothProgress} enabled={!reduceMotion} />
 *
 * Tune keyframes / lerp / scroll offsets in cameraPath.js
 */
export { ScrollCameraRig, useScrollCameraProgress } from './useScrollCamera';
export {
  HERO_CAMERA_PATH,
  createHeroCameraCurve,
  createHeroLookCurve,
} from './cameraPath';
