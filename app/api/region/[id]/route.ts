import { NextRequest, NextResponse } from 'next/server';
import { getRegionById } from '@/lib/services/environmental';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const region = getRegionById(decodedId);
    
    if (!region) {
      return NextResponse.json({ error: 'Region not found' }, { status: 404 });
    }
    
    return NextResponse.json(region);
  } catch (error) {
    console.error('getRegionById error:', error);
    return NextResponse.json({ error: 'Failed to load region data' }, { status: 500 });
  }
}
