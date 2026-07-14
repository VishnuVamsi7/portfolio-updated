'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import AudioAuraShader from '../effects/AudioAuraShader';
import SafeBoundary from './SafeBoundary';
import { useCompanion } from './CompanionContext';
import { COMPANION_SECTIONS } from '../../lib/companionSections';

const AVATAR_SIZE = 132;
const EDGE_MARGIN = 20;
/** Set NEXT_PUBLIC_COMPANION_MODEL_URL or place companion.glb — otherwise procedural bot (no network request). */
const MODEL_URL = process.env.NEXT_PUBLIC_COMPANION_MODEL_URL || '';
const SPRING = { stiffness: 80, damping: 12 };

function useModelAvailable(url) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!url) {
      setAvailable(false);
      return undefined;
    }
    let cancelled = false;
    fetch(url, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return available;
}

/* ---------- 3D: GLTF model with sine float ---------- */
function GltfCompanion() {
  const { scene } = useGLTF(MODEL_URL);
  const ref = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!ref.current) return;
    ref.current.position.y = Math.sin(t * 1.5) * 0.12;
    ref.current.rotation.y = Math.sin(t * 0.4) * 0.35;
    ref.current.rotation.z = Math.sin(t * 0.9) * 0.05;
  });

  return <primitive ref={ref} object={scene} scale={1.1} />;
}

/* ---------- 3D: procedural fallback (no GLB required) ---------- */
function ProceduralCompanion() {
  const ref = useRef(null);
  const eyeL = useRef(null);
  const eyeR = useRef(null);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    if (!ref.current) return;
    ref.current.position.y = Math.sin(t * 1.5) * 0.12;
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      pointer.x * 0.35 + Math.sin(t * 0.4) * 0.15,
      0.08
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * 0.2, 0.08);
    const blink = Math.sin(t * 2.2) > 0.98 ? 0.15 : 1;
    if (eyeL.current) eyeL.current.scale.y = blink;
    if (eyeR.current) eyeR.current.scale.y = blink;
  });

  return (
    <group ref={ref}>
      <mesh>
        <capsuleGeometry args={[0.42, 0.35, 8, 16]} />
        <meshStandardMaterial color="#1E2129" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.12, 0.36]}>
        <boxGeometry args={[0.5, 0.28, 0.12]} />
        <meshStandardMaterial color="#0A0B0E" metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh ref={eyeL} position={[-0.12, 0.12, 0.44]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#A78BFA" emissive="#8B5CF6" emissiveIntensity={1.6} />
      </mesh>
      <mesh ref={eyeR} position={[0.12, 0.12, 0.44]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#A78BFA" emissive="#8B5CF6" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color="#A78BFA" emissive="#8B5CF6" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.18, 6]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.035, 8, 24]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#7C3AED" emissiveIntensity={0.8} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/* ---------- Anchor resolution ---------- */
function resolveTarget(sectionId) {
  const anchor = document.querySelector(`[data-companion-anchor="${sectionId}"]`);
  const el = anchor || document.getElementById(sectionId);
  if (!el) return null;

  const rect = el.getBoundingClientRect();
  const cfg = COMPANION_SECTIONS.find((s) => s.id === sectionId);

  let x;
  let y;
  if (anchor) {
    x = rect.left + rect.width / 2 - AVATAR_SIZE / 2;
    y = rect.top + rect.height / 2 - AVATAR_SIZE / 2;
  } else {
    // Fallback: hover beside the section heading, alternating sides
    const side = cfg?.side === 'left' ? 0.12 : 0.85;
    x = rect.left + rect.width * side - AVATAR_SIZE / 2;
    y = rect.top + Math.min(rect.height * 0.18, 160);
  }

  x = Math.max(EDGE_MARGIN, Math.min(x, window.innerWidth - AVATAR_SIZE - EDGE_MARGIN));
  y = Math.max(EDGE_MARGIN, Math.min(y, window.innerHeight - AVATAR_SIZE - EDGE_MARGIN));
  return { x, y };
}

/* ---------- Main component ---------- */
export default function CompanionAvatar() {
  const { activeSection, announceSection, muted, isSpeaking, auraPulse, toggleMute } = useCompanion();
  const reduceMotion = useReducedMotion();
  const modelAvailable = useModelAvailable(MODEL_URL);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);

  const activeRef = useRef(activeSection);
  activeRef.current = activeSection;

  const retarget = useCallback(() => {
    const target = resolveTarget(activeRef.current);
    if (!target) return;
    mx.set(target.x);
    my.set(target.y);
  }, [mx, my]);

  // Observe sections → drive activeSection + TTS
  useEffect(() => {
    if (reduceMotion) return;

    const sections = COMPANION_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) announceSection(hit.target.id);
      },
      { threshold: [0.25, 0.5], rootMargin: '-15% 0px -35% 0px' }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [announceSection, reduceMotion]);

  // Glide to the active section's anchor; keep tracking while scrolling (rAF-throttled)
  useEffect(() => {
    if (reduceMotion) return;

    const first = resolveTarget('hero');
    if (first) {
      mx.jump(first.x);
      my.jump(first.y);
    }
    const show = setTimeout(() => setVisible(true), 400);

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        retarget();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      clearTimeout(show);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [retarget, reduceMotion, mx, my]);

  useEffect(() => {
    if (!reduceMotion) retarget();
  }, [activeSection, retarget, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      className="fixed left-0 top-0 z-30 hidden overflow-visible md:block"
      style={{ x, y, width: AVATAR_SIZE, height: AVATAR_SIZE, willChange: 'transform' }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <div className="pointer-events-none relative z-10 h-full w-full">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.1, 2.6], fov: 40 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 3, 4]} intensity={1} />
          <pointLight position={[-2, 0, 2]} intensity={0.7} color="#8B5CF6" />
          <SafeBoundary fallback={<ProceduralCompanion />}>
            <Suspense fallback={<ProceduralCompanion />}>
              {modelAvailable ? <GltfCompanion /> : <ProceduralCompanion />}
            </Suspense>
          </SafeBoundary>
        </Canvas>
      </div>

      {/* Aura ring on top so it wraps around the robot */}
      <AudioAuraShader
        active
        speaking={isSpeaking}
        pulseSignal={auraPulse}
        reduceMotion={reduceMotion}
        className="-left-5 -top-5 z-20 h-[172px] w-[172px]"
      />

      {/* Voice toggle — the only interactive part */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Enable companion voice' : 'Mute companion voice'}
        className="pointer-events-auto absolute -bottom-1 left-1/2 z-20 flex h-8 w-11 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-line-subtle bg-surface/80 text-ink-secondary backdrop-blur-sm transition-colors duration-200 hover:border-accent/50 hover:text-accent-bright"
      >
        {muted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5Z" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5Z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </motion.div>
  );
}
