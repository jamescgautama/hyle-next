import { NextRequest, NextResponse } from 'next/server';
import { getAdmins } from '@/lib/services/admin';
import { verifyAdmin } from '@/lib/middleware/verifyAdmin';

export async function GET(request: NextRequest) {
  const { response: authResponse } = await verifyAdmin(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const admins = await getAdmins();
    return NextResponse.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}
