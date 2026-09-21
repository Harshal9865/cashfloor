import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CashFloor — Freelance Runway Calculator',
    short_name: 'CashFloor',
    description: 'Conservative 20th-percentile cash flow and runway calculator for freelancers and consultants.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0F161A',
    theme_color: '#10B981',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
