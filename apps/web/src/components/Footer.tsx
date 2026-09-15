import { ArrowUp, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { site } from '../site';
import { GithubIcon } from './GithubIcon';

export function Footer() {
  const { t } = useTranslation();
  const icon = 'grid size-9 place-items-center rounded-full border border-line text-muted transition hover:border-fg/40 hover:text-fg';
  return (
    <footer className="border-t border-line py-10">
      <div className="container-page flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display font-semibold">
            {site.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            © {new Date().getFullYear()} · {t('footer.rights')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`mailto:${site.email}`} className={icon} aria-label="Email">
            <Mail size={16} />
          </a>
          <a href={site.github} target="_blank" rel="noreferrer" className={icon} aria-label="GitHub">
            <GithubIcon size={16} />
          </a>
          <a href="#top" className={icon} aria-label={t('footer.top')}>
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
