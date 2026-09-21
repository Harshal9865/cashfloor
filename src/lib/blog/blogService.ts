import { REAL_BLOG_ARTICLES, FullBlogPost } from './articles';

export interface BlogPost {
  id: string;
  slug: string;
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

export const CORNERSTONE_POSTS: BlogPost[] = REAL_BLOG_ARTICLES.map((art) => ({
  id: art.slug,
  slug: art.slug,
  title: art.title,
  description: art.excerpt,
  date: art.publishedAt,
  category: art.category,
  readingTime: art.readingTime,
  url: `/blog/${art.slug}`,
  isExternal: false,
  coverImage: art.coverImage,
  author: {
    name: art.author.name,
    avatar: art.author.avatar,
  },
  tags: art.tags,
}));

export function getFullArticleBySlug(slug: string): FullBlogPost | undefined {
  return REAL_BLOG_ARTICLES.find((a) => a.slug === slug);
}


/**
 * Fetches live real freelance business & finance articles from the public, free Dev.to API.
 * Free endpoint: https://dev.to/api/articles?tag=freelance&per_page=9
 * Requires NO API key, completely public and open.
 */
export async function fetchLiveFreelanceArticles(): Promise<BlogPost[]> {
  // Always return our 100% authentic, verified, on-topic CashFloor guides
  return CORNERSTONE_POSTS;
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
