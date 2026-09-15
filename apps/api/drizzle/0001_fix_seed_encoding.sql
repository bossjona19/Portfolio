-- Repara los proyectos semilla que se guardaron con tildes mal codificadas ("adopciÃ³n" → "adopción").
-- Solo toca los tres slugs de la semilla y solo si el campo todavía muestra el problema.
UPDATE "projects" SET "title_es" = 'Sistema de adopción' WHERE "slug" = 'sistema-adopcion' AND "title_es" LIKE '%Ã%';
--> statement-breakpoint
UPDATE "projects" SET "summary_es" = 'Plataforma para publicar animales en adopción, recibir solicitudes y darles seguimiento hasta que encuentran hogar.' WHERE "slug" = 'sistema-adopcion' AND "summary_es" LIKE '%Ã%';
--> statement-breakpoint
UPDATE "projects" SET "summary_es" = 'Le dices qué producto quieres vender y encuentra negocios que lo comprarían, saca su contacto público, los ordena por encaje y redacta un primer correo que una persona aprueba antes de enviar.' WHERE "slug" = 'scraper-b2b' AND "summary_es" LIKE '%Ã%';
--> statement-breakpoint
UPDATE "projects" SET "details_es" = 'Busca negocios con Google Places, puntúa cada uno según señales de encaje y usa Claude para escribir el primer contacto. Tiene panel web para revisar y aprobar cada borrador.' WHERE "slug" = 'scraper-b2b' AND "details_es" LIKE '%Ã%';
--> statement-breakpoint
UPDATE "projects" SET "title_es" = 'Página web' WHERE "slug" = 'pagina-web' AND "title_es" LIKE '%Ã%';
--> statement-breakpoint
UPDATE "projects" SET "summary_es" = 'Sitio web responsive, pensado para cargar rápido y verse bien en el celular.' WHERE "slug" = 'pagina-web' AND "summary_es" LIKE '%Ã%';
