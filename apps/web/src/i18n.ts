import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

export const LANGS = ['en', 'es'] as const;
export type Lang = (typeof LANGS)[number];

export const isLang = (v: string | undefined): v is Lang => LANGS.includes(v as Lang);

export function preferredLang(): Lang {
  try {
    const saved = localStorage.getItem('lang');
    if (isLang(saved ?? undefined)) return saved as Lang;
  } catch {
    // localStorage bloqueado: seguimos con el idioma del navegador.
  }
  // Por defecto inglés (clientes de Upwork); español si el navegador lo pide.
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
