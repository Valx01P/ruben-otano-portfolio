'use client';

import { ReactNode, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** A browser/app-window frame so each embedded demo reads as its own product.
 *  The macOS traffic lights are functional: close, minimize, fullscreen. */
export default function DemoChrome({ title, subtitle, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);
  const [isFs, setIsFs] = useState(false);

  const close = () => {
    setClosed(true);
    // If embedded in a card/modal iframe, ask the parent to dismiss.
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({ type: 'demo:close', title }, '*');
    }
  };

  const toggleFullscreen = async () => {
    const el = rootRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFs(true);
      } else {
        await document.exitFullscreen();
        setIsFs(false);
      }
    } catch {
      /* fullscreen may be blocked in cross-origin iframes — no-op */
    }
  };

  return (
    <div ref={rootRef} className="flex h-full w-full flex-col bg-ink-950 text-[#e6f0e0]">
      <header className="flex items-center gap-3 border-b border-brand/15 bg-ink-900/80 px-4 py-2.5 backdrop-blur">
        <div className="group/lights flex gap-1.5">
          <button
            onClick={close}
            title="Close"
            aria-label="Close"
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f56] text-[8px] font-bold leading-none text-[#7a0c00] transition hover:brightness-110"
          >
            <span className="opacity-0 group-hover/lights:opacity-100">×</span>
          </button>
          <button
            onClick={() => setMinimized((m) => !m)}
            title={minimized ? 'Expand' : 'Minimize'}
            aria-label="Minimize"
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ffbd2e] text-[8px] font-bold leading-none text-[#7a4b00] transition hover:brightness-110"
          >
            <span className="opacity-0 group-hover/lights:opacity-100">
              {minimized ? '+' : '−'}
            </span>
          </button>
          <button
            onClick={toggleFullscreen}
            title={isFs ? 'Exit full screen' : 'Full screen'}
            aria-label="Fullscreen"
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand text-[8px] font-bold leading-none text-[#1f3001] transition hover:brightness-110"
          >
            <span className="opacity-0 group-hover/lights:opacity-100">
              {isFs ? '↙' : '↗'}
            </span>
          </button>
        </div>
        <div className="ml-2 flex items-baseline gap-2 overflow-hidden">
          <span className="truncate text-sm font-semibold text-brand-200">{title}</span>
          {subtitle && (
            <span className="truncate text-xs text-[#7c8a76]">{subtitle}</span>
          )}
        </div>
      </header>

      {/* body */}
      {!closed && !minimized && (
        <main className="relative flex-1 overflow-hidden">{children}</main>
      )}

      {/* minimized state */}
      {!closed && minimized && (
        <div className="flex flex-1 items-center justify-center bg-ink-950">
          <button
            onClick={() => setMinimized(false)}
            className="rounded-lg border border-brand/30 px-4 py-2 text-sm text-brand-200 transition hover:bg-brand/10"
          >
            {title} — minimized · click to restore
          </button>
        </div>
      )}

      {/* closed state */}
      {closed && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-ink-950 text-center">
          <p className="text-sm text-[#7c8a76]">{title} closed.</p>
          <button
            onClick={() => setClosed(false)}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black transition hover:bg-brand-400"
          >
            <RotateCcw size={15} /> Reopen
          </button>
        </div>
      )}
    </div>
  );
}
