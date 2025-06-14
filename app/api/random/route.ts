import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET() {
  const host = process.env.BACKEND_HOST || 'localhost';
  const port = process.env.BACKEND_PORT || '8080';
  const backendUrl = `http://${host}:${port}/api/v1/random`;

  try {
    const response = await fetch(backendUrl, { cache: 'no-store' });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from backend:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
