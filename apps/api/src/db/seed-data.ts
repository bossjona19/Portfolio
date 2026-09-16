import type { NewProject } from './schema.js';

// Contenido inicial, sacado de los README de cada repo. Una vez que un proyecto se edita
// desde /admin, el deploy deja de pisarlo (ver seed.ts).
export const seedProjects: NewProject[] = [
  {
    slug: 'sistema-adopcion',
    position: 1,
    featured: true,
    titleEs: 'Sistema de gestión de adopciones',
    titleEn: 'Adoption management system',
    summaryEs:
      'Plataforma para una ONG que gestiona niños, familias solicitantes y expedientes de adopción de principio a fin, con roles, auditoría y reportes PDF.',
    summaryEn:
      'Platform for an NGO to manage children, applicant families and adoption case files end to end, with roles, audit logs and PDF reports.',
    detailsEs: `Empezó como un CRUD universitario (UTP) y lo llevé a prácticas de software profesional.

• Roles y permisos (admin, coordinador, trabajador social, director) aplicados en la base de datos con Row Level Security, no solo en la interfaz.
• Cada trabajador social ve únicamente sus casos, sus notas y sus documentos.
• Expediente por caso con documentos en almacenamiento privado, seguimiento post-adopción e historial completo.
• Bitácora de auditoría con el antes y el después de cada cambio.
• Dashboard con indicadores, reportes PDF institucionales y exportación a CSV, PDF y Excel.
• PWA instalable, CI en GitHub Actions y política de seguridad de contenido (CSP).`,
    detailsEn: `It started as a university CRUD project (UTP) and I took it to professional software practices.

• Roles and permissions (admin, coordinator, social worker, director) enforced in the database with Row Level Security, not just in the UI.
• Each social worker only sees their own cases, notes and documents.
• Per-case file with documents in private storage, post-adoption follow-up and a full history timeline.
• Audit log recording the before and after of every change.
• Dashboard with KPIs, institutional PDF reports and CSV, PDF and Excel export.
• Installable PWA, CI on GitHub Actions and a Content Security Policy.`,
    imageUrl: '/img/projects/sistema-adopcion.webp',
    diagramUrl: '/img/projects/sistema-adopcion-diagrama.webp',
    repoUrl: 'https://github.com/bossjona19/Sistema-de-adopcion',
    liveUrl: 'https://sistema-de-adopcion-ochre.vercel.app',
    tech: ['JavaScript', 'Supabase', 'PostgreSQL', 'Row Level Security', 'PWA', 'Chart.js', 'Vercel'],
  },
  {
    slug: 'scraper-b2b',
    position: 2,
    featured: true,
    titleEs: 'Buscador de clientes B2B',
    titleEn: 'B2B lead finder',
    summaryEs:
      'Le dices qué producto quieres vender y encuentra negocios que lo comprarían, saca su contacto público, los ordena por encaje y redacta un primer correo que una persona aprueba antes de enviar.',
    summaryEn:
      'Tell it what you sell and it finds businesses likely to buy it, pulls their public contact info, ranks them by fit and drafts a first email that a human approves before sending.',
    detailsEs: `Herramienta interna de prospección para CodeFlow.

• Busca negocios con Google Places y puntúa cada uno según señales de encaje.
• Usa la API de Claude para redactar el primer contacto de cada negocio.
• Panel web para revisar, editar y aprobar cada borrador: nada se envía sin una persona.
• Respeta el opt-out por dominio y solo marca como enviables los correos verificados.
• 179 comprobaciones automáticas, que validan contra la base real que las restricciones funcionan.`,
    detailsEn: `Internal prospecting tool built for CodeFlow.

• Finds businesses through Google Places and scores each one on fit signals.
• Uses the Claude API to draft the first outreach for every business.
• Web dashboard to review, edit and approve each draft: nothing is sent without a human.
• Honors per-domain opt-out and only marks verified emails as sendable.
• 179 automated checks that verify against the real database that constraints actually hold.`,
    imageUrl: '/img/projects/scraper-b2b.webp',
    diagramUrl: '/img/projects/scraper-b2b-diagrama.webp',
    repoUrl: 'https://github.com/TrabajoJonathan/Scraper-B2B',
    liveUrl: null,
    tech: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Supabase', 'Claude API', 'Google Places API'],
  },
  {
    slug: 'pagina-web',
    position: 3,
    featured: false,
    titleEs: 'Eternal Beauty Studio: reservas para salón de belleza',
    titleEn: 'Eternal Beauty Studio: beauty salon bookings',
    summaryEs:
      'Sitio de reservas para salones de belleza: el cliente elige servicio, fecha y hora, y la reserva llega lista por WhatsApp. MVP validado con usuarios reales.',
    summaryEn:
      'Booking site for beauty salons: clients pick a service, date and time, and the booking arrives ready on WhatsApp. MVP validated with real users.',
    detailsEs: `Sitio para clientes más panel de administración para el salón.

• Formulario de reserva que guarda la cita en Firestore y abre WhatsApp con el resumen listo para enviar.
• Panel con indicadores (total, pendientes, confirmadas, completadas), filtros y búsqueda.
• Confirmar, cancelar o completar citas, y contactar al cliente por WhatsApp con un clic.
• Reglas de Firestore: el público solo puede crear reservas; leerlas o editarlas exige sesión.
• Integración con Google Calendar y diseño responsive pensado para el celular.`,
    detailsEn: `Customer-facing site plus an admin panel for the salon.

• Booking form that stores the appointment in Firestore and opens WhatsApp with a ready-to-send summary.
• Dashboard with KPIs (total, pending, confirmed, completed), filters and search.
• Confirm, cancel or complete appointments, and message the client on WhatsApp in one click.
• Firestore rules: the public can only create bookings; reading or editing them requires a session.
• Google Calendar integration and a responsive, mobile-first design.`,
    imageUrl: '/img/projects/salon-belleza.webp',
    diagramUrl: '/img/projects/salon-belleza-diagrama.webp',
    repoUrl: 'https://github.com/bossjona19/Pagina-web-de-salon-de-belleza',
    liveUrl: 'https://pagina-web-de-salon-de-belleza.vercel.app',
    tech: ['JavaScript', 'HTML', 'CSS', 'Firebase', 'Firestore', 'Google Calendar API', 'Vercel'],
  },
];
