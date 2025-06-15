import { db } from '../lib/db';
import { smorfia } from '../lib/db/schema';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  console.log('Seeding database...');
  
  // Read the JSON file from the filesystem instead of importing it
  const dataPath = join(process.cwd(), 'data', 'smorfia_napoletana.json');
  const jsonData = JSON.parse(readFileSync(dataPath, 'utf-8'));
  
  // Insert all the smorfia numbers and meanings
  await db.insert(smorfia).values(jsonData.numbers);
  
  console.log(`Database seeded successfully with ${jsonData.numbers.length} entries!`);
}

main().catch(console.error);
