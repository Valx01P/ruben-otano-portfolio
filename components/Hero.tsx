'use client';

import { useState } from 'react';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import ShaderBackground from './ShaderBackground';
import Logo from './Logo';
import ResumeButton from './ResumeButton';

const ROLES = ['Medical Imaging', 'Clinical NLP', 'Critical-Care ML'];

export default function Hero() {
  const [imgOk, setImgOk] = useState(true);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* shader backdrop */}
      <div className="absolute inset-0">
        <ShaderBackground intensity={0.9} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/55 to-ink-950" />
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 pt-28 pb-16 md:grid-cols-[1.3fr_1fr] lg:px-8">
        <div className="animate-fade-in-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3 py-1 text-xs text-brand-200">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-brand" />
            Available for AI/ML roles · open to relocation
          </div>

          <h1 className="text-balance text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">Ruben Otano</span>
            <span className="mt-1 block">
              <span className="gradient-text">AI/ML Engineer</span>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-[#9aa894]">
            CS student at Miami Dade College and aspiring AI/ML engineer building
            machine-learning systems for{' '}
            <span className="text-brand-200">medicine</span> — from GPU-accelerated
            medical imaging to grounded clinical reasoning and real-time health
            signals.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <span
                key={r}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-[#cdd8c5]"
              >
                {r}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => go('projects')}
              className="group flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-black transition hover:bg-brand-400 brand-glow"
            >
              View projects
              <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => go('contact')}
              className="rounded-lg border border-brand/30 px-6 py-3 font-medium text-brand-200 transition hover:bg-brand/10"
            >
              Get in touch
            </button>
            <ResumeButton variant="ghost" className="px-3 py-3" />
            <div className="ml-1 flex items-center gap-1">
              {[
                { Icon: Github, href: 'https://github.com/RubenOtano', label: 'GitHub' },
                { Icon: Linkedin, href: 'https://www.linkedin.com/in/rubenotano/', label: 'LinkedIn' },
                { Icon: Mail, href: 'mailto:rubenotano13@gmail.com', label: 'Email' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="rounded-lg p-2.5 text-[#9aa894] transition hover:bg-brand/10 hover:text-brand"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Portrait orb */}
        <div className="flex justify-center md:justify-end">
          <div className="group relative animate-fade-in-up [animation-delay:150ms]">
            <div className="absolute -inset-6 rounded-[2rem] bg-brand/20 blur-3xl animate-pulse-glow" />
            <div className="relative aspect-square w-[300px] overflow-hidden rounded-[1.75rem] border border-brand/30 brand-glow transition duration-500 group-hover:-translate-y-1 sm:w-[340px] lg:w-[400px]">
              {imgOk ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/hero.webp"
                  alt="Ruben Otano | AI/ML Engineer"
                  width={400}
                  height={400}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                  onError={() => setImgOk(false)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-ink-900">
                  <Logo size={150} badge={false} />
                </div>
              )}
              {/* subtle sheen on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-brand/10 opacity-0 transition group-hover:opacity-100" />
            </div>
            {/* floating accent chips */}
            <Chip className="-left-5 top-10" label="GPU" value="A100 · TensorRT" />
            <Chip className="-right-4 bottom-12" label="Focus" value="Medical AI" />
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#5f6c5a]">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-current p-1">
          <span className="h-2 w-1 animate-bounce rounded-full bg-current" />
        </div>
      </div>
    </section>
  );
}

function Chip({
  className = '',
  label,
  value,
}: {
  className?: string;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`absolute glass rounded-xl px-3 py-2 shadow-lg shadow-black/40 ${className}`}
    >
      <p className="text-[10px] uppercase tracking-wider text-[#7c8a76]">{label}</p>
      <p className="font-mono text-xs font-semibold text-brand-200">{value}</p>
    </div>
  );
}
