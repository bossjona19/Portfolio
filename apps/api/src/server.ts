import { createApp } from './app.js';
import { config } from './config.js';
import { getDb } from './db/client.js';

await getDb();
createApp().listen(config.PORT, () => {
  const mode = config.DATABASE_URL ? 'Postgres' : 'PGlite local (.pglite/)';
  console.log(`API en http://localhost:${config.PORT} — base: ${mode}`);
});
