'use client';

import { useInView } from './useInView';

interface Skill {
  label: string;
  value: number; // 0..100
}

interface Props {
  title: string;
  skills: Skill[];
  delayBase?: number;
}

/** Animated horizontal proficiency bars — bars grow when scrolled into view. */
export default function ProficiencyBars({ title, skills, delayBase = 0 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-4 text-sm font-semibold text-brand-200">{title}</h3>
      <div className="space-y-3.5">
        {skills.map((s, i) => (
          <div key={s.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-[#cdd8c5]">{s.label}</span>
              <span className="font-mono text-brand-400">
                {inView ? s.value : 0}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-700 via-brand to-brand-300"
                style={{
                  width: inView ? `${s.value}%` : '0%',
                  transition: `width 1.1s cubic-bezier(0.22,1,0.36,1) ${
                    delayBase + i * 90
                  }ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
