import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestToken } from '../auth';

export async function verifyAdmin(request: NextRequest): Promise<{ userId: number; response?: NextResponse }> {
  try {
    const payload = verifyRequestToken(request);
    return { userId: payload.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    
    if (message === 'No token provided') {
      return {
        userId: 0,
        response: NextResponse.json({ error: 'No token provided' }, { status: 403 })
      };
    }

    return {
      userId: 0,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }
}
