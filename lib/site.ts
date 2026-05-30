/**
 * Central site config used for SEO, social cards, sitemap, manifest, and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in the environment for the canonical/production URL.
 */
export const site = {
  name: 'Ruben Otano',
  jobTitle: 'AI/ML Engineer',
  title: 'Ruben Otano | AI/ML Engineer',
  description:
    'Ruben Otano is an AI/ML engineer building machine-learning systems for medicine — medical imaging, clinical NLP, drug discovery, and real-time critical-care models. Computer Science student, MLT Career Prep fellow, and CodePath E3 Scholar.',
  shortDescription:
    'AI/ML engineer building machine learning for medicine — imaging, clinical NLP, and real-time health models.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://rubenotano.onrender.com').replace(/\/$/, ''),
  locale: 'en_US',
  email: 'rubenotano13@gmail.com',
  github: 'https://github.com/RubenOtano',
  linkedin: 'https://www.linkedin.com/in/rubenotano/',
  keywords: [
    'Ruben Otano',
    'AI Engineer',
    'Machine Learning Engineer',
    'Medical AI',
    'Deep Learning',
    'Computer Vision',
    'Clinical NLP',
    'Healthcare AI',
    'PyTorch',
    'NVIDIA',
    'Miami',
    'AI/ML portfolio',
  ],
} as const;
