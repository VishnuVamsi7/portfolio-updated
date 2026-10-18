'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * The three project-category branches fanning out of the wormhole —
 * glowing guide curves the camera sweeps past at the projects station.
 * Real project cards live in DOM; these are wayfinding light-trails.
 */
const BRANCHES = [
  { id: 'rag-llm', color: '#5eead4', label: 'RAG / LLM', side: -1 },
  { id: 'fullstack', color: '#c4b5fd', label: 'Full-Stack', side: 0 },
  { id: 'data-ml', color: '#fbbf24', label: 'Data / ML', side: 1 },
];

function branchCurve(side) {
  const pts =
    side === 0
      ? [
          new THREE.Vector3(0, 0.1, 2.9),
          new THREE.Vector3(0.12, 0.35, 2.2),
          new THREE.Vector3(-0.08, 0.7, 1.5),
          new THREE.Vector3(0, 1.0, 0.9),
        ]
      : [
          new THREE.Vector3(0, 0.1, 2.9),
          new THREE.Vector3(side * 1.3, 0.35, 2.2),
          new THREE.Vector3(side * 2.1, 0.7, 1.5),
          new THREE.Vector3(side * 1.2, 1.0, 0.9),
        ];
  return new THREE.CatmullRomCurve3(pts);
}

export function BranchGuides() {
  const tubes = useMemo(
    () =>
      BRANCHES.map((b) => ({
        ...b,
        geometry: new THREE.TubeGeometry(branchCurve(b.side), 48, 0.02, 8, false),
      })),
    [],
  );

  return (
    <group>
      {tubes.map((t) => (
        <mesh key={t.id} geometry={t.geometry}>
          <meshBasicMaterial color={t.color} transparent opacity={0.55} />
        </mesh>
      ))}
      {/* branch tip beacons */}
      {tubes.map((t, i) => {
        const tip = branchCurve([-1, 0, 1][i]).getPointAt(1);
        return (
          <mesh key={`tip-${t.id}`} position={tip}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={t.color} />
          </mesh>
        );
      })}
    </group>
  );
}

export { BRANCHES };
