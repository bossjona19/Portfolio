import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { site } from '../site';
import { GithubIcon } from './GithubIcon';
import { Reveal } from './Reveal';
import { YouTube } from './YouTube';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <Avatar />
            <div>
              <p className="font-display text-lg font-semibold">{site.name}</p>
              <p className="text-sm text-muted">{site.role}</p>
            </div>
          </div>

          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-medium text-muted">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {t('hero.eyebrow')}
          </p>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">{t('hero.subtitle')}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-ink transition hover:brightness-110"
            >
              {t('hero.ctaProjects')} <ArrowDown size={18} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-semibold transition hover:border-fg/40 hover:bg-panel"
            >
              {t('hero.ctaContact')}
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="grid size-12 place-items-center rounded-full border border-line text-muted transition hover:border-fg/40 hover:text-fg"
            >
              <GithubIcon size={20} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <YouTube id={site.videos.intro} title={t('hero.videoLabel')} label={t('hero.videoLabel')} />
        </Reveal>
      </div>
    </section>
  );
}

function Avatar() {
  if (site.photo) {
    return (
      <img
        src={site.photo}
        alt={site.name}
        width={56}
        height={56}
        className="size-14 rounded-full object-cover ring-2 ring-accent/60 ring-offset-2 ring-offset-ink"
      />
    );
  }
  return (
    <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-display text-lg font-bold text-ink ring-2 ring-accent/30 ring-offset-2 ring-offset-ink">
      {site.initials}
    </div>
  );
}
