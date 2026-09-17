// Datos personales y de medios. Cambia aquí, no en los componentes.
export const site = {
  name: 'Jonathan Quintero',
  role: 'Full-stack Developer',
  initials: 'JQ',
  /** Foto en apps/web/public/img/. null muestra las iniciales. */
  photo: '/img/jonathan.webp' as string | null,
  github: 'https://github.com/bossjona19',
  email: 'quinterojonathan108@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jonathan-quintero-8aa96026b' as string | null,
  upwork: 'https://www.upwork.com/freelancers/~01cb5ac7aee84b011e' as string | null,
  /** IDs de YouTube (lo que va después de watch?v=). null muestra "en preparación". */
  videos: {
    intro: '00mCCqaAx4M' as string | null,
    projects: null as string | null,
  },
  skills: [
    'React',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Express',
    'PostgreSQL',
    'REST APIs',
    'Tailwind CSS',
    'Git',
    'Web scraping',
  ],
};
