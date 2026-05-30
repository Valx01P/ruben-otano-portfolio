import Logo from './Logo';

export default function Footer({ className = '' }: { className?: string }) {
  return (
    <footer className={`border-t border-white/5 py-8 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 text-sm text-[#5f6c5a] sm:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <Logo size={28} badge={false} />
          <span>Ruben Otano | AI/ML Engineer</span>
        </div>
        <p>
          © {new Date().getFullYear()} Ruben Otano. All rights reserved.
        </p>
        <p className="font-mono text-xs">
          Built with Next.js · React 19 · WebGL · Tailwind
        </p>
      </div>
    </footer>
  );
}
