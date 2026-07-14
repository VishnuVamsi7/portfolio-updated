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
  uniform float uScroll;
  uniform float uBlend;
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

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv;
    p.x *= uResolution.x / uResolution.y;

    float scrollBlend = smoothstep(0.0, 1.0, uBlend);
    float verticalBias = (uv.y - 0.42) * 0.5;
    float blend = clamp(scrollBlend + verticalBias * max(scrollBlend, 0.18), 0.0, 1.0);

    vec3 deep = vec3(0.039, 0.043, 0.055);
    vec3 aboutPurple = vec3(0.18, 0.07, 0.34);
    vec3 skillsTeal = vec3(0.04, 0.2, 0.24);

    vec3 tone = mix(aboutPurple, skillsTeal, blend);
    float toneMix = mix(0.62, 0.92, blend);
    vec3 col = mix(deep, tone, toneMix);

    float drift = uScroll * 0.85 + uTime * 0.018;
    float mist = fbm(p * 1.25 + vec2(drift, drift * 0.55));
    col += mix(aboutPurple, skillsTeal, blend) * mist * 0.11;

    float aboutBloom = fbm(p * 0.75 + vec2(0.15, drift * 0.25));
    float skillsBloom = fbm(p * 0.82 + vec2(drift * 0.2, 0.35));
    col += vec3(0.42, 0.14, 0.62) * aboutBloom * 0.14 * (1.0 - blend);
    col += vec3(0.1, 0.34, 0.38) * skillsBloom * 0.16 * blend;

    float grain = fbm(uv * vec2(220.0, 220.0) + vec2(uTime * 0.03, -uTime * 0.02));
    float grainFine = fbm(uv * vec2(480.0, 480.0) + uScroll * 0.4);
    float grainMix = (grain * 0.65 + grainFine * 0.35 - 0.5) * 0.04;
    col += grainMix;

    float vignette = 1.0 - dot((uv - 0.5) * vec2(1.0, 1.05), (uv - 0.5) * vec2(1.0, 1.05)) * 0.5;
    col *= clamp(vignette, 0.58, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[ScrollTransitionShader]', gl.getShaderInfoLog(shader));
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
    console.warn('[ScrollTransitionShader]', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function getWebGLContext(canvas) {
  return (
    canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' }) ||
    canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' })
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readScrollUniforms() {
  const scrollY = window.scrollY;
  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const uScroll = scrollY / maxScroll;

  const about = document.getElementById('about');
  const skills = document.getElementById('skills');

  let uBlend = 0;
  if (about && skills) {
    const aboutRect = about.getBoundingClientRect();
    const skillsRect = skills.getBoundingClientRect();
    const aboutTop = scrollY + aboutRect.top;
    const skillsTop = scrollY + skillsRect.top;
    const blendStart = aboutTop + aboutRect.height * 0.28;
    const blendEnd = skillsTop + Math.min(window.innerHeight * 0.28, 240);
    const viewportFocus = scrollY + window.innerHeight * 0.42;
    const range = Math.max(280, blendEnd - blendStart);
    uBlend = clamp((viewportFocus - blendStart) / range, 0, 1);
  }

  return { uScroll, uBlend };
}

export default function ScrollTransitionShader() {
  const canvasRef = useRef(null);
  const scrollRef = useRef({ uScroll: 0, uBlend: 0 });
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
    gl.uniform1f(uniforms.uScroll, scrollRef.current.uScroll);
    gl.uniform1f(uniforms.uBlend, scrollRef.current.uBlend);
    gl.uniform2f(uniforms.uResolution, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = getWebGLContext(canvas);
    if (!gl) return undefined;

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) return undefined;

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uScroll = gl.getUniformLocation(program, 'uScroll');
    const uBlend = gl.getUniformLocation(program, 'uBlend');
    const uResolution = gl.getUniformLocation(program, 'uResolution');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const attribs = { buffer, aPosition };
    const uniforms = { uTime, uScroll, uBlend, uResolution };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();

    const about = document.getElementById('about');
    const skills = document.getElementById('skills');

    const updateScroll = () => {
      scrollRef.current = readScrollUniforms();
      if (about && skills) {
        const vh = window.innerHeight;
        const aboutRect = about.getBoundingClientRect();
        const skillsRect = skills.getBoundingClientRect();
        visibleRef.current =
          (aboutRect.top < vh && aboutRect.bottom > 0) ||
          (skillsRect.top < vh && skillsRect.bottom > 0);
      } else {
        visibleRef.current = true;
      }
    };
    updateScroll();

    const onScroll = () => updateScroll();
    const onResize = () => {
      resize();
      updateScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!reduceMotion) {
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
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [draw, reduceMotion]);

  if (reduceMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#241047] via-base to-[#062028]"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-full"
    />
  );
}
