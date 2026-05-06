import { NextRequest, NextResponse } from 'next/server';
import { getBlogs } from '@/lib/services/blog';

export async function GET(request: NextRequest) {
  try {
    const blogs = await getBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
