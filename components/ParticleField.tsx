'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; // horizontal, screen space (wraps across width)
  docY: number; // vertical, DOCUMENT space — anchored to the page, not the screen
  vx: number;
  vy: number;
  r: number;
  a: number; // base alpha
  drift: number;
}

/**
 * Floating green "space dust" anchored to the page (document space), scattered
 * across every section below the hero. As you scroll, the dust stays with the
 * page and slides away — but there's some everywhere, so the field never empties.
 * Your cursor's motion generates wind that pushes nearby motes around.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;
    let docH = 0;
    let particles: Particle[] = [];

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const docHeight = () =>
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight
      );

    const seed = () => {
      // Start the field just past the hero (~one viewport down) and spread it
      // across the whole remaining page so every section has some.
      const top = H * 0.85;
      const span = Math.max(1, docH - top);
      const screens = span / H;
      const count = Math.min(320, Math.max(40, Math.floor(screens * 34)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        docY: top + Math.random() * span,
        vx: rand(-0.1, 0.1),
        vy: rand(-0.1, 0.1),
        r: rand(0.5, 2.3),
        a: rand(0.12, 0.6),
        drift: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      docH = docHeight();
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    window.addEventListener('resize', resize);

    // Re-measure document height periodically (images/fonts can grow the page)
    const remeasure = () => {
      const h = docHeight();
      if (Math.abs(h - docH) > H * 0.5) resize();
    };

    // cursor + generated "wind" (screen space)
    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, wx: 0, wy: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (mouse.px > -9000) {
        mouse.wx = mouse.wx * 0.6 + (mouse.x - mouse.px) * 0.4;
        mouse.wy = mouse.wy * 0.6 + (mouse.y - mouse.py) * 0.4;
      }
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);

    const RADIUS = 150;
    let raf = 0;
    let t = 0;
    let frames = 0;

    const frame = () => {
      t += 0.01;
      if ((frames++ & 63) === 0) remeasure();

      const scrollY = window.scrollY || window.pageYOffset || 0;
      ctx.clearRect(0, 0, W, H);

      mouse.wx *= 0.92;
      mouse.wy *= 0.92;
      const windMag = Math.hypot(mouse.wx, mouse.wy);

      const top = H * 0.85;

      for (const p of particles) {
        const screenY = p.docY - scrollY;

        // only the motes near the viewport need simulating/drawing
        if (screenY < -40 || screenY > H + 40) continue;

        if (!reduced) {
          p.drift += 0.01;
          p.vx += Math.cos(p.drift) * 0.004;
          p.vy += Math.sin(p.drift * 0.9) * 0.004;

          // cursor wind (compare in screen space)
          const dx = p.x - mouse.x;
          const dy = screenY - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS && mouse.x > -9000) {
            const falloff = (1 - dist / RADIUS) ** 2;
            p.vx += mouse.wx * 0.035 * falloff;
            p.vy += mouse.wy * 0.035 * falloff;
            const inv = 1 / (dist || 1);
            p.vx += dx * inv * (0.6 + windMag * 0.05) * falloff;
            p.vy += dy * inv * (0.6 + windMag * 0.05) * falloff;
          }

          p.vx *= 0.95;
          p.vy *= 0.95;
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 3.2) {
            p.vx = (p.vx / sp) * 3.2;
            p.vy = (p.vy / sp) * 3.2;
          }

          p.x += p.vx;
          p.docY += p.vy;

          // wrap horizontally; keep docY within the post-hero band
          if (p.x < -10) p.x = W + 10;
          if (p.x > W + 10) p.x = -10;
          if (p.docY < top) p.docY = docH;
          if (p.docY > docH) p.docY = top;
        }

        const alpha = p.a * (reduced ? 1 : 0.7 + Math.sin(t * 2 + p.drift) * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(143, 207, 31, ${alpha})`;
        ctx.shadowColor = 'rgba(118,185,0,0.8)';
        ctx.shadowBlur = p.r * 3;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
