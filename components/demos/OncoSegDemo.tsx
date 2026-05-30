'use client';

import { useEffect, useRef, useState } from 'react';
import DemoChrome from './DemoChrome';

const MODALITIES = ['T1', 'T1c', 'T2', 'FLAIR'] as const;
const SLICES = 24;

export default function OncoSegDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [slice, setSlice] = useState(12);
  const [overlay, setOverlay] = useState(true);
  const [modality, setModality] = useState<(typeof MODALITIES)[number]>('FLAIR');

  // Tumor centroid & size keyed to slice (peaks mid-volume)
  const tumor = (s: number) => {
    const t = 1 - Math.abs(s - 13) / 13; // 0..1 envelope
    const size = Math.max(0, t) * 46;
    return { cx: 178, cy: 120, size };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = (canvas.width = 320);
    const H = (canvas.height = 320);
    ctx.clearRect(0, 0, W, H);

    // brain background — concentric noisy gyri
    ctx.fillStyle = '#07090a';
    ctx.fillRect(0, 0, W, H);

    const seed = slice * 13.37;
    const rand = (n: number) => {
      const x = Math.sin(n * 127.1 + seed) * 43758.5453;
      return x - Math.floor(x);
    };

    // skull
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 120, 135, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1f1a';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#3a4033';
    ctx.stroke();

    // brain matter
    ctx.beginPath();
    ctx.ellipse(0, 0, 104, 118, 0, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(0, -20, 20, 0, 0, 118);
    g.addColorStop(0, '#4a5142');
    g.addColorStop(1, '#23271f');
    ctx.fillStyle = g;
    ctx.fill();

    // gyri folds
    ctx.clip();
    ctx.lineWidth = 2;
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      const x0 = (rand(i) - 0.5) * 220;
      const y0 = (rand(i + 99) - 0.5) * 240;
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(
        x0 + (rand(i + 1) - 0.5) * 60,
        y0 + (rand(i + 2) - 0.5) * 60,
        x0 + (rand(i + 3) - 0.5) * 60,
        y0 + (rand(i + 4) - 0.5) * 60,
        x0 + (rand(i + 5) - 0.5) * 80,
        y0 + (rand(i + 6) - 0.5) * 80
      );
      ctx.strokeStyle = `rgba(20,24,18,${0.4 + rand(i) * 0.4})`;
      ctx.stroke();
    }

    // ventricles
    ctx.beginPath();
    ctx.ellipse(-14, 6, 16, 30, -0.3, 0, Math.PI * 2);
    ctx.ellipse(14, 6, 16, 30, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#0d100c';
    ctx.fill();
    ctx.restore();

    // tumor overlay
    const { cx, cy, size } = tumor(slice);
    if (overlay && size > 2) {
      // edema (outer, translucent yellow-green)
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 1.5, size * 1.35, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(143,207,31,0.18)';
      ctx.fill();
      // enhancing tumor (mid green)
      ctx.beginPath();
      ctx.ellipse(cx, cy, size, size * 0.92, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(118,185,0,0.45)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(201,236,138,0.9)';
      ctx.stroke();
      // necrotic core (dark)
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 0.4, size * 0.36, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(50,79,2,0.85)';
      ctx.fill();
    }
  }, [slice, overlay, modality]);

  const vol = (() => {
    let v = 0;
    for (let s = 0; s < SLICES; s++) {
      const sz = tumor(s).size;
      v += Math.PI * sz * sz * 0.0125; // arbitrary cm^3 scale
    }
    return v.toFixed(1);
  })();

  return (
    <DemoChrome title="OncoSeg" subtitle="glioma sub-region segmentation">
      <div className="grid h-full grid-cols-1 md:grid-cols-[1fr_260px]">
        <div className="relative flex items-center justify-center bg-black p-4">
          <canvas
            ref={canvasRef}
            className="aspect-square h-full max-h-[420px] rounded-lg ring-1 ring-brand/20"
          />
          <span className="absolute left-6 top-6 font-mono text-xs text-brand-300">
            {modality} · z={slice + 1}/{SLICES}
          </span>
        </div>

        <aside className="flex flex-col gap-4 border-t border-brand/10 bg-ink-900/60 p-4 md:border-l md:border-t-0">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-[#7c8a76]">
              Modality
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {MODALITIES.map((m) => (
                <button
                  key={m}
                  onClick={() => setModality(m)}
                  className={`rounded-md border py-1.5 text-[11px] font-medium transition ${
                    m === modality
                      ? 'border-brand bg-brand/15 text-brand-200'
                      : 'border-white/10 text-[#9aa894] hover:border-brand/40'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-[11px] uppercase tracking-wider text-[#7c8a76]">
              <span>Axial slice</span>
              <span className="font-mono text-brand-300">{slice + 1}</span>
            </div>
            <input
              type="range"
              min={0}
              max={SLICES - 1}
              value={slice}
              onChange={(e) => setSlice(+e.target.value)}
              className="w-full accent-[#76b900]"
            />
          </div>

          <button
            onClick={() => setOverlay((o) => !o)}
            className={`rounded-md border py-2 text-sm font-medium transition ${
              overlay
                ? 'border-brand bg-brand/15 text-brand-200'
                : 'border-white/15 text-[#9aa894] hover:border-brand/40'
            }`}
          >
            {overlay ? 'Segmentation: ON' : 'Segmentation: OFF'}
          </button>

          <div className="space-y-2 rounded-md border border-brand/10 bg-black/30 p-3 text-xs">
            <Legend color="rgba(118,185,0,0.7)" label="Enhancing tumor" />
            <Legend color="rgba(143,207,31,0.4)" label="Peritumoral edema" />
            <Legend color="rgba(50,79,2,0.95)" label="Necrotic core" />
          </div>

          <div className="mt-auto rounded-md border border-brand/20 bg-brand/5 p-3">
            <p className="text-[11px] uppercase tracking-wider text-[#7c8a76]">
              Est. tumor volume
            </p>
            <p className="font-mono text-2xl font-bold text-brand">
              {vol} <span className="text-sm text-[#7c8a76]">cm³</span>
            </p>
          </div>
        </aside>
      </div>
    </DemoChrome>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-3 w-3 rounded-sm"
        style={{ background: color, outline: '1px solid rgba(201,236,138,0.4)' }}
      />
      <span className="text-[#cdd8c5]">{label}</span>
    </div>
  );
}
