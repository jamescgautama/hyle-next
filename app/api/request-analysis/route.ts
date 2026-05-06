import { NextRequest, NextResponse } from 'next/server';
import { submitRequest } from '@/lib/services/request';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await submitRequest(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit request';

    if (message === 'All fields are required') {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error('Error submitting request:', error);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}
