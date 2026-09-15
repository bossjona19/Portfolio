import { sql } from 'drizzle-orm';
import { getDb, migrateDb } from './client.js';
import { projects } from './schema.js';
import { seedProjects } from './seed-data.js';

// Solo siembra si no hay ningún proyecto: así un deploy nunca revive proyectos borrados desde /admin.
await migrateDb();
const db = await getDb();
const [{ count }] = (await db.select({ count: sql<number>`count(*)::int` }).from(projects)) as [{ count: number }];
if (count === 0) {
  await db.insert(projects).values(seedProjects);
  console.log(`Semilla aplicada (${seedProjects.length} proyectos).`);
} else {
  console.log(`La base ya tiene ${count} proyectos; no se siembra.`);
}
process.exit(0);
