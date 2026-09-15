import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { HttpError } from '../lib/http-error.js';

const TOKEN_TTL = '8h';

export function signToken(email: string): string {
  if (!config.JWT_SECRET) throw new HttpError(503, 'Auth no configurada (falta JWT_SECRET)');
  return jwt.sign({ sub: email, role: 'admin' }, config.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token || !config.JWT_SECRET) return next(new HttpError(401, 'No autorizado'));
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;
    if (payload.role !== 'admin') throw new Error('rol inválido');
    next();
  } catch {
    next(new HttpError(401, 'Sesión inválida o vencida'));
  }
}
