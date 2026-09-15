import bcrypt from 'bcryptjs';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

// Config de prueba antes de importar la app (config se lee al cargar el módulo).
process.env.NODE_ENV = 'test';
delete process.env.DATABASE_URL;
process.env.JWT_SECRET = 'x'.repeat(40);
process.env.ADMIN_EMAIL = 'admin@example.com';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('correct-horse-battery', 4);

const { createApp } = await import('./app.js');
const { getDb } = await import('./db/client.js');
const { projects } = await import('./db/schema.js');
const { seedProjects } = await import('./db/seed-data.js');

const app = createApp();

async function login() {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'correct-horse-battery' });
  return res.body.token as string;
}

beforeAll(async () => {
  const db = await getDb();
  await db.insert(projects).values(seedProjects);
});

describe('público', () => {
  it('lista los proyectos publicados en orden', async () => {
    const res = await request(app).get('/api/projects').expect(200);
    expect(res.body.map((p: { slug: string }) => p.slug)).toEqual([
      'sistema-adopcion',
      'scraper-b2b',
      'pagina-web',
    ]);
    // Protege contra texto mal codificado ("adopciÃ³n").
    expect(res.body[0].titleEs).toBe('Sistema de gestión de adopciones');
    expect(JSON.stringify(res.body)).not.toMatch(/Ã|Â/);
  });

  it('devuelve 404 para un slug que no existe', async () => {
    await request(app).get('/api/projects/no-existe').expect(404);
  });

  it('guarda un mensaje de contacto válido', async () => {
    await request(app)
      .post('/api/contact')
      .send({ name: 'Ana', email: 'ana@example.com', body: 'Hola, me interesa tu trabajo.', lang: 'es' })
      .expect(201);
  });

  it('rechaza contacto inválido y el campo trampa', async () => {
    await request(app).post('/api/contact').send({ name: 'A', email: 'no', body: 'x' }).expect(400);
    await request(app)
      .post('/api/contact')
      .send({ name: 'Bot', email: 'bot@example.com', body: 'Compra ahora mismo esto', website: 'spam' })
      .expect(400);
  });
});

describe('admin', () => {
  it('rechaza sin token y con contraseña incorrecta', async () => {
    await request(app).get('/api/admin/projects').expect(401);
    await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'mala' }).expect(401);
  });

  it('crea, edita y borra un proyecto', async () => {
    const token = await login();
    const auth = { Authorization: `Bearer ${token}` };
    const body = {
      slug: 'demo',
      titleEs: 'Demo',
      titleEn: 'Demo',
      summaryEs: 'Resumen',
      summaryEn: 'Summary',
      tech: ['React'],
      published: false,
    };

    const created = await request(app).post('/api/admin/projects').set(auth).send(body).expect(201);
    await request(app).post('/api/admin/projects').set(auth).send(body).expect(409);

    // No publicado: no aparece en la API pública.
    await request(app).get('/api/projects/demo').expect(404);

    await request(app)
      .put(`/api/admin/projects/${created.body.id}`)
      .set(auth)
      .send({ ...body, published: true })
      .expect(200);
    await request(app).get('/api/projects/demo').expect(200);

    await request(app).delete(`/api/admin/projects/${created.body.id}`).set(auth).expect(204);
    await request(app).get('/api/projects/demo').expect(404);
  });

  it('exige inglés si no se pide traducción automática', async () => {
    const token = await login();
    const res = await request(app)
      .post('/api/admin/projects')
      .set({ Authorization: `Bearer ${token}` })
      .send({ slug: 'sin-ingles', titleEs: 'Hola', summaryEs: 'Resumen' })
      .expect(400);
    expect(res.body.error).toMatch(/inglés/);
  });

  it('lista los mensajes recibidos', async () => {
    const token = await login();
    const res = await request(app).get('/api/admin/messages').set({ Authorization: `Bearer ${token}` }).expect(200);
    expect(res.body[0]).toMatchObject({ name: 'Ana', read: false });
  });
});
