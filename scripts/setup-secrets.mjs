// Configura las variables secretas del portafolio en Vercel sin que pasen por nadie más.
// Uso (en tu propia terminal, desde la carpeta Portfolio):  npm run setup:secrets
//
// Pide: correo del admin, contraseña, llave de DeepL y llave de Resend (las dos opcionales).
// Genera: JWT_SECRET aleatorio y ADMIN_PASSWORD_HASH (bcrypt). La contraseña en claro no se guarda.
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';
import bcrypt from 'bcryptjs';

const PROJECT = 'jonathan-quintero-portfolio';
const SCOPE = 'jonathan-quintero-s-projects';
const DEFAULT_EMAIL = 'quinterojonathan108@gmail.com';

const vercel = (args, input) =>
  spawnSync('npx', ['--yes', 'vercel@latest', ...args], {
    input,
    stdio: input === undefined ? 'inherit' : ['pipe', 'inherit', 'inherit'],
    shell: process.platform === 'win32',
    encoding: 'utf8',
  });

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // Oculta lo que se escribe (muestra * por cada carácter).
      rl._writeToOutput = (s) => rl.output.write(s.startsWith(question) ? question : '*');
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer.trim());
    });
  });
}

console.log('\n== 1/3 Sesión de Vercel ==');
if (vercel(['whoami', '--scope', SCOPE]).status !== 0) {
  console.log('Hay que iniciar sesión en Vercel (se abre el navegador).');
  if (vercel(['login']).status !== 0) process.exit(1);
}
if (vercel(['link', '--yes', '--project', PROJECT, '--scope', SCOPE]).status !== 0) process.exit(1);

console.log('\n== 2/3 Datos ==');
const email = (await ask(`Correo para entrar a /admin [${DEFAULT_EMAIL}]: `)) || DEFAULT_EMAIL;
let password = '';
for (;;) {
  password = await ask('Contraseña del admin (mínimo 12 caracteres): ', { hidden: true });
  const again = await ask('Repítela: ', { hidden: true });
  if (password.length < 12) console.log('  Muy corta, prueba otra.');
  else if (password !== again) console.log('  No coinciden, otra vez.');
  else break;
}
const deepl = await ask('Llave de DeepL (Enter para saltar): ', { hidden: true });
const resend = await ask('Llave de Resend (Enter para saltar): ', { hidden: true });
const contactTo = resend
  ? (await ask(`Correo donde recibir los mensajes — debe ser el de tu cuenta de Resend [${email}]: `)) || email
  : '';

const vars = {
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD_HASH: await bcrypt.hash(password, 12),
  JWT_SECRET: randomBytes(48).toString('hex'),
  ...(deepl && { DEEPL_API_KEY: deepl }),
  ...(resend && { RESEND_API_KEY: resend, CONTACT_TO_EMAIL: contactTo }),
};

console.log('\n== 3/3 Guardando en Vercel (production) ==');
let failed = false;
for (const [name, value] of Object.entries(vars)) {
  vercel(['env', 'rm', name, 'production', '--yes', '--scope', SCOPE], ''); // por si ya existía
  const res = vercel(['env', 'add', name, 'production', '--sensitive', '--scope', SCOPE], value);
  console.log(`${res.status === 0 ? '✓' : '✗'} ${name}`);
  failed ||= res.status !== 0;
}

console.log(
  failed
    ? '\nAlgunas variables fallaron (mira los mensajes de arriba).'
    : '\nListo. Avísale a Claude para que redespliegue y lo pruebe.',
);
process.exit(failed ? 1 : 0);
