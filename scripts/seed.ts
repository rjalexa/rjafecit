import { db } from '../lib/db';
import { smorfia } from '../lib/db/schema';
import * as data from '../data/smorfia_napoletana.json';

async function main() {
  console.log('Seeding database...');
  
  // Insert all the smorfia numbers and meanings
  await db.insert(smorfia).values(data.numbers);
  
  console.log(`Database seeded successfully with ${data.numbers.length} entries!`);
}

main().catch(console.error);
