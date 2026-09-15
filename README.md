# Portfolio — Jonathan Quintero

Portafolio bilingüe (ES/EN) con panel de administración.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · Node.js · Express 5 · PostgreSQL · Drizzle ORM · Vitest

## Estructura

```
apps/
  web/   React + Vite — sitio público (/en, /es) y panel (/admin)
  api/   Express — proyectos, contacto, auth JWT, traducción con DeepL
api/     Entrada serverless para Vercel (usa apps/api compilada)
```

## Qué hace la API

| Ruta | |
|---|---|
| `GET /api/projects` | Proyectos publicados, en orden |
| `POST /api/contact` | Guarda el mensaje y avisa por correo (Resend). Límite de envíos + campo trampa anti-bots |
| `POST /api/auth/login` | Login del admin → JWT |
| `/api/admin/projects` | CRUD de proyectos. Lo que falte en inglés se traduce con DeepL al guardar |
| `/api/admin/messages` | Bandeja de mensajes |

La traducción se hace **al guardar** desde el panel, no cuando alguien visita: el sitio no espera ni gasta API.

## Desarrollo local

```bash
npm install
npm run db:seed -w apps/api   # 3 proyectos de ejemplo
npm run dev                   # API :4000 + web :5173
npm test                      # tests de la API
```

Sin `DATABASE_URL`, la API usa PGlite (Postgres embebido en `apps/api/.pglite/`). Las variables están documentadas en `apps/api/.env.example`.

## Deploy (Vercel)

Un solo proyecto de Vercel sirve la web y la API en el mismo dominio (`vercel.json`). El build compila la API, aplica las migraciones si hay `DATABASE_URL` y compila la web.
