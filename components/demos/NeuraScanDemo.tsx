'use client';

import { useEffect, useRef, useState } from 'react';
import DemoChrome from './DemoChrome';

type Finding = { label: string; conf: number; x: number; y: number; r: number };

const CASES: { id: string; label: string; findings: Finding[] }[] = [
  {
    id: 'case-1',
    label: 'PA-0428',
    findings: [
      { label: 'Cardiomegaly', conf: 0.91, x: 52, y: 64, r: 18 },
      { label: 'Pleural Effusion', conf: 0.74, x: 30, y: 74, r: 12 },
    ],
  },
  {
    id: 'case-2',
    label: 'PA-1097',
    findings: [
      { label: 'Pneumonia', conf: 0.88, x: 66, y: 52, r: 15 },
      { label: 'Infiltration', conf: 0.61, x: 70, y: 60, r: 11 },
    ],
  },
  {
    id: 'case-3',
    label: 'PA-2231',
    findings: [{ label: 'No acute finding', conf: 0.96, x: 50, y: 50, r: 0 }],
  },
];

export default function NeuraScanDemo() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const raf = useRef<number>(0);

  const current = CASES[caseIdx];

  const analyze = () => {
    setDone(false);
    setScanning(true);
    setProgress(0);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1800);
      setProgress(p);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setScanning(false);
        setDone(true);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const selectCase = (i: number) => {
    cancelAnimationFrame(raf.current);
    setCaseIdx(i);
    setScanning(false);
    setDone(false);
    setProgress(0);
  };

  return (
    <DemoChrome title="NeuraScan" subtitle="thoracic pathology detection">
      <div className="grid h-full grid-cols-1 md:grid-cols-[1fr_280px]">
        {/* Radiograph viewport */}
        <div className="relative flex items-center justify-center bg-black p-4">
          <div className="relative aspect-[3/4] h-full max-h-[420px] overflow-hidden rounded-lg ring-1 ring-brand/20">
            <XRay />
            {/* scan line */}
            {scanning && (
              <div
                className="pointer-events-none absolute inset-x-0 h-0.5 bg-brand shadow-[0_0_18px_4px_rgba(118,185,0,0.8)]"
                style={{ top: `${progress * 100}%` }}
              />
            )}
            {scanning && (
              <div
                className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-brand/20 to-transparent"
                style={{ height: `${progress * 100}%` }}
              />
            )}
            {/* findings */}
            {done &&
              current.findings.map(
                (f, i) =>
                  f.r > 0 && (
                    <div
                      key={i}
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-[fade-in-up_0.4s_ease]"
                      style={{ left: `${f.x}%`, top: `${f.y}%` }}
                    >
                      <div
                        className="rounded-full border-2 border-brand"
                        style={{
                          width: `${f.r * 2}%`,
                          height: `${f.r * 2}%`,
                          minWidth: 48,
                          minHeight: 48,
                          background:
                            'radial-gradient(circle, rgba(118,185,0,0.32), transparent 70%)',
                          boxShadow: '0 0 16px rgba(118,185,0,0.5)',
                        }}
                      />
                      <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-black">
                        {f.label} {(f.conf * 100) | 0}%
                      </span>
                    </div>
                  )
              )}
          </div>
        </div>

        {/* Control panel */}
        <aside className="flex flex-col gap-4 border-t border-brand/10 bg-ink-900/60 p-4 md:border-l md:border-t-0">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-[#7c8a76]">
              Study
            </p>
            <div className="flex gap-2">
              {CASES.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => selectCase(i)}
                  className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition ${
                    i === caseIdx
                      ? 'border-brand bg-brand/15 text-brand-200'
                      : 'border-white/10 text-[#9aa894] hover:border-brand/40'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={analyze}
            disabled={scanning}
            className="rounded-md bg-brand py-2.5 text-sm font-semibold text-black transition hover:bg-brand-400 disabled:opacity-50"
          >
            {scanning
              ? `Analyzing… ${(progress * 100) | 0}%`
              : 'Run inference'}
          </button>

          <div className="flex-1">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-[#7c8a76]">
              Predictions
            </p>
            {!done && (
              <p className="text-xs text-[#5f6c5a]">
                Run inference to surface pathology probabilities.
              </p>
            )}
            <div className="space-y-2.5">
              {done &&
                current.findings.map((f, i) => (
                  <div key={i}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-[#cdd8c5]">{f.label}</span>
                      <span className="font-mono text-brand-300">
                        {(f.conf * 100) | 0}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand"
                        style={{ width: `${f.conf * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <p className="rounded-md border border-brand/10 bg-black/30 p-2 text-[10px] leading-relaxed text-[#6b7866]">
            DenseNet-121 · Grad-CAM localization · TensorRT FP16. Research demo —
            not for clinical use.
          </p>
        </aside>
      </div>
    </DemoChrome>
  );
}

/** Stylized procedural chest radiograph. */
function XRay() {
  return (
    <svg viewBox="0 0 300 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="ns-lung" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#2a2f2a" />
          <stop offset="100%" stopColor="#0a0c0a" />
        </radialGradient>
        <linearGradient id="ns-bone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfd6c8" />
          <stop offset="100%" stopColor="#7e8678" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#ns-lung)" />
      {/* spine */}
      <rect x="143" y="40" width="14" height="320" rx="6" fill="#4a513f" opacity="0.6" />
      {[...Array(12)].map((_, i) => (
        <rect key={i} x="138" y={56 + i * 26} width="24" height="6" rx="3" fill="#5a6149" opacity="0.5" />
      ))}
      {/* ribs */}
      {[...Array(9)].map((_, i) => {
        const y = 70 + i * 28;
        return (
          <g key={i} stroke="url(#ns-bone)" strokeWidth="3" fill="none" opacity="0.45">
            <path d={`M150 ${y} Q90 ${y + 8} 40 ${y + 46}`} />
            <path d={`M150 ${y} Q210 ${y + 8} 260 ${y + 46}`} />
          </g>
        );
      })}
      {/* clavicles */}
      <path d="M150 70 Q100 58 50 72" stroke="url(#ns-bone)" strokeWidth="5" fill="none" opacity="0.6" />
      <path d="M150 70 Q200 58 250 72" stroke="url(#ns-bone)" strokeWidth="5" fill="none" opacity="0.6" />
      {/* heart shadow */}
      <ellipse cx="135" cy="250" rx="55" ry="62" fill="#1a1d18" opacity="0.7" />
    </svg>
  );
}
