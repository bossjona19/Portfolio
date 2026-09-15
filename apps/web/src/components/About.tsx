import { useTranslation } from 'react-i18next';
import { site } from '../site';
import { Reveal } from './Reveal';
import { SectionTitle } from './SectionTitle';

export function About() {
  const { t } = useTranslation();
  return (
    <section id="about" className="border-t border-line py-24">
      <div className="container-page grid gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionTitle index="01" title={t('about.title')} />
          <div className="space-y-5 text-lg leading-relaxed text-muted text-pretty">
            <p>{t('about.body1')}</p>
            <p>{t('about.body2')}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:pt-16">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">{t('about.skillsTitle')}</h3>
          <ul className="flex flex-wrap gap-2.5">
            {site.skills.map((s) => (
              <li
                key={s}
                className="rounded-xl border border-line bg-panel px-4 py-2 text-sm font-medium transition hover:border-accent/50 hover:text-accent"
              >
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
