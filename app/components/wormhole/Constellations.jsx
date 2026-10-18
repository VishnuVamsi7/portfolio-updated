'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Skill constellations — clusters of connected stars, one per skill family.
 * Labels live in DOM; these are the visual clusters the camera drifts past
 * at the skills station.
 */
const CLUSTERS = [
  {
    id: 'ai-backend',
    color: '#7dd3fc',
    center: [-2.3, 0.7, 0.4],
    // offsets form a small kite: Python–FastAPI–LangChain–FAISS
    offsets: [
      [-0.28, -0.1, 0],
      [0.14, -0.04, 0.05],
      [-0.1, 0.22, -0.04],
      [0.3, 0.18, 0.02],
    ],
    links: [
      [0, 1],
      [1, 3],
      [0, 2],
      [2, 3],
    ],
  },
  {
    id: 'frontend',
    color: '#c4b5fd',
    center: [0, -0.5, 0.1],
    offsets: [
      [-0.3, -0.06, 0],
      [0.12, -0.02, 0.04],
      [-0.12, 0.24, -0.03],
      [0.32, 0.2, 0.02],
    ],
    links: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ],
  },
  {
    id: 'data-devops',
    color: '#5eead4',
    center: [2.3, 0.7, 0.4],
    offsets: [
      [-0.24, -0.08, 0],
      [0.2, 0.0, 0.03],
      [0.0, 0.26, -0.02],
    ],
    links: [
      [0, 1],
      [1, 2],
      [0, 2],
    ],
  },
];

function Cluster({ cluster }) {
  const { lineGeo, starGeo } = useMemo(() => {
    const pts = cluster.offsets.map(
      ([x, y, z]) =>
        new THREE.Vector3(
          cluster.center[0] + x,
          cluster.center[1] + y,
          cluster.center[2] + z,
        ),
    );
    const linePts = [];
    cluster.links.forEach(([a, b]) => linePts.push(pts[a], pts[b]));
    return {
      lineGeo: new THREE.BufferGeometry().setFromPoints(linePts),
      starGeo: new THREE.BufferGeometry().setFromPoints(pts),
    };
  }, [cluster]);

  return (
    <group>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={cluster.color} transparent opacity={0.5} />
      </lineSegments>
      <points geometry={starGeo}>
        <pointsMaterial size={0.09} color="#e0f2fe" sizeAttenuation />
      </points>
    </group>
  );
}

export function Constellations() {
  return (
    <group>
      {CLUSTERS.map((c) => (
        <Cluster key={c.id} cluster={c} />
      ))}
    </group>
  );
}

export { CLUSTERS };
