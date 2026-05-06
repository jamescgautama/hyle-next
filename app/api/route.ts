import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hyle Backend Running (Next.js migrated)' });
}
