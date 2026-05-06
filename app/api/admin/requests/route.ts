import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequests } from '@/lib/services/admin';
import { verifyAdmin } from '@/lib/middleware/verifyAdmin';

export async function GET(request: NextRequest) {
  const { response: authResponse } = await verifyAdmin(request);
  if (authResponse) {
    return authResponse;
  }

  try {
    const requests = await getAdminRequests();
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
