import { NextRequest, NextResponse } from 'next/server';
import { deleteAdmin } from '@/lib/services/admin';
import { verifyAdmin } from '@/lib/middleware/verifyAdmin';

interface Params {
  id: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { userId, response: authResponse } = await verifyAdmin(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const { id } = await params;
    await deleteAdmin(id, userId);

    return NextResponse.json({ message: 'Admin deleted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete admin';

    if (message === 'Cannot delete yourself') {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (message === 'Admin not found') {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    console.error('Error deleting admin:', error);
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
  }
}
