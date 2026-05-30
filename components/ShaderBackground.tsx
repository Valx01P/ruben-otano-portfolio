'use client';

import { useEffect, useRef } from 'react';

/**
 * Full-bleed animated WebGL fragment shader.
 * Renders a flowing fbm "neural field" in the brand green palette — the kind of
 * generative-gradient backdrop frontier AI labs use. Pure WebGL, no deps.
 */

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_intensity;

// 2D hash + value-noise fbm
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += amp * noise(p);
    p = rot * p * 2.0 + 0.03;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  float t = u_time * 0.04;

  // domain-warped fbm — flowing field
  vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t + 5.2));
  vec2 r = vec2(
    fbm(p * 1.6 + 1.4 * q + vec2(1.7, 9.2) + t * 1.3),
    fbm(p * 1.6 + 1.4 * q + vec2(8.3, 2.8) - t * 1.1)
  );
  float f = fbm(p * 1.6 + 2.0 * r);

  // mouse halo
  vec2 m = (u_mouse - 0.5);
  float d = length(p - m * 1.6);
  float halo = smoothstep(0.7, 0.0, d) * 0.35;

  // brand green palette
  vec3 deep = vec3(0.027, 0.039, 0.027);
  vec3 mid = vec3(0.117, 0.250, 0.0);   // #1f3001-ish
  vec3 lime = vec3(0.463, 0.725, 0.0);  // #76b900
  vec3 bright = vec3(0.561, 0.812, 0.122);

  vec3 col = mix(deep, mid, smoothstep(0.1, 0.7, f));
  col = mix(col, lime, smoothstep(0.55, 0.95, f) * 0.7);
  col += bright * pow(f, 3.0) * 0.5;
  col += lime * halo;

  // subtle scanline / grain via fbm derivative
  float grid = smoothstep(0.45, 0.5, f) - smoothstep(0.5, 0.55, f);
  col += lime * grid * 0.12;

  // vignette
  float vig = smoothstep(1.25, 0.2, length(p));
  col *= mix(0.35, 1.0, vig);

  col *= u_intensity;

  gl_FragColor = vec4(col, 1.0);
}
`;

interface Props {
  className?: string;
  intensity?: number;
}

export default function ShaderBackground({ className = '', intensity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const gl =
      canvas.getContext('webgl', { antialias: true, alpha: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uIntensity = gl.getUniformLocation(program, 'u_intensity');

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = 1 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    let running = false;
    const start = performance.now();
    const target = { x: 0.5, y: 0.5 };

    const draw = (now: number) => {
      const time = prefersReduced ? 0 : (now - start) / 1000;
      // ease mouse
      target.x += (mouse.current.x - target.x) * 0.05;
      target.y += (mouse.current.y - target.y) * 0.05;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, target.x, target.y);
      gl.uniform1f(uIntensity, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      draw(now);
      if (!prefersReduced && running) raf = requestAnimationFrame(frame);
    };
    const startLoop = () => {
      if (prefersReduced) {
        draw(performance.now());
        return;
      }
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Only run the shader while the hero is on screen and the tab is visible
    // (saves GPU/CPU on scroll and when backgrounded).
    let onScreen = false;
    const update = () =>
      onScreen && !document.hidden ? startLoop() : stopLoop();
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        update();
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    const onVisibility = () => update();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', onMove);
      gl.deleteProgram(program);
      gl.deleteBuffer(buf);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
