'use client';

import { DEMOS } from '@/components/demos/registry';
import type { DemoSlug } from '@/lib/projects';

export default function DemoFrame({ slug }: { slug: DemoSlug }) {
  const Demo = DEMOS[slug];
  if (!Demo) return null;
  return <Demo />;
}
