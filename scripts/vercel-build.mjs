// Build en Vercel: compila la API, aplica migraciones si hay base configurada y compila la web.
import { execSync } from 'node:child_process';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

run('npm run build -w apps/api');
if (process.env.DATABASE_URL) {
  run('node apps/api/dist/db/migrate.js');
} else {
  console.warn('⚠ DATABASE_URL no está definida: se omiten las migraciones.');
}
run('npm run build -w apps/web');
