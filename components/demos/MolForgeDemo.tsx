'use client';

import { useEffect, useRef, useState } from 'react';
import DemoChrome from './DemoChrome';

type Atom = { el: string; x: number; y: number; z: number };
type Bond = [number, number, number]; // i, j, order

interface Molecule {
  name: string;
  formula: string;
  atoms: Atom[];
  bonds: Bond[];
  props: { label: string; value: number; unit: string; good: boolean }[];
}

const EL_COLOR: Record<string, string> = {
  C: '#9aa894',
  O: '#ff6b6b',
  N: '#5b8def',
  H: '#dfe7d8',
};

// Compact hand-authored 3D-ish coordinates for recognizable molecules.
const MOLECULES: Molecule[] = [
  {
    name: 'Caffeine',
    formula: 'C₈H₁₀N₄O₂',
    atoms: [
      { el: 'N', x: -1.2, y: 0.6, z: 0 },
      { el: 'C', x: -0.2, y: 1.3, z: 0.3 },
      { el: 'N', x: 0.9, y: 0.8, z: -0.2 },
      { el: 'C', x: 0.8, y: -0.4, z: 0.1 },
      { el: 'C', x: -0.4, y: -0.7, z: -0.3 },
      { el: 'C', x: -1.4, y: -0.6, z: 0.4 },
      { el: 'O', x: -2.4, y: -1.1, z: 0.2 },
      { el: 'N', x: 1.7, y: -1.2, z: -0.2 },
      { el: 'C', x: 1.2, y: 2.0, z: 0.5 },
      { el: 'O', x: -0.3, y: 2.4, z: 0.9 },
    ],
    bonds: [
      [0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 2], [4, 5, 1],
      [5, 0, 1], [5, 6, 2], [3, 7, 1], [2, 8, 1], [1, 9, 2],
    ],
    props: [
      { label: 'logP (lipophilicity)', value: -0.07, unit: '', good: true },
      { label: 'Aqueous solubility', value: 0.82, unit: '', good: true },
      { label: 'hERG toxicity risk', value: 0.12, unit: '', good: true },
      { label: 'BBB permeability', value: 0.91, unit: '', good: true },
    ],
  },
  {
    name: 'Aspirin',
    formula: 'C₉H₈O₄',
    atoms: [
      { el: 'C', x: -1.4, y: 0.2, z: 0 },
      { el: 'C', x: -0.5, y: 1.1, z: 0.2 },
      { el: 'C', x: 0.8, y: 0.9, z: -0.1 },
      { el: 'C', x: 1.2, y: -0.3, z: 0.2 },
      { el: 'C', x: 0.3, y: -1.2, z: -0.1 },
      { el: 'C', x: -1.0, y: -1.0, z: 0.2 },
      { el: 'O', x: -2.0, y: 1.4, z: -0.3 },
      { el: 'C', x: -3.1, y: 1.0, z: 0.4 },
      { el: 'O', x: -3.3, y: 0.1, z: 1.2 },
      { el: 'C', x: 2.6, y: -0.6, z: -0.2 },
      { el: 'O', x: 3.1, y: -1.7, z: 0.1 },
      { el: 'O', x: 3.3, y: 0.3, z: -0.7 },
    ],
    bonds: [
      [0, 1, 2], [1, 2, 1], [2, 3, 2], [3, 4, 1], [4, 5, 2],
      [5, 0, 1], [1, 6, 1], [6, 7, 1], [7, 8, 2], [3, 9, 1],
      [9, 10, 2], [9, 11, 1],
    ],
    props: [
      { label: 'logP (lipophilicity)', value: 1.19, unit: '', good: true },
      { label: 'Aqueous solubility', value: 0.64, unit: '', good: true },
      { label: 'hERG toxicity risk', value: 0.08, unit: '', good: true },
      { label: 'GI absorption', value: 0.88, unit: '', good: true },
    ],
  },
  {
    name: 'Dopamine',
    formula: 'C₈H₁₁NO₂',
    atoms: [
      { el: 'C', x: -1.3, y: 0.3, z: 0 },
      { el: 'C', x: -0.4, y: 1.2, z: 0.2 },
      { el: 'C', x: 0.9, y: 1.0, z: -0.1 },
      { el: 'C', x: 1.3, y: -0.2, z: 0.2 },
      { el: 'C', x: 0.4, y: -1.1, z: -0.1 },
      { el: 'C', x: -0.9, y: -0.9, z: 0.2 },
      { el: 'O', x: 2.0, y: 1.9, z: -0.3 },
      { el: 'O', x: 2.6, y: -0.5, z: 0.5 },
      { el: 'C', x: -2.7, y: 0.5, z: -0.3 },
      { el: 'C', x: -3.6, y: -0.6, z: 0.1 },
      { el: 'N', x: -4.9, y: -0.4, z: -0.3 },
    ],
    bonds: [
      [0, 1, 2], [1, 2, 1], [2, 3, 2], [3, 4, 1], [4, 5, 2],
      [5, 0, 1], [2, 6, 1], [3, 7, 1], [0, 8, 1], [8, 9, 1], [9, 10, 1],
    ],
    props: [
      { label: 'logP (lipophilicity)', value: -0.98, unit: '', good: false },
      { label: 'Aqueous solubility', value: 0.93, unit: '', good: true },
      { label: 'hERG toxicity risk', value: 0.21, unit: '', good: true },
      { label: 'BBB permeability', value: 0.18, unit: '', good: false },
    ],
  },
];

