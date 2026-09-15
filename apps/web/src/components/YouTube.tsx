import { Clapperboard, Play } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Muestra solo la miniatura y carga el reproductor de YouTube al pulsar play.
 * Así la página no descarga ~1 MB de JavaScript de YouTube si nadie ve el video.
 */
export function YouTube({ id, title, label }: { id: string | null; title: string; label?: string }) {
  const { t, i18n } = useTranslation();
  const [playing, setPlaying] = useState(false);

  const frame = 'relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-panel';

  if (!id) {
    return (
      <div className={`${frame} grid place-items-center`}>
        <div className="grid-bg absolute inset-0" aria-hidden />
        <div className="relative flex flex-col items-center gap-3 text-muted">
          <Clapperboard size={32} />
          <span className="text-sm">{t('video.soon')}</span>
        </div>
      </div>
    );
  }

  if (playing) {
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      cc_load_policy: '1',
      cc_lang_pref: i18n.language,
      hl: i18n.language,
    });
    return (
      <div className={frame}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className={`${frame} group block`} aria-label={`${t('video.play')}: ${title}`}>
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent" />
      <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-ink shadow-[0_0_40px_-5px] shadow-accent/60 transition group-hover:scale-110">
        <Play size={26} fill="currentColor" className="ml-1" />
      </span>
      {label && <span className="absolute bottom-4 left-4 text-sm font-medium text-fg">{label}</span>}
    </button>
  );
}
