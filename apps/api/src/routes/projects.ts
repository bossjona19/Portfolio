import { Router } from 'express';
import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '../db/client.js';
import { projects } from '../db/schema.js';
import { HttpError } from '../lib/http-error.js';

export const projectsRouter = Router();

projectsRouter.get('/', async (_req, res) => {
  const db = await getDb();
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.position), asc(projects.id));
  res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
  res.json(rows);
});

projectsRouter.get('/:slug', async (req, res) => {
  const db = await getDb();
  const [row] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, req.params.slug), eq(projects.published, true)));
  if (!row) throw new HttpError(404, 'Proyecto no encontrado');
  res.json(row);
});
