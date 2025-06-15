import { NextResponse } from 'next/server';

// GET handler for the /api/v1/random route
export async function GET() {
  try {
    // Determine the backend URL from environment or default to localhost
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:8080';

    // Forward the request to the FastAPI service, disabling cache
    const response = await fetch(`${backendUrl}/api/v1/random`, {
      cache: 'no-store'
    });
    
    // If the backend returns an error status, throw to be caught below
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    // Parse the JSON payload from FastAPI
    const data = await response.json();
    
    // Create a NextResponse object wrapping the JSON data
    const nextResponse = NextResponse.json(data);

    // Set response headers to disable caching at all levels
    nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');
    
    // Return the response to the client
    return nextResponse;
  } catch (error) {
    // Log any errors encountered while fetching or processing
    console.error('Failed to fetch from backend:', error);
    // Return a generic 500 response on failure
    return new NextResponse('Failed to fetch random numbers', { status: 500 });
  }
}

