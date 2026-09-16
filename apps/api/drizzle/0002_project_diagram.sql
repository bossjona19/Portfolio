ALTER TABLE "projects" ADD COLUMN "diagram_url" text;
--> statement-breakpoint
-- Imagen explicativa de los proyectos semilla, también si ya se editaron desde /admin.
UPDATE "projects" SET "diagram_url" = '/img/projects/sistema-adopcion-diagrama.webp' WHERE "slug" = 'sistema-adopcion' AND "diagram_url" IS NULL;
--> statement-breakpoint
UPDATE "projects" SET "diagram_url" = '/img/projects/scraper-b2b-diagrama.webp' WHERE "slug" = 'scraper-b2b' AND "diagram_url" IS NULL;
--> statement-breakpoint
UPDATE "projects" SET "diagram_url" = '/img/projects/salon-belleza-diagrama.webp' WHERE "slug" = 'pagina-web' AND "diagram_url" IS NULL;
