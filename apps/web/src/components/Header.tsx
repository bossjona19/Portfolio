import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { LANGS } from '../i18n';
import { site } from '../site';

const SECTIONS = ['about', 'projects', 'video', 'contact'] as const;

export function Header() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-line bg-ink/80 backdrop-blur-lg' : 'border-b border-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight">
          {site.name.split(' ')[0]}
          <span className="text-accent">.</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {SECTIONS.map((s) => (
            <a key={s} href={`#${s}`} className="text-sm text-muted transition-colors hover:text-fg">
              {t(`nav.${s}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch current={lang} />
          <button
            type="button"
            className="rounded-lg p-2 text-muted hover:text-fg md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="container-page flex flex-col gap-1 pb-4 md:hidden" aria-label="Mobile">
          {SECTIONS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-muted hover:bg-panel hover:text-fg"
            >
              {t(`nav.${s}`)}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function LangSwitch({ current }: { current: string | undefined }) {
  const { t } = useTranslation();
  return (
    <div
      role="group"
      aria-label={t('nav.language')}
      className="flex rounded-full border border-line bg-panel p-0.5 text-xs font-semibold"
    >
      {LANGS.map((l) => (
        <Link
          key={l}
          to={`/${l}${window.location.hash}`}
          replace
          preventScrollReset
          aria-current={l === current ? 'true' : undefined}
          className={`rounded-full px-3 py-1.5 uppercase transition-colors ${
            l === current ? 'bg-accent text-ink' : 'text-muted hover:text-fg'
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
