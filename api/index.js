// Entrada serverless de Vercel: todo /api/* llega aquí (ver vercel.json).
// Importa la API ya compilada por `npm run build -w apps/api`.
import { createApp } from '../apps/api/dist/app.js';

export default createApp();
