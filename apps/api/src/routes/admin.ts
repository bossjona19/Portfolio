import { Router } from 'express';
import { asc, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '../db/client.js';
import { messages, projects } from '../db/schema.js';
import { HttpError } from '../lib/http-error.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { translate } from '../services/translate.js';

const optionalUrl = z.string().trim().url().nullable().optional().or(z.literal('').transform(() => null));
/** URL absoluta o ruta del propio sitio (/img/...). */
const optionalImage = z
  .string()
  .trim()
  .refine((v) => /^\/[^/]/.test(v) || URL.canParse(v), 'URL o ruta que empiece con /')
  .nullable()
  .optional()
  .or(z.literal('').transform(() => null));

export const projectInput = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug: minúsculas, números y guiones'),
  position: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  titleEs: z.string().trim().min(1).max(120),
  titleEn: z.string().trim().max(120).default(''),
  summaryEs: z.string().trim().min(1).max(400),
  summaryEn: z.string().trim().max(400).default(''),
  detailsEs: z.string().trim().max(5000).default(''),
  detailsEn: z.string().trim().max(5000).default(''),
  imageUrl: optionalImage,
  videoId: z.string().trim().max(20).nullable().optional(),
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  tech: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  /** Si viene en true, los campos en inglés vacíos se completan con DeepL. */
  autoTranslate: z.boolean().default(false),
});

type ProjectInput = z.infer<typeof projectInput>;

async function fillEnglish(input: ProjectInput) {
  const { autoTranslate, ...data } = input;
  const pairs = [
    ['titleEs', 'titleEn'],
    ['summaryEs', 'summaryEn'],
    ['detailsEs', 'detailsEn'],
  ] as const;
  const missing = pairs.filter(([es, en]) => data[es] !== '' && data[en] === '');
  if (autoTranslate && missing.length > 0) {
    const out = await translate(missing.map(([es]) => data[es]), 'es', 'en');
    missing.forEach(([, en], i) => (data[en] = out[i]!));
  }
  if (data.titleEn === '' || data.summaryEn === '') {
    throw new HttpError(400, 'Falta el título o el resumen en inglés (escríbelo o activa la traducción automática)');
  }
  return data;
}

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'id inválido');
  return id;
}

export const adminRouter = Router();
adminRouter.use(requireAdmin);

adminRouter.get('/projects', async (_req, res) => {
  const db = await getDb();
  res.json(await db.select().from(projects).orderBy(asc(projects.position), asc(projects.id)));
});

adminRouter.post('/projects', validateBody(projectInput), async (req, res) => {
  const data = await fillEnglish(req.body as ProjectInput);
  const db = await getDb();
  const existing = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, data.slug));
  if (existing.length > 0) throw new HttpError(409, 'Ya existe un proyecto con ese slug');
  const [row] = await db.insert(projects).values(data).returning();
  res.status(201).json(row);
});

adminRouter.put('/projects/:id', validateBody(projectInput), async (req, res) => {
  const id = parseId(req.params.id as string);
  const data = await fillEnglish(req.body as ProjectInput);
  const db = await getDb();
  const [row] = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  if (!row) throw new HttpError(404, 'Proyecto no encontrado');
  res.json(row);
});

adminRouter.delete('/projects/:id', async (req, res) => {
  const id = parseId(req.params.id as string);
  const db = await getDb();
  const [row] = await db.delete(projects).where(eq(projects.id, id)).returning({ id: projects.id });
  if (!row) throw new HttpError(404, 'Proyecto no encontrado');
  res.status(204).end();
});

adminRouter.post(
  '/translate',
  validateBody(
    z.object({
      texts: z.array(z.string().max(5000)).min(1).max(10),
      from: z.enum(['es', 'en']).default('es'),
      to: z.enum(['es', 'en']).default('en'),
    }),
  ),
  async (req, res) => {
    const { texts, from, to } = req.body as { texts: string[]; from: 'es' | 'en'; to: 'es' | 'en' };
    res.json({ texts: await translate(texts, from, to) });
  },
);

adminRouter.get('/messages', async (_req, res) => {
  const db = await getDb();
  res.json(await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(200));
});

adminRouter.patch('/messages/:id', validateBody(z.object({ read: z.boolean() })), async (req, res) => {
  const id = parseId(req.params.id as string);
  const db = await getDb();
  const [row] = await db
    .update(messages)
    .set({ read: (req.body as { read: boolean }).read })
    .where(eq(messages.id, id))
    .returning();
  if (!row) throw new HttpError(404, 'Mensaje no encontrado');
  res.json(row);
});
