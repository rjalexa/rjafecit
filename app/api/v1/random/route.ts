import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/v1/random`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Create response with no-cache headers
    const nextResponse = NextResponse.json(data);
    nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');
    
    return nextResponse;
  } catch (error) {
    console.error('Failed to fetch from backend:', error);
    return new NextResponse('Failed to fetch random numbers', { status: 500 });
  }
}
