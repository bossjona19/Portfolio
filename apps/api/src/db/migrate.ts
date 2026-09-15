import { migrateDb } from './client.js';

await migrateDb();
console.log('Migraciones aplicadas.');
process.exit(0);
