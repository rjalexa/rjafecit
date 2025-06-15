import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { smorfia } from '@/lib/db/schema';

export async function GET() {
  try {
    // Query all smorfia entries from the database
    const numbers = await db.select().from(smorfia).orderBy(smorfia.number);

    // Return the data as a JSON response
    return NextResponse.json(numbers);
  } catch (error) {
    console.error('Failed to fetch smorfia data from database:', error);
    // Return an error response if something goes wrong
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
