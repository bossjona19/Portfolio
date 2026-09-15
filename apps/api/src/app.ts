import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { allowedOrigins } from './config.js';
import { HttpError } from './lib/http-error.js';
import { adminRouter } from './routes/admin.js';
import { authRouter } from './routes/auth.js';
import { contactRouter } from './routes/contact.js';
import { projectsRouter } from './routes/projects.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/api/projects', projectsRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    if (err?.type === 'entity.parse.failed') {
      res.status(400).json({ error: 'JSON inválido' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  };
  app.use(onError);

  return app;
}
