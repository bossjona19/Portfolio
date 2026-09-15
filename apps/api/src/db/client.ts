import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { drizzle as drizzlePg, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { config } from '../config.js';
import { HttpError } from '../lib/http-error.js';
import * as schema from './schema.js';

export type Db = NodePgDatabase<typeof schema>;

export const migrationsFolder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../drizzle');

let dbPromise: Promise<Db> | undefined;

async function connectPglite(): Promise<Db> {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const dataDir = config.NODE_ENV === 'test' ? undefined : '.pglite';
  const client = new PGlite(dataDir);
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder });
  // La API de consultas es la misma; solo cambia el driver.
  return db as unknown as Db;
}

function connectPostgres(url: string): Db {
  const pool = new pg.Pool({ connectionString: url, max: 3 });
  return drizzlePg(pool, { schema });
}

export function getDb(): Promise<Db> {
  if (!config.DATABASE_URL && process.env.VERCEL) {
    return Promise.reject(new HttpError(503, 'Base de datos no configurada (falta DATABASE_URL)'));
  }
  dbPromise ??= config.DATABASE_URL
    ? Promise.resolve(connectPostgres(config.DATABASE_URL))
    : connectPglite();
  return dbPromise;
}

export async function migrateDb(): Promise<void> {
  if (!config.DATABASE_URL) {
    await getDb();
    return;
  }
  await migratePg(await getDb(), { migrationsFolder });
}
