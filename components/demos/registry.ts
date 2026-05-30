import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { DemoSlug } from '@/lib/projects';

// Client-only demos (canvas / WebGL heavy) loaded on demand.
export const DEMOS: Record<DemoSlug, ComponentType> = {
  neurascan: dynamic(() => import('./NeuraScanDemo'), { ssr: false }),
  oncoseg: dynamic(() => import('./OncoSegDemo'), { ssr: false }),
  cardiopulse: dynamic(() => import('./CardioPulseDemo'), { ssr: false }),
  clinicallm: dynamic(() => import('./ClinicalLMDemo'), { ssr: false }),
  molforge: dynamic(() => import('./MolForgeDemo'), { ssr: false }),
  vitalstream: dynamic(() => import('./VitalStreamDemo'), { ssr: false }),
};
