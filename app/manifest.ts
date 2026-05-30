import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: 'Ruben Otano',
    description: site.shortDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#070a07',
    theme_color: '#070a07',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
