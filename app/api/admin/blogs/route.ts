import { NextRequest, NextResponse } from 'next/server';
import { getAdminBlogs, createAdminBlog } from '@/lib/services/admin';
import { verifyAdmin } from '@/lib/middleware/verifyAdmin';

export async function GET(request: NextRequest) {
  const { response: authResponse } = await verifyAdmin(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const blogs = await getAdminBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs for admin:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { response: authResponse } = await verifyAdmin(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const body = await request.json();
    const result = await createAdminBlog(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create blog';

    if (message === 'Title and content are required') {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
