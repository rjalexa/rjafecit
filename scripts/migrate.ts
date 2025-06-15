import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from '../lib/db';

async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed successfully!');
}

main().catch(console.error);
