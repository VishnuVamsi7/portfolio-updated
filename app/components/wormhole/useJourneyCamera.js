'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  WORMHOLE_JOURNEY,
  branchSwingAt,
  createJourneyCurve,
  createJourneyLookCurve,
} from './journeyPath';

const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();
const _currentLook = new THREE.Vector3(0, 0.1, 0);

/**
 * Page-level scroll camera rig for the wormhole journey.
 * Mirrors app/components/hero/useScrollCamera.js conventions.
 *
 * @param {object} props
 * @param {import('framer-motion').MotionValue<number> | null} props.progress
 *   Smoothed 0–1 page scroll progress. Null freezes at the hero keyframe.
 * @param {boolean} [props.enabled=true] False on reduced-motion / mobile.
 * @param {typeof WORMHOLE_JOURNEY} [props.path]
 */
export function JourneyCameraRig({
  progress = null,
  enabled = true,
  path = WORMHOLE_JOURNEY,
}) {
  const curve = useMemo(() => createJourneyCurve(path), [path]);
  const lookCurve = useMemo(() => createJourneyLookCurve(path), [path]);
  const smoothT = useRef(0);

  useFrame((state, delta) => {
    const camera = state.camera;
    const raw = enabled && progress ? THREE.MathUtils.clamp(progress.get(), 0, 1) : 0;
    const lerp = 1 - Math.pow(1 - path.lerpFactor, delta * 60);
    smoothT.current = THREE.MathUtils.lerp(smoothT.current, raw, lerp);

    const t = smoothT.current;
    curve.getPointAt(t, _targetPos);
    _targetPos.x += branchSwingAt(t, path.branchSwing);
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

export { WORMHOLE_JOURNEY };
