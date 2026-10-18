'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollVelocity } from './scrollVelocity';

/**
 * SmokeVeil — drifting smoke sprites + scroll-reactive fog for the wormhole.
 *
 * A band of large, soft additive sprites hangs in the tunnel. Their opacity
 * (and the scene fog density) follows scroll velocity: scroll fast and the
 * tunnel fills with smoke; stop scrolling and it settles back to a faint haze.
 * Pure decoration — aria-hidden at the canvas level, zero pointer events.
 */

function makeSmokeTexture() {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d');
  // Soft puff: brighter core fading to transparent, slightly irregular.
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0.0, 'rgba(148, 163, 184, 0.5)');
  g.addColorStop(0.35, 'rgba(125, 211, 252, 0.18)');
  g.addColorStop(0.65, 'rgba(148, 163, 184, 0.07)');
  g.addColorStop(1.0, 'rgba(148, 163, 184, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(c);
}

export function SmokeVeil({ count = 26 }) {
  const group = useRef();

  const puffs = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 9,
        z: 5.5 - Math.random() * 40,
        size: 4.5 + Math.random() * 7.5,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.1,
        drift: 0.06 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  const { texture, material } = useMemo(() => {
    const texture = makeSmokeTexture();
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.04,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    return { texture, material };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const v = scrollVelocity.current; // 0 = still … ~1.5 = fast
    const d = Math.min(Math.max(delta, 0.0001), 0.1);
    const ease = 1 - Math.exp(-d * 3);

    // Smoke thickens with scroll speed, settles to a faint haze at rest.
    const targetOpacity = Math.min(0.04 + v * 0.45, 0.5);
    material.opacity += (targetOpacity - material.opacity) * ease;

    // Fog deepens while moving — the "travelling through smoke" feel.
    const fog = state.scene.fog;
    if (fog && fog.isFogExp2) {
      const targetDensity = 0.026 + Math.min(v, 1.2) * 0.055;
      fog.density += (targetDensity - fog.density) * (1 - Math.exp(-d * 2.2));
    }

    // Slow ambient drift so the haze never looks frozen.
    const t = state.clock.elapsedTime;
    const kids = group.current?.children;
    if (kids) {
      for (let i = 0; i < kids.length; i++) {
        const p = puffs[i];
        const m = kids[i];
        m.position.y = p.y + Math.sin(t * p.drift + p.phase) * 0.9;
        m.position.x = p.x + Math.cos(t * p.drift * 0.7 + p.phase) * 0.9;
        m.rotation.z = p.rot + t * p.spin;
      }
    }
  });

  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} rotation={[0, 0, p.rot]}>
          <planeGeometry args={[p.size, p.size]} />
          {/* Shared material — opacity is driven globally in useFrame. */}
          <primitive object={material} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
