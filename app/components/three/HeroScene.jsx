'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import SafeBoundary from './SafeBoundary';

const ACCENT = '#8B5CF6';
const ACCENT_BRIGHT = '#A78BFA';

/** Rotates the whole scene *against* cursor movement for a spatial-computing feel. */
function ParallaxRig({ children }) {
  const ref = useRef(null);

  useFrame(({ pointer }) => {
    if (!ref.current) return;
    // Opposition parallax: rotate opposite the pointer, clamped and lerped
    const targetY = -pointer.x * 0.22;
    const targetX = pointer.y * 0.14;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, 0.06);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, 0.06);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, -pointer.x * 0.25, 0.05);
  });

  return <group ref={ref}>{children}</group>;
}

function HeroObjects() {
  return (
    <>
      <Float speed={1.6} rotationIntensity={0.9} floatIntensity={1.4} floatingRange={[-0.25, 0.25]}>
        <mesh position={[-3.2, 1.1, -2]}>
          <torusKnotGeometry args={[0.55, 0.18, 128, 24]} />
          <meshStandardMaterial color={ACCENT} metalness={0.95} roughness={0.12} envMapIntensity={1.4} />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.1} floatingRange={[-0.2, 0.3]}>
        <mesh position={[3.4, -0.6, -2.6]}>
          <icosahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#1E2129" metalness={0.9} roughness={0.18} envMapIntensity={1.6} flatShading />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.6}>
        <mesh position={[2.6, 1.7, -3.4]}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color={ACCENT_BRIGHT} metalness={0.85} roughness={0.15} envMapIntensity={1.5} />
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-2.4, -1.4, -3]}>
          <torusGeometry args={[0.42, 0.12, 16, 48]} />
          <meshStandardMaterial color="#14161B" metalness={0.92} roughness={0.2} envMapIntensity={1.4} />
        </mesh>
      </Float>

      <Sparkles count={70} scale={[10, 5, 4]} size={1.6} speed={0.28} opacity={0.4} color={ACCENT_BRIGHT} position={[0, 0, -2.5]} />
    </>
  );
}

/**
 * Full-screen WebGL environment behind hero content.
 * - HDRI env mapping (drei preset) for realistic reflections
 * - Counter-parallax pointer rig
 * - Renders ONLY while hero is on screen (frameloop gating) → zero cost during page scroll
 */
export default function HeroScene() {
  const reduceMotion = useReducedMotion();
  const wrapperRef = useRef(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.02 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reduceMotion) return null;

  return (
    <div ref={wrapperRef} className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance', stencil: false, depth: true }}
        style={{ pointerEvents: 'none' }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 5, 3]} intensity={0.8} />
        <pointLight position={[-4, -2, 2]} intensity={0.5} color={ACCENT} />

        <SafeBoundary fallback={null}>
          <Suspense fallback={null}>
            <Environment preset="city" background={false} />
          </Suspense>
        </SafeBoundary>

        <ParallaxRig>
          <HeroObjects />
        </ParallaxRig>
      </Canvas>
    </div>
  );
}
