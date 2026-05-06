import { NextRequest, NextResponse } from 'next/server';
import { getRegions } from '@/lib/services/environmental';

export async function GET(request: NextRequest) {
  try {
    const regions = getRegions();
    return NextResponse.json(regions);
  } catch (error) {
    console.error('getRegions error:', error);
    return NextResponse.json({ error: 'Failed to load regions' }, { status: 500 });
  }
}
