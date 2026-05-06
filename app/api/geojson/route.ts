import { NextRequest, NextResponse } from 'next/server';
import { getGeoJson } from '@/lib/services/environmental';

export async function GET(request: NextRequest) {
  try {
    const data = getGeoJson();
    return NextResponse.json(data);
  } catch (error) {
    console.error('getGeoJson error:', error);
    return NextResponse.json({ error: 'Failed to load geojson data' }, { status: 500 });
  }
}
