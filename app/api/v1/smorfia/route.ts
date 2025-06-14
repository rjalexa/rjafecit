import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    // Construct the full path to the JSON file
    const jsonDirectory = path.join(process.cwd(), 'data');
    const filePath = path.join(jsonDirectory, 'smorfia_napoletana.json');

    // Read the file from the filesystem
    const fileContents = await fs.readFile(filePath, 'utf8');

    // Parse the JSON data
    const data = JSON.parse(fileContents);

    // Extract the "numbers" key, or return an empty array if it doesn't exist
    const numbers = data.numbers || [];

    // Return the data as a JSON response
    return NextResponse.json(numbers);
  } catch (error) {
    console.error('Failed to read or parse smorfia data:', error);
    // Return an error response if something goes wrong
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
