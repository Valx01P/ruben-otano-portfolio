'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import ResumeButton from './ResumeButton';

const LINKS = ['About', 'Projects', 'Stack', 'Contact'];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-brand/15 bg-ink-950/80 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-2"
        >
          <Logo size={34} className="transition group-hover:scale-105" />
          <span className="hidden text-sm font-medium tracking-tight text-[#cdd8c5] sm:block">
            Ruben&nbsp;Otano
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <button
              key={l}
              onClick={() => go(l)}
              className="rounded-md px-3 py-2 text-sm text-[#9aa894] transition hover:text-brand"
            >
              {l}
            </button>
          ))}
          <ResumeButton variant="outline" className="ml-1" />
          <button
            onClick={() => go('Contact')}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-black transition hover:bg-brand-400 brand-glow"
          >
            Let&apos;s talk
          </button>
        </div>

        <button
          className="text-[#cdd8c5] md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="glass-strong border-t border-brand/10 md:hidden">
          <div className="space-y-1 px-4 py-3">
            {LINKS.map((l) => (
              <button
                key={l}
                onClick={() => go(l)}
                className="block w-full rounded-md px-3 py-2.5 text-left text-[#cdd8c5] transition hover:bg-brand/10 hover:text-brand"
              >
                {l}
              </button>
            ))}
            <div className="px-1 pt-1">
              <ResumeButton variant="outline" className="w-full justify-center" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
