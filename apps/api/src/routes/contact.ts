import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { getDb } from '../db/client.js';
import { messages } from '../db/schema.js';
import { validateBody } from '../middleware/validate.js';
import { notifyNewMessage } from '../services/mailer.js';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  body: z.string().trim().min(10).max(3000),
  lang: z.enum(['es', 'en']).default('es'),
  // Campo trampa: invisible para personas, los bots lo llenan.
  website: z.string().max(0).optional().or(z.literal('')),
});

export const contactRouter = Router();

contactRouter.post(
  '/',
  rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false }),
  validateBody(contactSchema),
  async (req, res) => {
    const { name, email, body, lang } = req.body as z.infer<typeof contactSchema>;
    const db = await getDb();
    const [msg] = await db.insert(messages).values({ name, email, body, lang }).returning();
    await notifyNewMessage(msg!);
    res.status(201).json({ ok: true });
  },
);
