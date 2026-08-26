'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { ScrollCameraRig } from '../../hero/useScrollCamera';
import { HERO_CAMERA_PATH } from '../../hero/cameraPath';

const MAX_LOOK = THREE.MathUtils.degToRad(18);
const LERP = 0.1;
const ACCENT = '#8B5CF6';
const ACCENT_BRIGHT = '#A78BFA';
const BODY = '#1E2129';
const BODY_DARK = '#14161B';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Robot idle + optional cursor look. Does not touch the camera —
 * ScrollCameraRig owns camera transform so the two compose cleanly.
 */
function ProceduralRobot({ lookEnabled, onReact }) {
  const rootRef = useRef(null);
  const headRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const bounceRef = useRef(0);
  const blinkRef = useRef(0);

  useEffect(() => {
    const handler = () => {
      bounceRef.current = 1;
      blinkRef.current = 1;
      onReact?.();
    };
    window.addEventListener('hero-robot-react', handler);
    return () => window.removeEventListener('hero-robot-react', handler);
  }, [onReact]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(t * 1.4) * 0.07;
      const bounce = bounceRef.current;
      rootRef.current.scale.setScalar(1 + bounce * 0.12);
      bounceRef.current = Math.max(0, bounce - delta * 2.8);
    }

    if (headRef.current) {
      headRef.current.rotation.x = lerp(headRef.current.rotation.x, targetRot.current.x, LERP);
      headRef.current.rotation.y = lerp(headRef.current.rotation.y, targetRot.current.y, LERP);
      headRef.current.rotation.z = Math.sin(t * 0.9) * 0.04;
    }

    const blink = blinkRef.current > 0.5 ? 0.08 : 1;
    blinkRef.current = Math.max(0, blinkRef.current - delta * 3);
    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;
    }

    if (lookEnabled) {
      const { pointer } = state;
      targetRot.current.y = THREE.MathUtils.clamp(pointer.x * MAX_LOOK, -MAX_LOOK, MAX_LOOK);
      targetRot.current.x = THREE.MathUtils.clamp(-pointer.y * MAX_LOOK * 0.65, -MAX_LOOK * 0.65, MAX_LOOK * 0.65);
    } else {
      targetRot.current.x = Math.sin(t * 0.6) * 0.08;
      targetRot.current.y = Math.sin(t * 0.45) * 0.1;
    }
  });

  return (
    <group ref={rootRef} position={[0, -0.15, 0]}>
      <mesh position={[0, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.75, 16]} />
        <meshStandardMaterial color={BODY} metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.05, 0.38]}>
        <boxGeometry args={[0.35, 0.18, 0.08]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} />
      </mesh>

      <group ref={headRef} position={[0, 0.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.62, 0.55]} />
          <meshStandardMaterial color={BODY_DARK} metalness={0.4} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.22, 8]} />
          <meshStandardMaterial color={ACCENT_BRIGHT} emissive={ACCENT} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={ACCENT_BRIGHT} emissive={ACCENT} emissiveIntensity={0.8} />
        </mesh>
        <mesh ref={leftEyeRef} position={[-0.18, 0.06, 0.29]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={ACCENT_BRIGHT} emissive={ACCENT} emissiveIntensity={1.2} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.18, 0.06, 0.29]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={ACCENT_BRIGHT} emissive={ACCENT} emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0.48, -0.05, 0.1]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.12, 0.35, 0.12]} />
          <meshStandardMaterial color={BODY} metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[-0.48, -0.05, 0.1]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.12, 0.35, 0.12]} />
          <meshStandardMaterial color={BODY} metalness={0.3} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function StaticRobotFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="relative h-16 w-16 rounded-xl bg-gradient-to-br from-[#14161B] to-[#1E2129] shadow-glow-sm sm:h-20 sm:w-20"
        style={{ boxShadow: '0 0 24px rgba(139,92,246,0.35)' }}
      >
        <div className="absolute left-2 top-4 h-2 w-2 rounded-full bg-[#A78BFA]" />
        <div className="absolute right-2 top-4 h-2 w-2 rounded-full bg-[#A78BFA]" />
        <div className="absolute bottom-3 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-[#8B5CF6]/60" />
      </div>
    </div>
  );
}

/**
 * OPTION B — React Three Fiber procedural robot + scroll-driven camera.
 *
 * @param {{ scrollProgress?: import('framer-motion').MotionValue<number> | null }} props
 */
export default function HeroRobotR3F({ scrollProgress = null }) {
  const reduceMotion = useReducedMotion();
  const [lookEnabled, setLookEnabled] = useState(false);

  useEffect(() => {
    setLookEnabled(!window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  const triggerReact = () => {
    window.dispatchEvent(new CustomEvent('hero-robot-react'));
  };

  if (reduceMotion) {
    return <StaticRobotFallback />;
  }

  const start = HERO_CAMERA_PATH.positions[0];

  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.5]}
      camera={{ position: [start.x, start.y, start.z], fov: HERO_CAMERA_PATH.fov.start }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onClick={triggerReact}
      onPointerMissed={() => {}}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 3, 4]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-2, 1, 2]} intensity={0.6} color={ACCENT} />
      <pointLight position={[0, -1, 1]} intensity={0.25} color={ACCENT_BRIGHT} />
      <ScrollCameraRig progress={scrollProgress} enabled={!reduceMotion} />
      <ProceduralRobot lookEnabled={lookEnabled} />
    </Canvas>
  );
}
