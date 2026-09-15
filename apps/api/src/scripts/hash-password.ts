// Uso: npm run hash-password -w apps/api -- "tu-contraseña"
// Copia el resultado en ADMIN_PASSWORD_HASH. La contraseña en claro nunca se guarda.
import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Pasa una contraseña de al menos 12 caracteres.');
  process.exit(1);
}
console.log(await bcrypt.hash(password, 12));
