import { NextRequest, NextResponse } from 'next/server';
import { updateAdminBlog, deleteAdminBlog } from '@/lib/services/admin';
import { verifyAdmin } from '@/lib/middleware/verifyAdmin';

interface Params {
  id: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { response: authResponse } = await verifyAdmin(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateAdminBlog(id, body);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update blog';

    if (message === 'Blog not found') {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { response: authResponse } = await verifyAdmin(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const { id } = await params;
    await deleteAdminBlog(id);

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete blog';

    if (message === 'Blog not found') {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
