'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  HERO_CAMERA_PATH,
  createHeroCameraCurve,
  createHeroLookCurve,
} from './cameraPath';

const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _currentLook = new THREE.Vector3(0, 0.05, 0);

/**
 * Scroll-driven camera rig for the hero R3F scene.
 *
 * @param {object} props
 * @param {import('framer-motion').MotionValue<number> | { get: () => number } | null} props.progress
 *   Smoothed 0–1 hero scroll progress (Framer MotionValue). Pass null to freeze at start.
 * @param {boolean} [props.enabled=true] When false (reduced-motion), camera stays at keyframe 0.
 * @param {typeof HERO_CAMERA_PATH} [props.path]
 */
export function ScrollCameraRig({
  progress = null,
  enabled = true,
  path = HERO_CAMERA_PATH,
}) {
  const curve = useMemo(() => createHeroCameraCurve(path), [path]);
  const lookCurve = useMemo(() => createHeroLookCurve(path), [path]);
  const smoothT = useRef(0);

  useFrame((state, delta) => {
    const camera = state.camera;
    const raw = enabled && progress ? THREE.MathUtils.clamp(progress.get(), 0, 1) : 0;
    const lerp = 1 - Math.pow(1 - path.lerpFactor, delta * 60);
    smoothT.current = THREE.MathUtils.lerp(smoothT.current, raw, lerp);

    const t = smoothT.current;
    curve.getPointAt(t, _targetPos);
    lookCurve.getPointAt(t, _targetLook);

    camera.position.lerp(_targetPos, lerp);
    _currentLook.lerp(_targetLook, lerp);
    camera.lookAt(_currentLook);

    const fovTarget = THREE.MathUtils.lerp(path.fov.start, path.fov.end, t);
    if (Math.abs(camera.fov - fovTarget) > 0.01) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, fovTarget, lerp);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

/**
 * Optional DOM-side helper: read a MotionValue into a stable { get } ref for Canvas.
 * Prefer passing the MotionValue directly into ScrollCameraRig.
 */
export function useScrollCameraProgress(motionValue) {
  return motionValue;
}

export { HERO_CAMERA_PATH };
