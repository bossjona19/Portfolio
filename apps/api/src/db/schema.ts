import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  position: integer('position').notNull().default(0),
  featured: boolean('featured').notNull().default(false),
  published: boolean('published').notNull().default(true),

  titleEs: text('title_es').notNull(),
  titleEn: text('title_en').notNull(),
  summaryEs: text('summary_es').notNull(),
  summaryEn: text('summary_en').notNull(),
  detailsEs: text('details_es').notNull().default(''),
  detailsEn: text('details_en').notNull().default(''),

  imageUrl: text('image_url'),
  /** Imagen explicativa (cómo funciona) que se muestra en el detalle del proyecto. */
  diagramUrl: text('diagram_url'),
  videoId: text('video_id'),
  repoUrl: text('repo_url'),
  liveUrl: text('live_url'),
  tech: text('tech').array().notNull().default([]),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  body: text('body').notNull(),
  lang: text('lang').notNull().default('es'),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Message = typeof messages.$inferSelect;
