import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { config } from '../config.js';
import { HttpError } from '../lib/http-error.js';
import { signToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export const authRouter = Router();

authRouter.post(
  '/login',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false }),
  validateBody(loginSchema),
  async (req, res) => {
    const { email, password } = req.body as z.infer<typeof loginSchema>;
    if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD_HASH) {
      throw new HttpError(503, 'Admin no configurado');
    }
    const emailOk = email === config.ADMIN_EMAIL.toLowerCase();
    // Se compara siempre para no delatar por tiempo si el correo existe.
    const passwordOk = await bcrypt.compare(password, config.ADMIN_PASSWORD_HASH);
    if (!emailOk || !passwordOk) throw new HttpError(401, 'Credenciales incorrectas');
    res.json({ token: signToken(email) });
  },
);
