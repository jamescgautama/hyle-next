import { NextRequest, NextResponse } from 'next/server';
import { getBlogById } from '@/lib/services/blog';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const blog = await getBlogById(id);
    return NextResponse.json(blog);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog';
    
    if (message === 'Blog not found') {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}
