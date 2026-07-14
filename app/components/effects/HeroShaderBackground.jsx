'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

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

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;

    vec2 mouse = (uMouse - 0.5) * aspect;
    vec2 toMouse = mouse - p;
    float mouseDist = length(toMouse);

    // Layered fluid waves — horizontal bands + gentle cross-flow
    float waveA = sin(p.x * 4.2 + p.y * 1.8 + uTime * 0.55) * 0.5;
    float waveB = sin(p.x * 2.6 - p.y * 2.4 + uTime * 0.38 + 1.4) * 0.5;
    float waveC = sin(p.y * 5.5 + uTime * 0.72) * 0.5;
    float waveField = (waveA + waveB * 0.7 + waveC * 0.45) / 1.65;

    // Cursor gently bends nearby wave crests
    float mouseInfluence = exp(-mouseDist * 2.4);
    float waveWarp = sin(mouseDist * 8.0 - uTime * 1.2) * mouseInfluence * 0.35;
    waveField += waveWarp;

    p += vec2(waveField * 0.11, sin(waveField * 2.2 + uTime * 0.3) * 0.06);
    p += toMouse * mouseInfluence * 0.04;

    float t = uTime * 0.15;
    float plasma = fbm(p * 1.6 + vec2(t * 0.45, t * 0.3));
    float plasma2 = fbm(p * 2.4 - vec2(t * 0.35, t * 0.55) + plasma * 0.8);
    float glow = pow(max(plasma2, 0.0), 1.95);

    vec3 deep = vec3(0.039, 0.043, 0.055);
    vec3 navy = vec3(0.05, 0.08, 0.16);
    vec3 purple = vec3(0.545, 0.361, 0.965);
    vec3 purpleBright = vec3(0.655, 0.545, 0.98);
    vec3 cyan = vec3(0.18, 0.55, 0.68);

    vec3 col = mix(deep, navy, smoothstep(0.2, 0.92, plasma));
    col += purple * glow * 0.78;
    col += purpleBright * pow(glow, 2.0) * 0.5;

    // Wave crest highlights instead of ripples
    float crest = pow(abs(sin(p.y * 4.8 + waveField * 3.0 + uTime * 0.5)), 3.0);
    float swell = smoothstep(-0.15, 0.35, waveField);
    col += purple * crest * swell * 0.42;
    col += cyan * crest * swell * 0.12;
    col += purpleBright * mouseInfluence * swell * 0.22;

    float vig = 1.0 - dot((uv - 0.5) * vec2(1.0, 1.1), (uv - 0.5) * vec2(1.0, 1.1)) * 1.2;
    col *= clamp(vig, 0.15, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[HeroShader]', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[HeroShader]', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function getWebGLContext(canvas) {
  const options = { alpha: false, antialias: false, powerPreference: 'high-performance' };
  return canvas.getContext('webgl2', options) || canvas.getContext('webgl', options);
}

export default function HeroShaderBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
  const visibleRef = useRef(true);
  const rafRef = useRef(0);
  const reduceMotion = useReducedMotion();

  const draw = useCallback((gl, program, attribs, uniforms) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, attribs.buffer);
    gl.enableVertexAttribArray(attribs.aPosition);
    gl.vertexAttribPointer(attribs.aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(uniforms.uTime, timeRef.current);
    gl.uniform2f(uniforms.uMouse, mouseRef.current.x, 1.0 - mouseRef.current.y);
    gl.uniform2f(uniforms.uResolution, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = getWebGLContext(canvas);
    if (!gl) {
      console.warn('[HeroShader] WebGL unavailable');
      return undefined;
    }

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) return undefined;

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uResolution = gl.getUniformLocation(program, 'uResolution');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const attribs = { buffer, aPosition };
    const uniforms = { uTime, uMouse, uResolution };

    const hero = document.getElementById('hero');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = hero?.getBoundingClientRect();
      const w = rect?.width || window.innerWidth;
      const h = rect?.height || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const rect = hero?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      targetMouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const observer = hero
      ? new IntersectionObserver(
          ([entry]) => {
            visibleRef.current = entry.isIntersecting;
          },
          { threshold: 0.05 }
        )
      : null;
    if (hero && observer) observer.observe(hero);

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.14;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.14;

      if (visibleRef.current && !reduceMotion) {
        timeRef.current += dt;
      }

      if (visibleRef.current) {
        draw(gl, program, attribs, uniforms);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      observer?.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [draw, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
