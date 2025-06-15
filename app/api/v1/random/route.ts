import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/v1/random`);
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch from backend:', error);
    return new NextResponse('Failed to fetch random numbers', { status: 500 });
  }
}
