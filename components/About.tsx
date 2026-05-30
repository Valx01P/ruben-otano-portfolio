import { Award, GraduationCap, Rocket, Users } from 'lucide-react';
import Reveal from './Reveal';
import RadarChart from './charts/RadarChart';
import StatRing from './charts/StatRing';

const COMPETENCIES = [
  { label: 'Machine Learning', value: 0.82 },
  { label: 'Computer Vision', value: 0.76 },
  { label: 'NLP / LLMs', value: 0.72 },
  { label: 'GPU / Systems', value: 0.6 },
  { label: 'Full-Stack', value: 0.9 },
  { label: 'Research', value: 0.66 },
];

const CREDENTIALS = [
  { Icon: Rocket, label: 'Founder', sub: 'CodeIN' },
  { Icon: Award, label: 'MLT Career Prep', sub: "CP '28" },
  { Icon: GraduationCap, label: 'Presidential Scholar', sub: 'Miami Dade College' },
  { Icon: Users, label: 'CodePath', sub: 'E3 Scholar' },
];

export default function About() {
  return (
    <section id="about" className="relative border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <p className="mb-3 font-mono text-sm text-brand">// about</p>
          <h2 className="max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            A builder bridging frontier ML and the realities of{' '}
            <span className="gradient-text">clinical care</span>.
          </h2>
        </Reveal>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal className="space-y-5 text-lg leading-relaxed text-[#9aa894]">
            <p>
              I&apos;m <span className="text-[#e6f0e0]">Ruben Otano</span> — a
              Computer Science student at Miami Dade College (4.00 GPA,
              Presidential Scholar) and an aspiring AI/ML engineer. I&apos;m an{' '}
              <span className="text-brand-200">MLT Career Prep fellow</span>, a{' '}
              <span className="text-brand-200">CodePath E3 Scholar</span>, and the
              founder of <span className="text-brand-200">CodeIN</span>.
            </p>
            <p>
              I build across the full ML stack — from medical imaging and clinical
              language to real-time health signals — and I love the engineering
              that makes models fast and trustworthy. I&apos;m driven by the kind
              of work happening at{' '}
              <span className="text-brand-200">NVIDIA, Anthropic, and OpenAI</span>,
              and I want to bring that rigor to problems that improve lives.
            </p>

            {/* credential badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {CREDENTIALS.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-brand/40"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/5">
                    <c.Icon size={17} className="text-brand" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#e6f0e0]">
                      {c.label}
                    </p>
                    <p className="truncate text-xs text-[#7c8a76]">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* radar chart */}
          <Reveal delay={120}>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6">
              <p className="mb-1 text-center font-mono text-xs uppercase tracking-wider text-[#7c8a76]">
                competency profile
              </p>
              <RadarChart data={COMPETENCIES} size={380} />
            </div>
          </Reveal>
        </div>

        {/* animated stat rings */}
        <Reveal>
          <div className="mt-14 grid grid-cols-2 gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:grid-cols-4">
            <StatRing value={4.0} fill={1} decimals={2} label="GPA" sub="Miami Dade College" />
            <StatRing value={6} fill={1} label="ML projects" sub="built & interactive" />
            <StatRing value={3} fill={0.75} label="Scholar programs" sub="MLT · CodePath · MDC" />
            <StatRing value={709} fill={0.7} label="Followers" sub="tech community" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
