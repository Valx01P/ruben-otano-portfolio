'use client';

import { useEffect, useRef, useState } from 'react';
import DemoChrome from './DemoChrome';

interface Vital {
  key: string;
  label: string;
  unit: string;
  base: number;
  amp: number;
  color: string;
  data: number[];
}

export default function VitalStreamDemo() {
  const [risk, setRisk] = useState(0.18);
  const [scenario, setScenario] = useState<'stable' | 'deteriorating'>('stable');
  const [events, setEvents] = useState<{ t: string; msg: string; level: 'info' | 'warn' | 'crit' }[]>([
    { t: '00:00', msg: 'Monitoring started · TFT model online', level: 'info' },
  ]);
  const scenarioRef = useRef(scenario);
  scenarioRef.current = scenario;
  const riskRef = useRef(0.18);
  const tickRef = useRef(0);

  const vitalsRef = useRef<Vital[]>([
    { key: 'hr', label: 'Heart Rate', unit: 'bpm', base: 78, amp: 4, color: '#76b900', data: [] },
    { key: 'spo2', label: 'SpO₂', unit: '%', base: 97, amp: 1, color: '#5b8def', data: [] },
    { key: 'map', label: 'Mean Art. Pressure', unit: 'mmHg', base: 86, amp: 3, color: '#c9ec8a' },
    { key: 'rr', label: 'Resp. Rate', unit: '/min', base: 16, amp: 2, color: '#ff9f43', data: [] },
  ].map((v) => ({ ...v, data: [] as number[] })));

  const [readouts, setReadouts] = useState<Record<string, number>>({
    hr: 78, spo2: 97, map: 86, rr: 16,
  });
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const loop = (now: number) => {
      acc += now - last;
      last = now;

      if (acc > 120) {
        acc = 0;
        tickRef.current++;
        const deteriorating = scenarioRef.current === 'deteriorating';

        // drift risk
        const targetRisk = deteriorating ? 0.86 : 0.16;
        riskRef.current += (targetRisk - riskRef.current) * 0.018;
        const r = riskRef.current;
        setRisk(r);

        const t = tickRef.current;
        vitalsRef.current.forEach((v) => {
          let val = v.base + Math.sin(t * 0.2 + v.base) * v.amp + (Math.sin(t * 1.7) * v.amp) / 2;
          if (deteriorating) {
            if (v.key === 'hr') val += r * 46; // tachycardia
            if (v.key === 'spo2') val -= r * 12; // desaturation
            if (v.key === 'map') val -= r * 28; // hypotension
            if (v.key === 'rr') val += r * 14; // tachypnea
          }
          v.data.push(val);
          if (v.data.length > 120) v.data.shift();
        });

        setReadouts({
          hr: Math.round(vitalsRef.current[0].data.at(-1) || 78),
          spo2: Math.round(vitalsRef.current[1].data.at(-1) || 97),
          map: Math.round(vitalsRef.current[2].data.at(-1) || 86),
          rr: Math.round(vitalsRef.current[3].data.at(-1) || 16),
        });

        // events
        if (deteriorating) {
          const mm = String(Math.floor(t / 60)).padStart(2, '0');
          const ss = String(t % 60).padStart(2, '0');
          if (Math.abs(r - 0.45) < 0.012) {
            pushEvent(`${mm}:${ss}`, 'Risk crossed 0.40 — rising trend', 'warn');
          } else if (Math.abs(r - 0.7) < 0.012) {
            pushEvent(`${mm}:${ss}`, 'SpO₂ ↓ MAP ↓ — sepsis pattern flagged', 'crit');
          } else if (Math.abs(r - 0.82) < 0.012) {
            pushEvent(`${mm}:${ss}`, 'Predicted deterioration within 6h — escalate', 'crit');
          }
        }

        // draw sparklines
        vitalsRef.current.forEach((v) => drawSpark(v));
      }
      raf = requestAnimationFrame(loop);
    };

    const pushEvent = (
      t: string,
      msg: string,
      level: 'info' | 'warn' | 'crit'
    ) => {
      setEvents((e) => {
        if (e.some((x) => x.msg === msg)) return e;
        return [{ t, msg, level }, ...e].slice(0, 6);
      });
    };

    const drawSpark = (v: Vital) => {
      const canvas = canvasRefs.current[v.key];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const W = rect.width;
      const H = rect.height;
      ctx.clearRect(0, 0, W, H);
      const d = v.data;
      if (d.length < 2) return;
      const min = Math.min(...d);
      const max = Math.max(...d);
      const range = max - min || 1;
      ctx.beginPath();
      d.forEach((val, i) => {
        const x = (i / (d.length - 1)) * W;
        const y = H - ((val - min) / range) * (H - 8) - 4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = v.color;
      ctx.lineWidth = 1.75;
      ctx.shadowColor = v.color;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;
      // fill
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = v.color + '18';
      ctx.fill();
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const riskColor =
    risk > 0.7 ? '#ef4444' : risk > 0.4 ? '#f59e0b' : '#76b900';
  const riskLabel = risk > 0.7 ? 'CRITICAL' : risk > 0.4 ? 'ELEVATED' : 'STABLE';

  return (
    <DemoChrome title="VitalStream" subtitle="ICU deterioration early-warning">
      <div className="grid h-full grid-cols-1 gap-3 overflow-y-auto p-3 lg:grid-cols-[1fr_300px]">
        {/* vitals grid */}
        <div className="grid grid-cols-2 gap-3 content-start">
          {vitalsRef.current.map((v) => (
            <div
              key={v.key}
              className="rounded-xl border border-white/10 bg-ink-900/70 p-3"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-wide text-[#7c8a76]">
                  {v.label}
                </span>
                <span className="font-mono text-xl font-bold" style={{ color: v.color }}>
                  {readouts[v.key]}
                  <span className="ml-1 text-[10px] text-[#7c8a76]">{v.unit}</span>
                </span>
              </div>
              <canvas
                ref={(el) => {
                  canvasRefs.current[v.key] = el;
                }}
                className="mt-2 h-14 w-full"
              />
            </div>
          ))}
        </div>

        {/* risk panel */}
        <aside className="flex flex-col gap-3">
          <div
            className="rounded-xl border p-4 text-center transition-colors"
            style={{
              borderColor: riskColor + '55',
              background: riskColor + '12',
            }}
          >
            <p className="text-[11px] uppercase tracking-wider text-[#7c8a76]">
              Deterioration risk · 6h horizon
            </p>
            <div className="relative mx-auto my-3 h-28 w-28">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={riskColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${risk * 264} 264`}
                  style={{ transition: 'stroke-dasharray 0.2s linear, stroke 0.4s' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-3xl font-bold" style={{ color: riskColor }}>
                  {(risk * 100) | 0}
                </span>
                <span className="text-[10px] text-[#7c8a76]">/ 100</span>
              </div>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-bold tracking-wider"
              style={{ background: riskColor + '22', color: riskColor }}
            >
              {riskLabel}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setScenario('stable')}
              className={`flex-1 rounded-md border py-2 text-xs font-medium transition ${
                scenario === 'stable'
                  ? 'border-brand bg-brand/15 text-brand-200'
                  : 'border-white/10 text-[#9aa894] hover:border-brand/40'
              }`}
            >
              Stable
            </button>
            <button
              onClick={() => setScenario('deteriorating')}
              className={`flex-1 rounded-md border py-2 text-xs font-medium transition ${
                scenario === 'deteriorating'
                  ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                  : 'border-white/10 text-[#9aa894] hover:border-amber-400/40'
              }`}
            >
              Simulate decline
            </button>
          </div>

          <div className="flex-1 rounded-xl border border-white/10 bg-ink-900/70 p-3">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-[#7c8a76]">
              Event log
            </p>
            <ul className="space-y-1.5">
              {events.map((e, i) => (
                <li key={i} className="flex gap-2 text-[11px]">
                  <span className="font-mono text-[#5f6c5a]">{e.t}</span>
                  <span
                    className={
                      e.level === 'crit'
                        ? 'text-red-400'
                        : e.level === 'warn'
                        ? 'text-amber-300'
                        : 'text-[#9aa894]'
                    }
                  >
                    {e.msg}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </DemoChrome>
  );
}
