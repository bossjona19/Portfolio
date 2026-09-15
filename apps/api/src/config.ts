import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),

  // Sin DATABASE_URL la API usa PGlite (Postgres embebido) — solo para desarrollo y tests.
  DATABASE_URL: z.string().url().optional(),

  // Orígenes permitidos para CORS, separados por coma.
  WEB_ORIGIN: z.string().default('http://localhost:5173'),

  JWT_SECRET: z.string().min(32).optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),

  DEEPL_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  CONTACT_FROM_EMAIL: z.string().default('Portfolio <onboarding@resend.dev>'),
});

export type Config = z.infer<typeof schema>;

export const config: Config = schema.parse(process.env);

export const allowedOrigins = config.WEB_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
