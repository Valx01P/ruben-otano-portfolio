'use client';

import { useState } from 'react';
import { projects, type Project } from '@/lib/projects';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import Reveal from './Reveal';

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative border-t border-white/5 py-24">
      {/* subtle backdrop glow */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <p className="mb-3 font-mono text-sm text-brand">// projects</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Six AI/ML systems for medicine —{' '}
              <span className="gradient-text">live and interactive</span>.
            </h2>
            <p className="max-w-sm text-sm text-[#7c8a76]">
              Each card runs a real in-browser demo. Hover to preview, or launch
              the full experience.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 90}>
              <ProjectCard project={p} index={i} onLaunch={setActive} />
            </Reveal>
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
