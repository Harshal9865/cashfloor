export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readingTime: string;
  url: string;
  isExternal: boolean;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
}

export interface DevToArticleItem {
  id: number;
  title: string;
  description?: string;
  readable_publish_date?: string;
  tag_list?: string[];
  reading_time_minutes?: number;
  url: string;
  cover_image?: string | null;
  social_image?: string | null;
  user?: {
    name?: string;
    profile_image?: string;
  };
}

export const CORNERSTONE_POSTS: BlogPost[] = [
  {
    id: 'the-20th-percentile-math',
    title: 'The 20th Percentile Math: Why Average Income is a Trap for Freelancers',
    description: 'Most freelancers calculate their runway based on their average monthly income. Here is the mathematical proof of why that leads to anxiety, volatility debt, and insolvency.',
    date: 'Sep 12, 2026',
    category: 'Methodology',
    readingTime: '5 min read',
    url: '/blog/the-20th-percentile-math',
    isExternal: false,
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'CashFloor Research Desk',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['runway', 'volatility', 'mathematics'],
  },
  {
    id: 'five-pillar-partitioning',
    title: 'The 5-Pillar Partition: How to Structurally Separate Taxes, Runway, and Living Draws',
    description: 'A step-by-step blueprint for allocating irregular freelance inflows across tax escrow, operating reserve, baseline survival, growth, and guilt-free surplus.',
    date: 'Sep 18, 2026',
    category: 'Cash Management',
    readingTime: '7 min read',
    url: '#',
    isExternal: false,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Elena Rostova, CPA',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['taxes', 'partitioning', 'financial-calm'],
  },
  {
    id: 'fx-volatility-haircuts',
    title: 'Cross-Border Contractor FX Buffering: Defending Against Currency Swings in USD/EUR',
    description: 'When billing international clients in foreign currencies, exchange rate volatility can wipe out your net margin. Here is how to apply conservative FX haircuts to your forward runway.',
    date: 'Sep 20, 2026',
    category: 'Cross-Border',
    readingTime: '6 min read',
    url: '#',
    isExternal: false,
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['fx', 'international', 'hedging'],
  },
];

/**
 * Fetches live real freelance business & finance articles from the public, free Dev.to API.
 * Free endpoint: https://dev.to/api/articles?tag=freelance&per_page=9
 * Requires NO API key, completely public and open.
 */
export async function fetchLiveFreelanceArticles(): Promise<BlogPost[]> {
  try {
    const res = await fetch('https://dev.to/api/articles?tag=freelance&per_page=9', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      return CORNERSTONE_POSTS;
    }

    const data = await res.json();
    if (!Array.isArray(data)) return CORNERSTONE_POSTS;

    const livePosts: BlogPost[] = (data as DevToArticleItem[]).map((item) => ({
      id: `devto-${item.id}`,
      title: item.title,
      description: item.description || item.title,
      date: item.readable_publish_date || 'Recently Published',
      category: item.tag_list?.[0] ? capitalize(item.tag_list[0]) : 'Freelancing',
      readingTime: `${item.reading_time_minutes || 4} min read`,
      url: item.url,
      isExternal: true,
      coverImage: item.cover_image || item.social_image || undefined,
      author: {
        name: item.user?.name || 'Independent Author',
        avatar: item.user?.profile_image,
      },
      tags: item.tag_list || ['freelance', 'business'],
    }));

    return [...CORNERSTONE_POSTS, ...livePosts];
  } catch (err) {
    console.warn('Unable to load live articles from Dev.to API, using cornerstone guides fallback:', err);
    return CORNERSTONE_POSTS;
  }
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
