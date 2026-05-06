import { query } from '../db';
import { slugify } from '../utils/slugify';

export interface CreateBlogPayload {
  title: string;
  content: string;
  image_url?: string;
  slug?: string;
}

export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  image_url?: string;
  slug?: string;
}

export interface BlogAdminResponse {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  slug?: string;
  created_at?: string;
}

export interface RequestsResponse {
  id: number;
  name: string;
  institutions: string;
  email: string;
  phone: string;
  request: string;
  created_at?: string;
}

export interface AdminUserResponse {
  id: number;
  username: string;
  created_at?: string;
}

export async function getAdminRequests(): Promise<RequestsResponse[]> {
  const result = await query('SELECT * FROM analysisrequests ORDER BY created_at DESC');
  return result.rows;
}

export async function createAdminBlog(payload: CreateBlogPayload): Promise<BlogAdminResponse> {
  const { title, content, image_url } = payload;

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  const slug = slugify(title);

  const result = await query(
    'INSERT INTO blogs (title, content, image_url, slug) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, content, image_url, slug]
  );

  return result.rows[0];
}

export async function getAdminBlogs(): Promise<BlogAdminResponse[]> {
  const result = await query('SELECT * FROM blogs ORDER BY created_at DESC');
  return result.rows;
}

export async function updateAdminBlog(id: string | number, payload: UpdateBlogPayload): Promise<BlogAdminResponse> {
  const { title, content, image_url } = payload;

  let slug = undefined;
  if (title) {
    slug = slugify(title);
  }

  const result = await query(
    'UPDATE blogs SET title = COALESCE($1, title), content = COALESCE($2, content), image_url = COALESCE($3, image_url), slug = COALESCE($4, slug) WHERE id = $5 RETURNING *',
    [title, content, image_url, slug, id]
  );

  if (result.rows.length === 0) {
    throw new Error('Blog not found');
  }

  return result.rows[0];
}

export async function deleteAdminBlog(id: string | number): Promise<void> {
  const result = await query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    throw new Error('Blog not found');
  }
}

export async function getAdmins(): Promise<AdminUserResponse[]> {
  const result = await query('SELECT id, username, created_at FROM admins ORDER BY created_at DESC');
  return result.rows;
}

export async function deleteAdmin(id: string | number, currentUserId: number): Promise<void> {
  if (parseInt(String(id)) === currentUserId) {
    throw new Error('Cannot delete yourself');
  }

  const result = await query('DELETE FROM admins WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    throw new Error('Admin not found');
  }
}
