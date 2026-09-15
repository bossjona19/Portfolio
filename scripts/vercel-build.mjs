// Build en Vercel: compila la API, prepara la base si está configurada y compila la web.
import { execSync } from 'node:child_process';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

run('npm run build -w apps/api');
if (process.env.DATABASE_URL) {
  // seed.js aplica las migraciones y siembra solo si la tabla de proyectos está vacía.
  run('node apps/api/dist/db/seed.js');
} else {
  console.warn('⚠ DATABASE_URL no está definida: se omiten las migraciones.');
}
run('npm run build -w apps/web');
