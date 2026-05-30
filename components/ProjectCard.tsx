'use client';

import { useEffect, useRef, useState } from 'react';
import { Maximize2, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/projects';

interface Props {
  project: Project;
  index: number;
  onLaunch: (p: Project) => void;
}

export default function ProjectCard({ project, index, onLaunch }: Props) {
  const [inView, setInView] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Mount the live preview once the card scrolls near the viewport — then it
  // plays on its own (the demos self-animate). Stays mounted once revealed.
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 transition duration-300 hover:-translate-y-1 hover:border-brand/40"
      style={{ boxShadow: '0 8px 30px -18px rgba(0,0,0,0.6)' }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = `0 24px 60px -24px ${project.accent}66`)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = '0 8px 30px -18px rgba(0,0,0,0.6)')
      }
    >
      {/* animated gradient glow (shader-like) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at 50% -10%, ${project.accent}22, transparent 60%)`,
        }}
      />

      {/* Live preview pane — autoplaying demo */}
      <button
        ref={previewRef as unknown as React.RefObject<HTMLButtonElement>}
        onClick={() => onLaunch(project)}
        className="relative block aspect-[16/10] w-full overflow-hidden border-b border-white/10 bg-black text-left"
        aria-label={`Launch ${project.name} demo`}
      >
        {inView && (
          <iframe
            src={`/demos/${project.slug}`}
            title={`${project.name} live preview`}
            loading="lazy"
            tabIndex={-1}
            onLoad={() => setFrameReady(true)}
            className="pointer-events-none absolute left-0 top-0 origin-top-left"
            style={{
              width: '200%',
              height: '200%',
              transform: 'scale(0.5)',
              opacity: frameReady ? 1 : 0,
              transition: 'opacity 0.5s',
            }}
          />
        )}

        {/* Poster shown while the live preview loads */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            frameReady ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <Poster project={project} />
        </div>

        {/* "live" pill */}
        <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-brand/30 bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-brand-200 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-brand" />
          live
        </span>

        {/* expand affordance on hover */}
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition group-hover:bg-black/25">
          <span className="flex items-center gap-2 rounded-full border border-brand/40 bg-black/70 px-4 py-2 text-sm font-semibold text-brand-100 opacity-0 backdrop-blur transition group-hover:opacity-100">
            <Maximize2 size={15} />
            Open full demo
          </span>
        </span>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-1 font-mono text-[11px] uppercase tracking-wider text-brand-400">
          {String(index + 1).padStart(2, '0')} · {project.domain}
        </span>
        <h3 className="text-xl font-bold tracking-tight text-[#e6f0e0]">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-[#9aa894]">{project.tagline}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {project.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-brand/20 bg-brand/[0.04] p-2 text-center"
            >
              <p className="font-mono text-sm font-bold text-brand">{m.value}</p>
              <p className="text-[10px] text-[#7c8a76]">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-md bg-brand/10 px-2 py-0.5 text-[11px] text-brand-300"
            >
              {s}
            </span>
          ))}
        </div>

        <button
          onClick={() => onLaunch(project)}
          className="mt-5 flex items-center justify-center gap-1.5 rounded-lg border border-brand/30 py-2.5 text-sm font-semibold text-brand-200 transition hover:bg-brand hover:text-black"
        >
          Open live demo
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}

/** Lightweight poster shown only until the live preview finishes loading. */
function Poster({ project }: { project: Project }) {
  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-ink-900/80 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f56]" />
        <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
        <span className="h-2 w-2 rounded-full" style={{ background: project.accent }} />
        <span className="ml-2 truncate font-mono text-[10px] text-[#7c8a76]">
          {project.slug}.app
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(120% 100% at 80% 0%, ${project.accent}33, transparent 55%), repeating-linear-gradient(90deg, ${project.accent}10 0 1px, transparent 1px 22px)`,
          }}
        />
        <div className="relative flex h-full items-center gap-3 px-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-lg font-bold text-black"
            style={{ background: project.accent }}
          >
            {project.name[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#e6f0e0]">{project.name}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-[#9aa894]">
              <span className="inline-block h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-brand border-t-transparent" />
              loading demo…
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
