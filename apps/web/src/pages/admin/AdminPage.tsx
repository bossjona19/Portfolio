import { LogOut, Mail, MailOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api, ApiError, type Message, type Project } from '../../lib/api';
import { ProjectForm } from './ProjectForm';

const TOKEN_KEY = 'admin-token';

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export default function AdminPage() {
  const [token, setTokenState] = useState<string | null>(readToken);

  const setToken = useCallback((t: string | null) => {
    try {
      if (t) sessionStorage.setItem(TOKEN_KEY, t);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // sin sessionStorage la sesión dura lo que la pestaña.
    }
    setTokenState(t);
  }, []);

  useEffect(() => {
    document.title = 'Admin — Portafolio';
    document.documentElement.lang = 'es';
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      {token ? <Dashboard token={token} onLogout={() => setToken(null)} /> : <Login onLogin={setToken} />}
    </div>
  );
}

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body = JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)));
      const { token } = await api<{ token: string }>('/auth/login', { method: 'POST', body });
      onLogin(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-panel p-8">
        <h1 className="font-display text-2xl font-bold">Panel del portafolio</h1>
        <input name="email" type="email" placeholder="Correo" required autoComplete="username" className="input" />
        <input name="password" type="password" placeholder="Contraseña" required autoComplete="current-password" className="input" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={busy} className="btn-primary w-full">
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<'projects' | 'messages'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [editing, setEditing] = useState<Project | 'new' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(
    async <T,>(path: string, init: RequestInit = {}) => {
      try {
        return await api<T>(path, { ...init, token });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) onLogout();
        throw err;
      }
    },
    [token, onLogout],
  );

  const load = useCallback(async () => {
    try {
      const [p, m] = await Promise.all([call<Project[]>('/admin/projects'), call<Message[]>('/admin/messages')]);
      setProjects(p);
      setMessages(m);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  }, [call]);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(p: Project) {
    if (!window.confirm(`¿Borrar "${p.titleEs}"? No se puede deshacer.`)) return;
    await call(`/admin/projects/${p.id}`, { method: 'DELETE' });
    await load();
  }

  async function toggleRead(m: Message) {
    await call(`/admin/messages/${m.id}`, { method: 'PATCH', body: JSON.stringify({ read: !m.read }) });
    await load();
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="container-page py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Panel</h1>
        <div className="flex items-center gap-2">
          <a href="/" className="btn-ghost">Ver sitio</a>
          <button onClick={onLogout} className="btn-ghost">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>

      <div className="mb-6 flex gap-2">
        <button onClick={() => setTab('projects')} className={tab === 'projects' ? 'btn-primary' : 'btn-ghost'}>
          Proyectos ({projects.length})
        </button>
        <button onClick={() => setTab('messages')} className={tab === 'messages' ? 'btn-primary' : 'btn-ghost'}>
          Mensajes {unread > 0 && `(${unread} nuevos)`}
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl border border-red-400/40 p-4 text-red-400">{error}</p>}

      {tab === 'projects' &&
        (editing ? (
          <ProjectForm
            initial={editing === 'new' ? null : editing}
            nextPosition={projects.length + 1}
            call={call}
            onDone={async () => {
              setEditing(null);
              await load();
            }}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <div className="space-y-3">
            <button onClick={() => setEditing('new')} className="btn-primary">
              <Plus size={16} /> Nuevo proyecto
            </button>
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 rounded-xl border border-line bg-panel p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    <span className="mr-2 text-muted">#{p.position}</span>
                    {p.titleEs}
                    {!p.published && <span className="ml-2 text-xs text-muted">(oculto)</span>}
                    {p.featured && <span className="ml-2 text-xs text-accent">destacado</span>}
                  </p>
                  <p className="truncate text-sm text-muted">{p.titleEn}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setEditing(p)} className="btn-icon" aria-label="Editar">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => remove(p)} className="btn-icon hover:text-red-400" aria-label="Borrar">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

      {tab === 'messages' && (
        <div className="space-y-3">
          {messages.length === 0 && <p className="text-muted">Todavía no hay mensajes.</p>}
          {messages.map((m) => (
            <div key={m.id} className={`rounded-xl border bg-panel p-5 ${m.read ? 'border-line' : 'border-accent/50'}`}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">
                  {m.name}{' '}
                  <a href={`mailto:${m.email}`} className="font-normal text-accent-2 hover:underline">
                    {m.email}
                  </a>
                </p>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <span>
                    {new Date(m.createdAt).toLocaleString('es')} · {m.lang.toUpperCase()}
                  </span>
                  <button onClick={() => toggleRead(m)} className="btn-icon" aria-label={m.read ? 'Marcar no leído' : 'Marcar leído'}>
                    {m.read ? <Mail size={16} /> : <MailOpen size={16} />}
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-muted">{m.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
