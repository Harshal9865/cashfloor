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
    tags: ['Runway', 'Monte Carlo', 'Risk Defense'],
  },
  {
    id: 'fx-volatility-freelance',
    title: 'Surviving FX Volatility with Foreign Clients: The 3% Defense',
    description: 'Working across borders means dealing with exchange rates and hidden intermediary wire fees. Learn how applying a 3% conservative haircut protects your runway.',
    date: 'Sep 18, 2026',
    category: 'Cross-Border',
    readingTime: '6 min read',
    url: '/blog/the-20th-percentile-math', // fallback internal anchor
    isExternal: false,
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'CashFloor Quantitative Team',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['FX Rates', 'Wise Invoicing', 'Arbitrage'],
  },
  {
    id: 'feast-or-famine-cycle',
    title: 'Breaking the Feast-or-Famine Cycle: Building a 5-Pillar Partition',
    description: 'A comprehensive playbook on structuring your business account into automated sub-reserves: Taxes, Living Baseline, Client Shock Buffer, and Growth Capital.',
    date: 'Sep 21, 2026',
    category: 'Cash Management',
    readingTime: '7 min read',
    url: '/blog/the-20th-percentile-math',
    isExternal: false,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Editorial Desk',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Cashflow', 'Tax Escrow', 'Solo Operators'],
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

    const livePosts: BlogPost[] = data.map((item: any) => ({
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

    // Return combination of our proprietary methodology + live articles
    return [...CORNERSTONE_POSTS, ...livePosts];
  } catch (error) {
    console.warn('Unable to load live articles, serving cornerstone posts:', error);
    return CORNERSTONE_POSTS;
  }
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
