import { query } from '../db';

export interface BlogResponse {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  slug?: string;
  created_at?: string;
}

export async function getBlogs(): Promise<BlogResponse[]> {
  const result = await query('SELECT * FROM blogs ORDER BY created_at DESC');
  return result.rows;
}

export async function getBlogById(id: string | number): Promise<BlogResponse> {
  const result = await query('SELECT * FROM blogs WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    throw new Error('Blog not found');
  }
  return result.rows[0];
}

export async function getBlogBySlug(slug: string): Promise<BlogResponse> {
  const result = await query('SELECT * FROM blogs WHERE slug = $1', [slug]);
  if (result.rows.length === 0) {
    throw new Error('Blog not found');
  }
  return result.rows[0];
}
