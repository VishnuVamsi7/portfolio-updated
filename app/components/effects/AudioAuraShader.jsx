'use client';

import { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uAmplitude;
  uniform vec2 uResolution;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash(i), hash(i + 1.0), u);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= uResolution.x / uResolution.y;

    float amp = clamp(uAmplitude, 0.0, 1.0);
    float radius = length(p);
    float angle = atan(p.y, p.x);
    float breath = 0.5 + 0.5 * sin(uTime * 1.05);

    float organic =
      sin(angle * 7.0 + uTime * 2.0) * 0.5 +
      sin(angle * 13.0 - uTime * 2.8) * 0.28 +
      noise(angle * 4.0 + uTime * 0.8) * 0.5;

    float ringRadius = 0.31 + breath * 0.018 + organic * amp * 0.035;
    float width = 0.025 + amp * 0.025;
    float ring = exp(-pow(abs(radius - ringRadius) / width, 2.0));
    float innerGlow = exp(-pow(radius / (0.24 + amp * 0.08), 2.0));
    float outerGlow = exp(-pow(abs(radius - ringRadius) / (0.12 + amp * 0.06), 2.0));

    float spikes = max(0.0, organic) * amp;
    vec3 violet = vec3(0.545, 0.361, 0.965);
    vec3 bright = vec3(0.655, 0.545, 0.980);
    vec3 magenta = vec3(0.925, 0.282, 0.600);
    vec3 color = mix(violet, bright, breath * 0.35 + amp * 0.45);
    color = mix(color, magenta, spikes * 0.32);

    float alpha = ring * (0.22 + amp * 0.55);
    alpha += outerGlow * (0.08 + amp * 0.28);
    alpha += innerGlow * amp * 0.12;
    alpha *= smoothstep(0.58, 0.22, radius);

    gl_FragColor = vec4(color, alpha);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[AudioAuraShader]', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[AudioAuraShader]', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function getContext(canvas) {
  const options = {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    powerPreference: 'low-power',
  };

  return canvas.getContext('webgl2', options) || canvas.getContext('webgl', options);
}

export default function AudioAuraShader({
  active = false,
  speaking = false,
  pulseSignal = 0,
  reduceMotion = false,
  className = '',
}) {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  const speakingRef = useRef(speaking);
  const amplitudeRef = useRef(0.035);
  const pulseRef = useRef(0);
  const rafRef = useRef(0);

  activeRef.current = active;
  speakingRef.current = speaking;

  useEffect(() => {
    if (pulseSignal > 0) {
      pulseRef.current = Math.min(1, pulseRef.current + 0.5);
    }
  }, [pulseSignal]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = getContext(canvas);
    if (!gl) return undefined;

    const program = createProgram(gl);
    if (!program) return undefined;

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uAmplitude = gl.getUniformLocation(program, 'uAmplitude');
    const uResolution = gl.getUniformLocation(program, 'uResolution');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const startedAt = performance.now();
    let last = startedAt;

    const tick = (now) => {
      const elapsed = (now - startedAt) / 1000;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      pulseRef.current = Math.max(0, pulseRef.current - dt * 2.8);
      const speechCarrier =
        0.5 + 0.5 * Math.sin(elapsed * 18.0) +
        0.28 * Math.sin(elapsed * 31.0 + 1.7);
      const target = speakingRef.current
        ? 0.42 + speechCarrier * 0.28 + pulseRef.current * 0.42
        : activeRef.current
          ? 0.18 + Math.sin(elapsed * 1.2) * 0.04
          : 0.08 + Math.sin(elapsed * 0.8) * 0.02;

      amplitudeRef.current += (Math.max(0.02, target) - amplitudeRef.current) * 0.12;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uAmplitude, amplitudeRef.current);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute rounded-full border border-accent/20 bg-accent/5 shadow-glow-sm ${className}`}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
    />
  );
}
