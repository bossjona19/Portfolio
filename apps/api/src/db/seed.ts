import { and, count, eq } from 'drizzle-orm';
import { getDb, migrateDb } from './client.js';
import { projects } from './schema.js';
import { seedProjects } from './seed-data.js';

/**
 * - Base vacía: inserta los proyectos semilla.
 * - Base con datos: actualiza los proyectos semilla que nunca se editaron desde /admin
 *   (updated_at = created_at). Lo editado o borrado desde el panel no se toca.
 */
await migrateDb();
const db = await getDb();
const [{ total }] = (await db.select({ total: count() }).from(projects)) as [{ total: number }];

if (total === 0) {
  await db.insert(projects).values(seedProjects);
  console.log(`Semilla aplicada (${seedProjects.length} proyectos).`);
} else {
  let updated = 0;
  for (const { slug, ...data } of seedProjects) {
    const rows = await db
      .update(projects)
      .set(data)
      .where(and(eq(projects.slug, slug!), eq(projects.updatedAt, projects.createdAt)))
      .returning({ id: projects.id });
    updated += rows.length;
  }
  console.log(`Proyectos semilla sin editar actualizados: ${updated}. Los editados en /admin no se tocan.`);
}
process.exit(0);
