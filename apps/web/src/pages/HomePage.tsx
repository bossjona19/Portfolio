import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { ProjectsVideo } from '../components/ProjectsVideo';
import { isLang } from '../i18n';

export function HomePage() {
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
  const valid = isLang(lang);

  useEffect(() => {
    if (!valid) return;
    void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch {
      // sin almacenamiento: el idioma sigue en la URL.
    }
  }, [lang, valid, i18n]);

  useEffect(() => {
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  }, [t, i18n.language]);

  const ready = valid && i18n.language === lang;

  // La página se pinta después de fijar el idioma, así que el #ancla hay que aplicarlo a mano.
  useEffect(() => {
    if (!ready || !window.location.hash) return;
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
  }, [ready]);

  if (!valid) return <Navigate to="/" replace />;
  // Evita pintar un instante en el idioma anterior mientras corre el efecto.
  if (i18n.language !== lang) return null;

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <ProjectsVideo />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
