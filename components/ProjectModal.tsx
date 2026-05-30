'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/lib/projects';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === 'demo:close') onClose();
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('message', onMsg);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('message', onMsg);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} live demo`}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-[fade-in-up_0.2s_ease]"
        onClick={onClose}
      />

      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-brand/25 bg-ink-950 shadow-2xl shadow-brand/10 animate-[fade-in-up_0.3s_ease]">
        {/* header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#e6f0e0]">{project.name}</h3>
              <span className="rounded-full border border-brand/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-brand-300">
                {project.domain}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-[#9aa894]">{project.tagline}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/demos/${project.slug}`}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#cdd8c5] transition hover:border-brand/40 hover:text-brand sm:flex"
            >
              <ExternalLink size={14} /> New tab
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-[#9aa894] transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* live demo */}
        <div className="relative w-full bg-black" style={{ height: 'min(62vh, 560px)' }}>
          <iframe
            src={`/demos/${project.slug}`}
            title={`${project.name} live demo`}
            allow="fullscreen"
            className="h-full w-full"
          />
        </div>

        {/* footer details */}
        <div className="grid gap-5 border-t border-white/10 p-5 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm leading-relaxed text-[#9aa894]">
              {project.description}
            </p>
            <ul className="mt-3 space-y-1.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm text-[#cdd8c5]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-[#7c8a76]">
              Stack
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-brand/10 px-2.5 py-1 text-xs text-brand-200"
                >
                  {s}
                </span>
              ))}
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-[#cdd8c5] transition hover:border-brand/40 hover:text-brand"
            >
              <Github size={16} /> Source
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
