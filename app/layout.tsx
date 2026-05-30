import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { site } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: '%s · Ruben Otano',
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  applicationName: site.title,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.title,
    title: site.title,
    description: site.shortDescription,
    locale: site.locale,
    // app/opengraph-image.png is picked up automatically; declared here for clarity
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.shortDescription,
    creator: '@rubenotano',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#070a07',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.jobTitle,
  url: site.url,
  email: `mailto:${site.email}`,
  image: `${site.url}/ruben.webp`,
  description: site.shortDescription,
  sameAs: [site.github, site.linkedin],
  knowsAbout: [
    'Machine Learning',
    'Deep Learning',
    'Medical Imaging',
    'Computer Vision',
    'Natural Language Processing',
    'Graph Neural Networks',
    'PyTorch',
    'GPU Computing',
  ],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Florida International University' },
    { '@type': 'CollegeOrUniversity', name: 'Miami Dade College' },
  ],
  worksFor: { '@type': 'Organization', name: 'CodeCrunch' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Miami',
    addressRegion: 'FL',
    addressCountry: 'US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
