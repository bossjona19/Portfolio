import { useTranslation } from 'react-i18next';
import { site } from '../site';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-line py-8">
      <div className="container-page flex flex-col items-center justify-between gap-3 text-sm text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>{t('footer.rights')}</p>
      </div>
    </footer>
  );
}
