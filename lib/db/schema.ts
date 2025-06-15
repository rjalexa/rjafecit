import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const smorfia = sqliteTable('smorfia', {
  number: integer('number').primaryKey(),
  meaning: text('meaning').notNull(),
});
