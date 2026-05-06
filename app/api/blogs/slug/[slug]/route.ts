import { NextRequest, NextResponse } from 'next/server';
import { getBlogBySlug } from '@/lib/services/blog';

interface Params {
  slug: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    return NextResponse.json(blog);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog';
    
    if (message === 'Blog not found') {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    
    console.error('Error fetching blog by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}
