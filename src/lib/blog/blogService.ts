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
  try {
    const res = await fetch('https://dev.to/api/articles?tag=freelance&per_page=30');
    if (!res.ok) {
      return CORNERSTONE_POSTS;
    }
    const data = await res.json();
    const livePosts: BlogPost[] = data.map((item: any) => ({
      id: item.id.toString(),
      slug: item.slug,
      title: item.title,
      description: item.description || item.title,
      date: new Date(item.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      category: 'Community',
      readingTime: `${item.reading_time_minutes || 5} min read`,
      url: item.url,
      isExternal: true,
      coverImage: item.cover_image || item.social_image || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80',
      author: {
        name: item.user?.name || 'Community Member',
        avatar: item.user?.profile_image_90 || '',
      },
      tags: item.tag_list || [],
    }));
    
    return [...CORNERSTONE_POSTS, ...livePosts];
  } catch (error) {
    console.error('Error fetching live articles:', error);
    return CORNERSTONE_POSTS;
  }
}

