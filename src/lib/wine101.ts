import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Wine101Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  tier: number;
  topicNumber: number;
  related: string[];
  content: string;
  publishedAt: string;
}

const contentDir = path.join(process.cwd(), 'src/content/wine-101');

export function getAllWine101Articles(): Wine101Article[] {
  if (!fs.existsSync(contentDir)) return [];
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  return files
    .map(file => {
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug: data.slug || file.replace('.md', ''),
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'Wine 101',
        readTime: data.readTime || '5 min',
        tier: data.tier || 1,
        topicNumber: data.topicNumber || 0,
        related: data.related || [],
        content,
        publishedAt: data.publishedAt || '',
      } as Wine101Article;
    })
    .sort((a, b) => a.topicNumber - b.topicNumber);
}

export function getWine101Article(slug: string): Wine101Article | null {
  const articles = getAllWine101Articles();
  return articles.find(a => a.slug === slug) || null;
}

export function getRelatedArticles(slugs: string[]): Wine101Article[] {
  const articles = getAllWine101Articles();
  return slugs.map(s => articles.find(a => a.slug === s)).filter(Boolean) as Wine101Article[];
}
