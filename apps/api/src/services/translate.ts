import { config } from '../config.js';
import { HttpError } from '../lib/http-error.js';

export type Lang = 'es' | 'en';

/**
 * Traduce varios textos en una sola llamada a DeepL.
 * Se usa al guardar un proyecto desde el panel, nunca cuando alguien visita la página.
 */
export async function translate(texts: string[], from: Lang, to: Lang): Promise<string[]> {
  if (!config.DEEPL_API_KEY) {
    throw new HttpError(503, 'Traducción no configurada (falta DEEPL_API_KEY)');
  }
  const nonEmpty = texts.map((t) => t.trim());
  if (nonEmpty.every((t) => t === '')) return texts;

  // Las llaves del plan gratuito terminan en ":fx" y usan otro dominio.
  const host = config.DEEPL_API_KEY.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';
  const res = await fetch(`https://${host}/v2/translate`, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${config.DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: nonEmpty,
      source_lang: from.toUpperCase(),
      target_lang: to === 'en' ? 'EN-US' : 'ES',
      preserve_formatting: true,
    }),
  });

  if (!res.ok) {
    throw new HttpError(502, `DeepL respondió ${res.status}`);
  }
  const data = (await res.json()) as { translations: { text: string }[] };
  return data.translations.map((t, i) => (nonEmpty[i] === '' ? '' : t.text));
}
