'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  varying vec2 vUv;

  const float GLASS_IOR = 1.52;
  const float LENS_RADIUS = 0.11;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbmLite(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 2; i++) {
      value += amplitude * noise(p);
      p = p * 2.02 + vec2(11.0);
      amplitude *= 0.5;
    }
    return value;
  }

  float fbmFull(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rot = mat2(cos(0.45), sin(0.45), -sin(0.45), cos(0.45));
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = rot * p * 2.03 + vec2(17.0);
      amplitude *= 0.5;
    }
    return value;
  }

  vec3 renderBackground(vec2 uv, float t) {
    vec2 p = uv - 0.5;
    p.x *= uResolution.x / uResolution.y;

    vec2 drift = vec2(t * 0.12, t * 0.08);
    float plasma = fbmFull(p * 1.35 + drift);
    float plasma2 = fbmFull(p * 1.9 - drift * 0.6 + plasma * 0.45);
    float glow = pow(max(plasma2, 0.0), 2.1);

    float grainMix = fbmLite(uv * vec2(200.0, 200.0) + vec2(t * 0.01, -t * 0.008));
    float grain = (grainMix - 0.5) * 0.022;

    vec3 spaceBlack = vec3(0.039, 0.043, 0.055);
    vec3 deepPurple = vec3(0.09, 0.04, 0.18);
    vec3 navy = vec3(0.04, 0.07, 0.12);
    vec3 teal = vec3(0.04, 0.13, 0.16);
    vec3 charcoal = vec3(0.051, 0.067, 0.090);

    vec3 col = mix(spaceBlack, deepPurple, smoothstep(0.15, 0.82, plasma) * 0.55);
    col = mix(col, navy, smoothstep(0.2, 0.75, plasma2) * 0.35);
    col = mix(col, teal, grainMix * 0.12);
    col += vec3(0.42, 0.22, 0.82) * glow * 0.18;
    col = mix(col, charcoal, 0.28);
    col += grain;

    float vignette = 1.0 - dot((uv - 0.5) * vec2(1.02, 1.08), (uv - 0.5) * vec2(1.02, 1.08)) * 0.38;
    col *= clamp(vignette, 0.65, 1.0);

    return col;
  }

  vec4 glassLensSample(vec2 uv, float t) {
    float aspect = uResolution.x / uResolution.y;
    vec2 mouse = uMouse;
    vec2 delta = uv - mouse;
    delta.x *= aspect;
    float dist = length(delta);

    if (dist >= LENS_RADIUS) {
      return vec4(renderBackground(uv, t), 1.0);
    }

    float h = sqrt(max(0.0, LENS_RADIUS * LENS_RADIUS - dist * dist));
    float hNorm = h / LENS_RADIUS;
    float lensMask = smoothstep(LENS_RADIUS, LENS_RADIUS * 0.12, dist);

    vec3 N = normalize(vec3(delta / max(dist, 0.0001), hNorm));
    vec3 I = vec3(0.0, 0.0, -1.0);
    float eta = 1.0 / GLASS_IOR;
    vec3 refracted = refract(I, N, eta);

    float iorOffset = (1.0 - 1.0 / GLASS_IOR) * hNorm * 0.16;
    vec2 tangent = vec2(-delta.y, delta.x) / max(dist, 0.0001);
    tangent.x /= aspect;

    vec2 magnify = mouse + (uv - mouse) * (1.0 - hNorm * 0.38);
    vec2 baseUV = magnify + refracted.xy * iorOffset;
    baseUV = clamp(baseUV, 0.0, 1.0);

    float ca = 0.0048 * lensMask * hNorm;
    vec3 col;
    col.r = renderBackground(clamp(baseUV + tangent * ca * 1.35, 0.0, 1.0), t).r;
    col.g = renderBackground(baseUV, t).g;
    col.b = renderBackground(clamp(baseUV - tangent * ca * 0.95, 0.0, 1.0), t).b;

    float fresnel = pow(1.0 - hNorm, 2.6);
    col += vec3(0.92, 0.96, 1.0) * pow(hNorm, 2.8) * 0.14 * lensMask;
    col += vec3(0.55, 0.38, 0.95) * fresnel * 0.1 * lensMask;
    col += vec3(0.2, 0.55, 0.65) * fresnel * 0.05 * lensMask;

    return vec4(col, 1.0);
  }

  void main() {
    gl_FragColor = glassLensSample(vUv, uTime);
  }
`;

const GlobalShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
    uMouse: new THREE.Vector2(0.5, 0.5),
  },
  VERTEX_SHADER,
  FRAGMENT_SHADER
);

extend({ GlobalShaderMaterial });

function FullscreenShaderPlane({ mouseRef, reduceMotionRef }) {
  const materialRef = useRef(null);
  const { viewport, size } = useThree();
  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5));

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uResolution.set(size.width, size.height);
    smoothMouse.current.lerp(mouseRef.current, 0.14);
    material.uMouse.copy(smoothMouse.current);

    if (!reduceMotionRef.current) {
      material.uTime += delta * 0.35;
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <globalShaderMaterial ref={materialRef} />
    </mesh>
  );
}

function ShaderScene({ mouseRef, reduceMotionRef }) {
  return (
    <FullscreenShaderPlane mouseRef={mouseRef} reduceMotionRef={reduceMotionRef} />
  );
}

export default function GlobalShaderBackground() {
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const reduceMotionRef = useRef(false);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      reduceMotionRef.current = media.matches;
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const onMove = (event) => {
      mouseRef.current.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight
      );
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, 1.5));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[1] h-screen w-screen"
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
        dpr={dpr}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'low-power',
          stencil: false,
          depth: false,
        }}
        frameloop="always"
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ShaderScene mouseRef={mouseRef} reduceMotionRef={reduceMotionRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
