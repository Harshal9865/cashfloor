import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CashFloor — Freelance Runway Calculator',
    short_name: 'CashFloor',
    description: 'Conservative 20th-percentile cash flow and runway calculator for freelancers and consultants.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#080C10',
    theme_color: '#2F6F62',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
