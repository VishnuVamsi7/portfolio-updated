'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const DURATION_MS = 1500;
const FAILSAFE_MS = 2200;

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float hash1(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float tvNoise(vec2 p, float t) {
    float frame = floor(t * 58.0);
    float n = hash(p + vec2(frame * 0.17, frame * 0.31));
    float n2 = hash(p * 1.7 + vec2(frame * 0.41, frame * 0.09));
    return mix(n, n2, 0.45);
  }

  float matrixGlyph(vec2 uv, float t) {
    vec2 grid = uv * vec2(96.0, 54.0);
    vec2 id = floor(grid);
    vec2 gv = fract(grid);

    float columnSeed = hash(vec2(id.x, 0.0));
    float cellSeed = hash(id);
    float stream = fract(id.y * 0.08 - t * (0.55 + columnSeed * 1.8));
    float head = smoothstep(0.92, 0.78, stream);
    float trail = smoothstep(0.0, 0.72, stream) * step(0.08, stream);

    float glyph =
      step(0.18, gv.x) * step(gv.x, 0.82) *
      step(0.12, gv.y) * step(gv.y, 0.88);
    glyph *= step(0.42, cellSeed);

    float scramble = hash(id + floor(t * 14.0));
    glyph *= mix(0.35, 1.0, scramble);

    return glyph * max(head, trail * 0.55);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 px = gl_FragCoord.xy;

    float t = uTime;
    float progress = clamp(uProgress, 0.0, 1.0);

    float staticNoise = tvNoise(px, t);
    float matrix = matrixGlyph(uv, t);
    float scramble = max(staticNoise, matrix * 0.92);

    vec3 base = vec3(0.039, 0.043, 0.055);
    vec3 staticCol = mix(vec3(0.08, 0.09, 0.12), vec3(0.62, 0.42, 0.96), staticNoise);
    vec3 matrixCol = vec3(0.12, 0.78, 0.42) * matrix;
    vec3 col = base;
    col = mix(col, staticCol, 0.82);
    col += matrixCol * 0.35;

    float scan = sin(uv.y * uResolution.y * 0.8 + t * 18.0) * 0.03;
    col += scan;

    float dissolve = progress * 1.08 + scramble * 0.28 - 0.12;
    float alpha = 1.0 - smoothstep(0.0, 0.22, dissolve);
    alpha *= 1.0 - smoothstep(0.82, 1.0, progress);

    float vignette = 1.0 - dot((uv - 0.5) * vec2(1.05, 1.1), (uv - 0.5) * vec2(1.05, 1.1)) * 0.35;
    col *= clamp(vignette, 0.7, 1.0);

    gl_FragColor = vec4(col, alpha);
  }
`;

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[InitialLoaderShader]', gl.getShaderInfoLog(shader));
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
    console.warn('[InitialLoaderShader]', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function getWebGLContext(canvas) {
  return (
    canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    }) ||
    canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    })
  );
}

export default function InitialLoaderShader() {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const timeRef = useRef(0);
  const startRef = useRef(null);
  const rafRef = useRef(0);
  const finishedRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(true);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    cancelAnimationFrame(rafRef.current);
    setMounted(false);
  }, []);

  useEffect(() => {
    if (reduceMotion === null) return undefined;
    if (reduceMotion) {
      finish();
      return undefined;
    }
    return undefined;
  }, [finish, reduceMotion]);

  const draw = useCallback((gl, program, attribs, uniforms) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, attribs.buffer);
    gl.enableVertexAttribArray(attribs.aPosition);
    gl.vertexAttribPointer(attribs.aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(uniforms.uTime, timeRef.current);
    gl.uniform1f(uniforms.uProgress, progressRef.current);
    gl.uniform2f(uniforms.uResolution, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, []);

  useEffect(() => {
    if (reduceMotion === null || reduceMotion) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = getWebGLContext(canvas);
    if (!gl) {
      finish();
      return undefined;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) {
      finish();
      return undefined;
    }

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uProgress = gl.getUniformLocation(program, 'uProgress');
    const uResolution = gl.getUniformLocation(program, 'uResolution');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const attribs = { buffer, aPosition };
    const uniforms = { uTime, uProgress, uResolution };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    const failsafe = window.setTimeout(finish, FAILSAFE_MS);

    let last = performance.now();
    const tick = (now) => {
      if (finishedRef.current) return;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      timeRef.current += dt;

      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const linear = Math.min(elapsed / DURATION_MS, 1);
      progressRef.current = easeOutCubic(linear);

      draw(gl, program, attribs, uniforms);

      if (linear >= 1) {
        window.clearTimeout(failsafe);
        finish();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(failsafe);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [draw, finish, reduceMotion]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[100] cursor-pointer"
      onClick={finish}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          finish();
        }
      }}
      role="status"
      aria-label="Loading portfolio"
      tabIndex={0}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none h-full w-full"
      />
    </div>
  );
}
