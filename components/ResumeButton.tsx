'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, X, Download, ExternalLink } from 'lucide-react';

const RESUME_PATH = '/Ruben_Otano_Resume.pdf';

interface Props {
  className?: string;
  label?: string;
  variant?: 'solid' | 'outline' | 'ghost';
}

export default function ResumeButton({
  className = '',
  label = 'Résumé',
  variant = 'outline',
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const styles =
    variant === 'solid'
      ? 'bg-brand text-black hover:bg-brand-400 brand-glow'
      : variant === 'ghost'
      ? 'text-[#9aa894] hover:text-brand'
      : 'border border-brand/30 text-brand-200 hover:bg-brand/10';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${styles} ${className}`}
      >
        <FileText size={16} />
        {label}
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Résumé preview"
          >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-[fade-in-up_0.2s_ease]"
            onClick={() => setOpen(false)}
          />

          <div
            className="relative flex max-h-[96vh] flex-col overflow-hidden rounded-2xl border border-brand/25 bg-ink-950 shadow-2xl shadow-brand/10 animate-[fade-in-up_0.3s_ease]"
            style={{ width: 'calc(min(86vh, calc(92vw * 11 / 8.5)) * 8.5 / 11)' }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText size={18} className="shrink-0 text-brand" />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-[#e6f0e0]">
                    Ruben Otano — Résumé
                  </h3>
                  <p className="truncate text-xs text-[#7c8a76]">AI/ML Engineer</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={RESUME_PATH}
                  download="Ruben_Otano_Resume.pdf"
                  className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-brand-400"
                >
                  <Download size={14} /> Download
                </a>
                <a
                  href={RESUME_PATH}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#cdd8c5] transition hover:border-brand/40 hover:text-brand sm:flex"
                >
                  <ExternalLink size={14} /> New tab
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-[#9aa894] transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* PDF preview — box matches letter-page aspect (8.5 : 11) and fills
                most of the viewport, so the full page renders large & readable */}
            <div
              className="relative bg-[#1a1a1a]"
              style={{ height: 'min(86vh, calc(92vw * 11 / 8.5))' }}
            >
              {/* fallback shown if the PDF hasn't been added yet — the iframe paints over it when present */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                <FileText size={32} className="text-[#3a4033]" />
                <p className="text-sm text-[#7c8a76]">
                  If the preview is blank, the résumé PDF is still being added.
                </p>
                <a
                  href={RESUME_PATH}
                  download
                  className="pointer-events-auto text-xs text-brand-300 underline"
                >
                  Download Ruben_Otano_Resume.pdf
                </a>
              </div>
              <iframe
                src={`${RESUME_PATH}#view=FitH&toolbar=1&navpanes=0`}
                title="Ruben Otano résumé"
                className="relative h-full w-full"
              />
            </div>
          </div>
          </div>,
          document.body
        )}
    </>
  );
}
