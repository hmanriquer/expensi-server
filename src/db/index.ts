import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { seed } from 'drizzle-seed';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

async function main() {
  await seed(db, schema);
}

main();
