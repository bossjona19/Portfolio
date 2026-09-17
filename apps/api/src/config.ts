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

// Los valores pegados en Vercel a veces traen espacios, saltos de línea o comillas alrededor.
const clean = (v: string | undefined) => v?.trim().replace(/^(["'])(.*)\1$/, '$2').trim();
const env = Object.fromEntries(Object.entries(process.env).map(([k, v]) => [k, clean(v)]));

const parsed = schema.safeParse(env);
if (!parsed.success) {
  // Para diagnosticar sin exponer secretos: solo el largo y los caracteres raros de cada campo inválido.
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0]);
    const raw = process.env[key] ?? '';
    const odd = [...raw].filter((c) => !/[\w@.+-]/.test(c)).map((c) => `U+${c.codePointAt(0)!.toString(16).padStart(4, '0')}`);
    console.error(`Variable inválida ${key}: ${issue.message} (largo ${raw.length}, caracteres raros: ${odd.join(' ') || 'ninguno'})`);
  }
  throw new Error('Configuración inválida');
}
export const config: Config = parsed.data;

export const allowedOrigins = config.WEB_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
