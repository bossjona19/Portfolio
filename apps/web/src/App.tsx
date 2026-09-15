import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { preferredLang } from './i18n';
import { HomePage } from './pages/HomePage';

// El panel no se descarga para quien solo visita el portafolio.
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${preferredLang()}`} replace />} />
        <Route path="/:lang" element={<HomePage />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
