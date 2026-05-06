import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await loginAdmin(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';

    if (message === 'Invalid credentials') {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
