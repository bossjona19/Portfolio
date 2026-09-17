import { useTranslation } from 'react-i18next';
import { LocalVideo } from './LocalVideo';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';

/** Recorridos grabados de cada proyecto. Los archivos viven en public/video. */
const WALKTHROUGHS = [
  { slug: 'sistema-adopcion', file: '/video/sistema-adopcion.mp4', poster: '/img/projects/sistema-adopcion.webp' },
  { slug: 'salon-belleza', file: '/video/salon-belleza.mp4', poster: '/img/projects/salon-belleza.webp' },
  { slug: 'scraper-b2b', file: '/video/scraper-b2b.mp4', poster: '/img/projects/scraper-b2b.webp' },
] as const;

export function ProjectsVideo() {
  const { t } = useTranslation();
  return (
    <section id="video" className="border-t border-line py-24">
      <div className="container-page">
        <Reveal>
          <SectionTitle index="03" title={t('video.title')} subtitle={t('video.subtitle')} />
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {WALKTHROUGHS.map((item, i) => {
            const title = t(`video.items.${item.slug}`);
            return (
              <Reveal key={item.slug} delay={0.1 * (i + 1)}>
                <LocalVideo src={item.file} poster={item.poster} title={title} />
                <p className="mt-3 text-sm font-medium text-fg">{title}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
