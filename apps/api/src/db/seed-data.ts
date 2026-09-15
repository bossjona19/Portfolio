import type { NewProject } from './schema.js';

// Contenido inicial. DespuÃ©s se edita desde /admin, no aquÃ­.
// TODO(Jonathan): revisar textos, enlaces e imÃ¡genes de "adopcion" y "pagina-web".
export const seedProjects: NewProject[] = [
  {
    slug: 'sistema-adopcion',
    position: 1,
    featured: true,
    titleEs: 'Sistema de adopciÃ³n',
    titleEn: 'Adoption system',
    summaryEs:
      'Plataforma para publicar animales en adopciÃ³n, recibir solicitudes y darles seguimiento hasta que encuentran hogar.',
    summaryEn:
      'Platform to list animals for adoption, receive applications and follow them up until they find a home.',
    detailsEs: '',
    detailsEn: '',
    tech: ['React', 'Node.js', 'Express'],
  },
  {
    slug: 'scraper-b2b',
    position: 2,
    featured: true,
    titleEs: 'Buscador de clientes B2B',
    titleEn: 'B2B lead finder',
    summaryEs:
      'Le dices quÃ© producto quieres vender y encuentra negocios que lo comprarÃ­an, saca su contacto pÃºblico, los ordena por encaje y redacta un primer correo que una persona aprueba antes de enviar.',
    summaryEn:
      'Tell it what you sell and it finds businesses likely to buy it, pulls their public contact info, ranks them by fit and drafts a first email that a human approves before sending.',
    detailsEs:
      'Busca negocios con Google Places, puntÃºa cada uno segÃºn seÃ±ales de encaje y usa Claude para escribir el primer contacto. Tiene panel web para revisar y aprobar cada borrador.',
    detailsEn:
      'Finds businesses through Google Places, scores each one on fit signals and uses Claude to write the first outreach. Includes a web dashboard to review and approve every draft.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Google Places API', 'Claude API'],
  },
  {
    slug: 'pagina-web',
    position: 3,
    featured: false,
    titleEs: 'PÃ¡gina web',
    titleEn: 'Website',
    summaryEs: 'Sitio web responsive, pensado para cargar rÃ¡pido y verse bien en el celular.',
    summaryEn: 'Responsive website built to load fast and look great on mobile.',
    detailsEs: '',
    detailsEn: '',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
];
