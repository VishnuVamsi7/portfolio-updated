'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Wormhole tunnel — a series of glowing rings the camera passes through
 * between the hero and projects stations (world z ≈ 4.6 → 0.8).
 */
const RING_COUNT = 16;

export function TunnelRings() {
  const group = useRef();
  const mats = useRef([]);

  const rings = useMemo(
    () =>
      Array.from({ length: RING_COUNT }, (_, i) => {
        const t = i / (RING_COUNT - 1);
        return {
          z: THREE.MathUtils.lerp(4.6, 0.8, t),
          radius: THREE.MathUtils.lerp(1.15, 2.5, t),
          phase: Math.random() * Math.PI * 2,
        };
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mats.current.forEach((m, i) => {
      if (!m) return;
      m.opacity = 0.22 + 0.14 * Math.sin(t * 1.4 + rings[i].phase);
    });
    if (group.current) group.current.rotation.z = t * 0.02;
  });

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={i} position={[0, 0.1, r.z]}>
          <torusGeometry args={[r.radius, 0.016, 8, 64]} />
          <meshBasicMaterial
            ref={(m) => (mats.current[i] = m)}
            color="#5eead4"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
