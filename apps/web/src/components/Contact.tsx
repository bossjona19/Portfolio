import { CheckCircle2, Mail, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { api, ApiError } from '../lib/api';
import { site } from '../site';
import { GithubIcon } from './GithubIcon';
import { Reveal } from './Reveal';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'rate-limited';

const field =
  'w-full rounded-xl border border-line bg-ink px-4 py-3 text-fg placeholder:text-muted/60 transition focus:border-accent focus:outline-none';

export function Contact() {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus('sending');
    try {
      await api('/contact', { method: 'POST', body: JSON.stringify({ ...data, lang: i18n.language }) });
      form.reset();
      setStatus('sent');
    } catch (err) {
      setStatus(err instanceof ApiError && err.status === 429 ? 'rate-limited' : 'error');
    }
  }

  return (
    <section id="contact" className="border-t border-line py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="mb-3 font-display text-sm font-semibold text-accent">04</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">{t('contact.title')}</h2>
          <p className="mt-5 max-w-md text-lg text-muted text-pretty">{t('contact.subtitle')}</p>
          <ul className="mt-8 space-y-3">
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 text-fg transition hover:text-accent">
                <span className="grid size-10 place-items-center rounded-full border border-line bg-panel">
                  <Mail size={18} />
                </span>
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-fg transition hover:text-accent"
              >
                <span className="grid size-10 place-items-center rounded-full border border-line bg-panel">
                  <GithubIcon size={18} />
                </span>
                {site.github.replace('https://', '')}
              </a>
            </li>
            {site.linkedin && (
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-fg transition hover:text-accent"
                >
                  <span className="grid size-10 place-items-center rounded-full border border-line bg-panel text-sm font-bold">
                    in
                  </span>
                  LinkedIn
                </a>
              </li>
            )}
            {site.upwork && (
              <li>
                <a
                  href={site.upwork}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-fg transition hover:text-accent"
                >
                  <span className="grid size-10 place-items-center rounded-full border border-line bg-panel text-sm font-bold">
                    up
                  </span>
                  Upwork
                </a>
              </li>
            )}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          {status === 'sent' ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-accent/40 bg-panel p-10 text-center" role="status">
              <CheckCircle2 size={40} className="text-accent" />
              <p className="text-lg">{t('contact.success')}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-panel p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">{t('contact.name')}</span>
                  <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">{t('contact.email')}</span>
                  <input name="email" type="email" required maxLength={120} autoComplete="email" className={field} />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">{t('contact.message')}</span>
                <textarea name="body" required minLength={10} maxLength={3000} rows={5} className={`${field} resize-y`} />
              </label>
              {/* Campo trampa para bots: oculto para personas y lectores de pantalla. */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

              {(status === 'error' || status === 'rate-limited') && (
                <p className="text-sm text-red-400" role="alert">
                  {t(status === 'error' ? 'contact.error' : 'contact.tooMany')}
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-ink transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
              >
                {status === 'sending' ? t('contact.sending') : t('contact.send')}
                <Send size={17} />
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
