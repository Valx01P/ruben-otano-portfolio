import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects, type DemoSlug } from '@/lib/projects';
import DemoFrame from './DemoFrame';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.name} — ${project.tagline}`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `/demos/${slug}` },
    openGraph: { title, description: project.description, type: 'article' },
    twitter: { card: 'summary_large_image', title, description: project.description },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="h-screen w-screen overflow-hidden bg-ink-950">
      <DemoFrame slug={slug as DemoSlug} />
    </div>
  );
}
