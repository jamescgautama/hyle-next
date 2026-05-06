import { NextRequest, NextResponse } from 'next/server';
import { registerAdmin } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await registerAdmin(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to register';

    if (message === 'Username and password required') {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (message === 'Username already exists') {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
