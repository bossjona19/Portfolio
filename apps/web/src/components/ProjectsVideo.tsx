import { useTranslation } from 'react-i18next';
import { site } from '../site';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';
import { YouTube } from './YouTube';

export function ProjectsVideo() {
  const { t } = useTranslation();
  return (
    <section id="video" className="border-t border-line py-24">
      <div className="container-page">
        <Reveal>
          <SectionTitle index="03" title={t('video.title')} subtitle={t('video.subtitle')} />
        </Reveal>
        <Reveal delay={0.1} className="mx-auto max-w-4xl">
          <YouTube id={site.videos.projects} title={t('video.title')} />
        </Reveal>
      </div>
    </section>
  );
}
