import { Languages } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import type { Project } from '../../lib/api';

type Call = <T>(path: string, init?: RequestInit) => Promise<T>;

type Draft = Omit<Project, 'id' | 'tech' | 'imageUrl' | 'videoId' | 'repoUrl' | 'liveUrl'> & {
  tech: string;
  imageUrl: string;
  videoId: string;
  repoUrl: string;
  liveUrl: string;
};

const toDraft = (p: Project | null, position: number): Draft => ({
  slug: p?.slug ?? '',
  position: p?.position ?? position,
  featured: p?.featured ?? false,
  published: p?.published ?? true,
  titleEs: p?.titleEs ?? '',
  titleEn: p?.titleEn ?? '',
  summaryEs: p?.summaryEs ?? '',
  summaryEn: p?.summaryEn ?? '',
  detailsEs: p?.detailsEs ?? '',
  detailsEn: p?.detailsEn ?? '',
  tech: p?.tech.join(', ') ?? '',
  imageUrl: p?.imageUrl ?? '',
  videoId: p?.videoId ?? '',
  repoUrl: p?.repoUrl ?? '',
  liveUrl: p?.liveUrl ?? '',
});

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function ProjectForm({
  initial,
  nextPosition,
  call,
  onDone,
  onCancel,
}: {
  initial: Project | null;
  nextPosition: number;
  call: Call;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [d, setD] = useState<Draft>(() => toDraft(initial, nextPosition));
  const [busy, setBusy] = useState<'save' | 'translate' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }));

  async function translateAll() {
    setBusy('translate');
    setError(null);
    try {
      const { texts } = await call<{ texts: string[] }>('/admin/translate', {
        method: 'POST',
        body: JSON.stringify({ texts: [d.titleEs, d.summaryEs, d.detailsEs], from: 'es', to: 'en' }),
      });
      setD((prev) => ({ ...prev, titleEn: texts[0]!, summaryEn: texts[1]!, detailsEn: texts[2]! }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al traducir');
    } finally {
      setBusy(null);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy('save');
    setError(null);
    const body = JSON.stringify({
      ...d,
      slug: d.slug || slugify(d.titleEs),
      tech: d.tech.split(',').map((x) => x.trim()).filter(Boolean),
      videoId: d.videoId || null,
      autoTranslate: true,
    });
    try {
      await call(initial ? `/admin/projects/${initial.id}` : '/admin/projects', {
        method: initial ? 'PUT' : 'POST',
        body,
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
      setBusy(null);
    }
  }

  const text = (k: keyof Draft, label: string, props: { rows?: number; required?: boolean; placeholder?: string } = {}) => (
    <Field label={label}>
      {props.rows ? (
        <textarea
          className="input"
          rows={props.rows}
          required={props.required}
          value={d[k] as string}
          onChange={(e) => set(k, e.target.value as never)}
        />
      ) : (
        <input
          className="input"
          required={props.required}
          placeholder={props.placeholder}
          value={d[k] as string}
          onChange={(e) => set(k, e.target.value as never)}
        />
      )}
    </Field>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-line bg-panel p-6">
      <h2 className="font-display text-xl font-bold">{initial ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <fieldset className="space-y-4">
          <legend className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Español</legend>
          {text('titleEs', 'Título', { required: true })}
          {text('summaryEs', 'Resumen (tarjeta)', { rows: 3, required: true })}
          {text('detailsEs', 'Detalle ("Ver más")', { rows: 6 })}
        </fieldset>
        <fieldset className="space-y-4">
          <legend className="mb-2 flex w-full items-center justify-between text-sm font-semibold uppercase tracking-widest text-accent-2">
            English
            <button type="button" onClick={translateAll} disabled={busy !== null || !d.titleEs} className="btn-ghost normal-case tracking-normal">
              <Languages size={16} /> {busy === 'translate' ? 'Traduciendo…' : 'Traducir desde español'}
            </button>
          </legend>
          {text('titleEn', 'Title')}
          {text('summaryEn', 'Summary', { rows: 3 })}
          {text('detailsEn', 'Details', { rows: 6 })}
          <p className="text-xs text-muted">Si dejas vacío algo en inglés, se traduce solo al guardar. Revísalo después.</p>
        </fieldset>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {text('slug', 'Slug', { placeholder: slugify(d.titleEs) || 'mi-proyecto' })}
        {text('tech', 'Tecnologías (separadas por coma)')}
        <Field label="Posición">
          <input className="input" type="number" min={0} value={d.position} onChange={(e) => set('position', Number(e.target.value))} />
        </Field>
        {text('imageUrl', 'URL de imagen', { placeholder: 'https://…' })}
        {text('videoId', 'ID de video de YouTube')}
        {text('repoUrl', 'Repositorio', { placeholder: 'https://github.com/…' })}
        {text('liveUrl', 'Sitio en vivo', { placeholder: 'https://…' })}
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={d.published} onChange={(e) => set('published', e.target.checked)} className="accent-accent" />
          Publicado
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={d.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-accent" />
          Destacado
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button disabled={busy !== null} className="btn-primary">
          {busy === 'save' ? 'Guardando…' : 'Guardar'}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}
