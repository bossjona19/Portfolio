import { getDb, migrateDb } from './client.js';
import { projects } from './schema.js';
import { seedProjects } from './seed-data.js';

await migrateDb();
const db = await getDb();
await db.insert(projects).values(seedProjects).onConflictDoNothing({ target: projects.slug });
console.log(`Semilla aplicada (${seedProjects.length} proyectos; los que ya existían no se tocan).`);
process.exit(0);
