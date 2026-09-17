/**
 * Video alojado en el propio sitio (apps/web/public/video). Con `preload="none"`
 * el archivo solo se descarga si alguien pulsa play; hasta entonces se ve el póster.
 */
export function LocalVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  return (
    <video
      src={src}
      controls
      playsInline
      preload="none"
      poster={poster}
      title={title}
      className="aspect-video w-full rounded-2xl border border-line bg-panel object-cover"
    />
  );
}
