'use client';

import { useEffect, useRef, useState } from 'react';
import DemoChrome from './DemoChrome';

type Rhythm = 'normal' | 'afib' | 'pvc';

const RHYTHM_LABEL: Record<Rhythm, string> = {
  normal: 'Normal Sinus',
  afib: 'Atrial Fibrillation',
  pvc: 'Ventricular Ectopy (PVC)',
};

export default function CardioPulseDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rhythm, setRhythm] = useState<Rhythm>('normal');
  const [bpm, setBpm] = useState(72);
  const [alert, setAlert] = useState<string | null>(null);
  const rhythmRef = useRef<Rhythm>('normal');
  rhythmRef.current = rhythm;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Gaussian bump centered at mu with inverse-width k
    const g = (p: number, mu: number, k: number) => {
      const c = (p - mu) * k;
      return Math.exp(-(c * c));
    };

    // Generate one PQRST beat sample given phase 0..1
    const beat = (p: number, r: Rhythm, ectopic: boolean): number => {
      if (ectopic) {
        // wide bizarre QRS
        return -g(p, 0.45, 9) * 1.5 + g(p, 0.6, 6) * 0.5;
      }
      let y = 0;
      y += g(p, 0.18, 14) * 0.18; // P
      y -= g(p, 0.34, 55) * 0.22; // Q
      y += g(p, 0.4, 38) * 1.0; // R
      y -= g(p, 0.46, 45) * 0.32; // S
      y += g(p, 0.7, 9) * 0.28; // T
      return y;
    };

    const W0 = () => canvas.width / dpr;
    const H0 = () => canvas.height / dpr;

    const data: number[] = [];
    const maxPoints = () => Math.floor(W0());
    let phase = 0;
    let beatCount = 0;
    let nextEctopic = false;
    let intervalScale = 1;
    let raf = 0;
    let last = performance.now();
    let bpmAccum = 0;
    let beatsInWindow = 0;
    let windowStart = performance.now();

    const step = (now: number) => {
      const dt = Math.min(40, now - last) / 1000;
      last = now;
      const r = rhythmRef.current;

      // beat duration ~ 60/bpm; afib jitters interval
      const baseBpm = r === 'afib' ? 110 : r === 'pvc' ? 78 : 72;
      const dur = (60 / baseBpm) * intervalScale;
      phase += dt / dur;

      if (phase >= 1) {
        phase -= 1;
        beatCount++;
        beatsInWindow++;
        // schedule irregularities
        if (r === 'afib') {
          intervalScale = 0.55 + Math.abs(Math.sin(beatCount * 2.39)) * 0.9;
        } else {
          intervalScale = 1;
        }
        if (r === 'pvc') {
          nextEctopic = beatCount % 4 === 3;
        } else {
          nextEctopic = false;
        }
        if ((r === 'pvc' && nextEctopic) || (r === 'afib' && beatCount % 3 === 0)) {
          setAlert(
            r === 'pvc'
              ? '⚠ Premature ventricular contraction detected'
              : '⚠ Irregularly irregular rhythm — AFib'
          );
        } else if (r === 'normal') {
          setAlert(null);
        }
      }

      const y = beat(phase, r, nextEctopic && phase < 0.6);
      data.push(y);
      while (data.length > maxPoints()) data.shift();

      // bpm readout
      if (now - windowStart > 1500) {
        const measured = (beatsInWindow / (now - windowStart)) * 60000;
        setBpm(Math.round(measured || baseBpm));
        beatsInWindow = 0;
        windowStart = now;
      }

      // draw
      const W = W0();
      const H = H0();
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, W, H);

      // grid
      ctx.strokeStyle = 'rgba(118,185,0,0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let yy = 0; yy < H; yy += 20) {
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(W, yy);
        ctx.stroke();
      }

      // trace
      const mid = H * 0.55;
      const amp = H * 0.32;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#76b900';
      ctx.shadowColor = 'rgba(118,185,0,0.8)';
      ctx.shadowBlur = 8;
      data.forEach((v, i) => {
        const px = i;
        const py = mid - v * amp;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // leading dot
      if (data.length) {
        const i = data.length - 1;
        ctx.beginPath();
        ctx.arc(i, mid - data[i] * amp, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#c9ec8a';
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const isAbnormal = rhythm !== 'normal';

  return (
    <DemoChrome title="CardioPulse" subtitle="single-lead ECG · live inference">
      <div className="flex h-full flex-col">
        <div className="relative flex-1">
          <canvas ref={canvasRef} className="h-full w-full" />
          {/* readouts */}
          <div className="pointer-events-none absolute right-4 top-4 flex flex-col items-end gap-2">
            <div className="rounded-lg border border-brand/20 bg-black/60 px-4 py-2 text-right backdrop-blur">
              <p className="text-[10px] uppercase tracking-wider text-[#7c8a76]">
                Heart rate
              </p>
              <p className="font-mono text-3xl font-bold text-brand">
                {bpm}
                <span className="ml-1 text-xs text-[#7c8a76]">bpm</span>
              </p>
            </div>
            <div
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold backdrop-blur ${
                isAbnormal
                  ? 'border-amber-400/40 bg-amber-500/10 text-amber-300'
                  : 'border-brand/30 bg-brand/10 text-brand-200'
              }`}
            >
              {RHYTHM_LABEL[rhythm]}
            </div>
          </div>
          {alert && (
            <div className="absolute bottom-4 left-4 animate-[fade-in-up_0.3s_ease] rounded-lg border border-amber-400/40 bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-200 backdrop-blur">
              {alert}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-brand/10 bg-ink-900/70 p-3">
          <span className="mr-2 text-[11px] uppercase tracking-wider text-[#7c8a76]">
            Inject rhythm
          </span>
          {(['normal', 'afib', 'pvc'] as Rhythm[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRhythm(r);
                if (r === 'normal') setAlert(null);
              }}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                rhythm === r
                  ? 'border-brand bg-brand/15 text-brand-200'
                  : 'border-white/10 text-[#9aa894] hover:border-brand/40'
              }`}
            >
              {RHYTHM_LABEL[r]}
            </button>
          ))}
          <span className="ml-auto hidden font-mono text-[10px] text-[#5f6c5a] sm:block">
            1D ResNet + temporal transformer · INT8
          </span>
        </div>
      </div>
    </DemoChrome>
  );
}