export default function MolForgeDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [idx, setIdx] = useState(0);
  const [predicting, setPredicting] = useState(false);
  const [shown, setShown] = useState(0); // animated reveal factor 0..1
  const mol = MOLECULES[idx];

  // animate molecule rotation
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

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.012;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.fillStyle = '#06080a';
      ctx.fillRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const scale = Math.min(W, H) / 7;

      const cos = Math.cos(t);
      const sin = Math.sin(t);
      const project = (a: Atom) => {
        const x = a.x * cos - a.z * sin;
        const z = a.x * sin + a.z * cos;
        const persp = 1 + z * 0.12;
        return { px: cx + x * scale * persp, py: cy + a.y * scale * persp, z };
      };
      const pts = mol.atoms.map(project);

      // bonds
      mol.bonds.forEach(([i, j, order]) => {
        const a = pts[i];
        const b = pts[j];
        const draws = order === 2 ? [-2.5, 2.5] : [0];
        const dx = b.px - a.px;
        const dy = b.py - a.py;
        const len = Math.hypot(dx, dy) || 1;
        const nx = (-dy / len);
        const ny = (dx / len);
        draws.forEach((off) => {
          ctx.beginPath();
          ctx.moveTo(a.px + nx * off, a.py + ny * off);
          ctx.lineTo(b.px + nx * off, b.py + ny * off);
          ctx.strokeStyle = 'rgba(154,168,148,0.55)';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });

      // atoms (sorted by depth)
      mol.atoms
        .map((a, i) => ({ a, p: pts[i] }))
        .sort((u, v) => u.p.z - v.p.z)
        .forEach(({ a, p }) => {
          const rad = (a.el === 'H' ? 5 : 9) * (1 + p.z * 0.1);
          const grad = ctx.createRadialGradient(
            p.px - rad * 0.3,
            p.py - rad * 0.3,
            1,
            p.px,
            p.py,
            rad
          );
          const col = EL_COLOR[a.el] || '#9aa894';
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.35, col);
          grad.addColorStop(1, col);
          ctx.beginPath();
          ctx.arc(p.px, p.py, rad, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.shadowColor = col;
          ctx.shadowBlur = a.el === 'C' ? 0 : 10;
          ctx.fill();
          ctx.shadowBlur = 0;
          if (a.el !== 'C' && a.el !== 'H') {
            ctx.fillStyle = '#06080a';
            ctx.font = 'bold 9px ui-monospace, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(a.el, p.px, p.py);
          }
        });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [mol]);

  // animate property reveal when molecule changes / predict pressed
  useEffect(() => {
    setShown(0);
    setPredicting(true);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setShown(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPredicting(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx]);

  return (
    <DemoChrome title="MolForge" subtitle="GNN property & ADMET prediction">
      <div className="grid h-full grid-cols-1 md:grid-cols-[1fr_280px]">
        <div className="relative bg-black">
          <canvas ref={canvasRef} className="h-full w-full" />
          <div className="pointer-events-none absolute left-4 top-4">
            <p className="text-lg font-bold text-brand-200">{mol.name}</p>
            <p className="font-mono text-xs text-[#7c8a76]">{mol.formula}</p>
          </div>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {MOLECULES.map((m, i) => (
              <button
                key={m.name}
                onClick={() => setIdx(i)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  i === idx
                    ? 'border-brand bg-brand/20 text-brand-100'
                    : 'border-white/15 bg-black/40 text-[#9aa894] hover:border-brand/40'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-3 border-t border-brand/10 bg-ink-900/60 p-4 md:border-l md:border-t-0">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-wider text-[#7c8a76]">
              Predicted ADMET
            </p>
            {predicting && (
              <span className="flex items-center gap-1 text-[10px] text-brand-300">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-brand" />
                inferring
              </span>
            )}
          </div>

          <div className="space-y-3.5">
            {mol.props.map((p) => {
              const pct = Math.round(Math.min(1, Math.max(0, p.value < 0 ? 0.5 + p.value / 4 : p.value)) * 100 * shown);
              return (
                <div key={p.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-[#cdd8c5]">{p.label}</span>
                    <span className="font-mono text-brand-300">
                      {(p.value * shown).toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${
                        p.good
                          ? 'bg-gradient-to-r from-brand-700 to-brand'
                          : 'bg-gradient-to-r from-amber-600 to-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto rounded-md border border-brand/20 bg-brand/5 p-3">
            <p className="text-[11px] uppercase tracking-wider text-[#7c8a76]">
              Drug-likeness (QED)
            </p>
            <p className="font-mono text-2xl font-bold text-brand">
              {(0.62 + idx * 0.11).toFixed(2)}
            </p>
          </div>
          <p className="rounded-md border border-brand/10 bg-black/30 p-2 text-[10px] leading-relaxed text-[#6b7866]">
            Directed message-passing NN over molecular graph · RDKit featurizer.
          </p>
        </aside>
      </div>
    </DemoChrome>
  );
}
