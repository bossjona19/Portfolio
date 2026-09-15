import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

/** Valida req.body contra un esquema zod y lo reemplaza por el valor parseado. */
export const validateBody =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Datos inválidos',
        issues: result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
