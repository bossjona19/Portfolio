import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api, localized, type Project } from '../lib/api';
import { GithubIcon } from './GithubIcon';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { YouTube } from './YouTube';

type State = { status: 'loading' } | { status: 'error' } | { status: 'ok'; projects: Project[] };

export function Projects() {
  const { t } = useTranslation();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [open, setOpen] = useState<Project | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    api<Project[]>('/projects', { signal: ctrl.signal })
      .then((projects) => setState({ status: 'ok', projects }))
      .catch((e) => {
        if (!ctrl.signal.aborted) {
          console.error(e);
          setState({ status: 'error' });
        }
      });
    return () => ctrl.abort();
  }, []);

  return (
    <section id="projects" className="border-t border-line py-24">
      <div className="container-page">
        <Reveal>
          <SectionTitle index="02" title={t('projects.title')} subtitle={t('projects.subtitle')} />
        </Reveal>

        {state.status === 'loading' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label={t('projects.loading')}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl border border-line bg-panel" />
            ))}
          </div>
        )}
        {state.status === 'error' && <p className="rounded-2xl border border-line bg-panel p-6 text-muted">{t('projects.error')}</p>}
        {state.status === 'ok' && state.projects.length === 0 && <p className="text-muted">{t('projects.empty')}</p>}
        {state.status === 'ok' && state.projects.length > 0 && (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {state.projects.map((p, i) => (
              <li key={p.id} className="flex">
                <Reveal delay={i * 0.08} className="flex w-full">
                  <ProjectCard project={p} index={i} onOpen={() => setOpen(p)} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <Reveal className="mt-12">
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-gradient-to-r from-accent/10 via-panel to-panel p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-display text-xl font-semibold">{t('projects.ctaTitle')}</p>
              <p className="mt-1 text-muted">{t('projects.ctaText')}</p>
            </div>
            <a
              href="#contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-ink transition hover:brightness-110"
            >
              {t('projects.ctaButton')} <ArrowUpRight size={18} />
            </a>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>{open && <ProjectDialog project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

const GRADIENTS = [
  'from-accent/30 via-panel-2 to-panel',
  'from-accent-2/30 via-panel-2 to-panel',
  'from-fuchsia-400/25 via-panel-2 to-panel',
];

/** Portada: la imagen explicativa si existe; si no, la captura; si no, un fondo con el número. */
function Cover({ project, index, className = '' }: { project: Project; index: number; className?: string }) {
  const { i18n } = useTranslation();
  const { title } = localized(project, i18n.language);
  const src = project.diagramUrl ?? project.imageUrl;
  if (src) {
    return <img src={src} alt={title} loading="lazy" className={`object-cover ${className}`} />;
  }
  return (
    <div className={`relative grid place-items-center bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} ${className}`}>
      <div className="grid-bg absolute inset-0" aria-hidden />
      <span className="relative font-display text-6xl font-bold text-fg/15">{String(index + 1).padStart(2, '0')}</span>
    </div>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const { t, i18n } = useTranslation();
  const { title, summary } = localized(project, i18n.language);

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-panel transition duration-300 hover:-translate-y-1 hover:border-accent/40">
      <div className="relative overflow-hidden">
        <Cover
          project={project}
          index={index}
          className={`${project.diagramUrl ? 'aspect-square' : 'aspect-[16/10]'} w-full transition duration-500 group-hover:scale-[1.03]`}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        {project.featured && (
          <span className="mb-3 self-start rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
            {t('projects.featured')}
          </span>
        )}
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="mt-3 line-clamp-4 flex-1 leading-relaxed text-muted">{summary}</p>
        <TechList tech={project.tech} />
        <div className="mt-6 flex items-center gap-2 border-t border-line pt-5">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 rounded-full bg-fg/5 px-4 py-2 text-sm font-semibold transition hover:bg-accent hover:text-ink"
          >
            {t('projects.more')} <ArrowUpRight size={16} />
          </button>
          <ProjectLinks project={project} compact />
        </div>
      </div>
    </article>
  );
}

function TechList({ tech }: { tech: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-1.5">
      {tech.map((x) => (
        <li key={x} className="rounded-md bg-panel-2 px-2 py-1 font-mono text-xs text-muted">
          {x}
        </li>
      ))}
    </ul>
  );
}

function ProjectLinks({ project, compact = false }: { project: Project; compact?: boolean }) {
  const { t } = useTranslation();
  const cls = compact
    ? 'grid size-9 place-items-center rounded-full text-muted transition hover:bg-fg/5 hover:text-fg'
    : 'inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold transition hover:border-fg/40';
  return (
    <>
      {project.repoUrl && (
        <a href={project.repoUrl} target="_blank" rel="noreferrer" className={cls} aria-label={t('projects.code')}>
          <GithubIcon size={18} />
          {!compact && t('projects.code')}
        </a>
      )}
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className={cls} aria-label={t('projects.live')}>
          <ArrowUpRight size={18} />
          {!compact && t('projects.live')}
        </a>
      )}
    </>
  );
}

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const { title, summary, details } = localized(project, i18n.language);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-end bg-ink/70 backdrop-blur-sm sm:place-items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line bg-panel sm:rounded-3xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-panel/90 px-6 py-4 backdrop-blur">
          <h3 id="project-dialog-title" className="font-display text-xl font-semibold">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="grid size-9 place-items-center rounded-full text-muted hover:bg-fg/5 hover:text-fg"
            aria-label={t('projects.close')}
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-6 p-6">
          {project.videoId ? (
            <YouTube id={project.videoId} title={title} />
          ) : project.diagramUrl ? (
            <FigureLink src={project.diagramUrl} alt={`${t('projects.howItWorks')}: ${title}`} />
          ) : (
            <Cover project={project} index={Math.max(project.position - 1, 0)} className="aspect-video w-full rounded-2xl" />
          )}
          <p className="text-lg leading-relaxed text-pretty">{summary}</p>
          {project.videoId && project.diagramUrl && (
            <FigureLink src={project.diagramUrl} alt={`${t('projects.howItWorks')}: ${title}`} caption={t('projects.howItWorks')} />
          )}
          {project.diagramUrl && project.imageUrl && (
            <FigureLink src={project.imageUrl} alt={`${t('projects.screenshot')}: ${title}`} caption={t('projects.screenshot')} />
          )}
          {details && <p className="whitespace-pre-line leading-relaxed text-muted text-pretty">{details}</p>}
          <TechList tech={project.tech} />
          {(project.repoUrl || project.liveUrl) && (
            <div className="flex flex-wrap gap-3">
              <ProjectLinks project={project} />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FigureLink({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="space-y-3">
      {caption && <figcaption className="font-display text-sm font-semibold uppercase tracking-wider text-accent">{caption}</figcaption>}
      <a href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-line">
        <img src={src} alt={alt} loading="lazy" className="w-full" />
      </a>
    </figure>
  );
}
