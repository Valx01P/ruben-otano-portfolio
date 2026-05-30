'use client';

import { useEffect, useState } from 'react';
import { useInView } from './useInView';

interface Props {
  value: number;
  /** 0..1 — how full the ring should be (defaults to full) */
  fill?: number;
  suffix?: string;
  decimals?: number;
  label: string;
  sub?: string;
}

/** Circular progress ring with a count-up number. */
export default function StatRing({
  value,
  fill = 1,
  suffix = '',
  decimals = 0,
  label,
  sub,
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [display, setDisplay] = useState(0);
  const R = 34;
  const C = 2 * Math.PI * R;

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            stroke="#76b900"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={inView ? C * (1 - fill) : C}
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xl font-bold text-brand">
            {display.toFixed(decimals)}
            {suffix}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-[#cdd8c5]">{label}</p>
      {sub && <p className="text-xs text-[#7c8a76]">{sub}</p>}
    </div>
  );
}
