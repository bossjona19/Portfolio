const BASE = import.meta.env.VITE_API_URL ?? '';

export interface Project {
  id: number;
  slug: string;
  position: number;
  featured: boolean;
  published: boolean;
  titleEs: string;
  titleEn: string;
  summaryEs: string;
  summaryEn: string;
  detailsEs: string;
  detailsEn: string;
  imageUrl: string | null;
  diagramUrl: string | null;
  videoId: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  tech: string[];
}

export interface Message {
  id: number;
  name: string;
  email: string;
  body: string;
  lang: string;
  read: boolean;
  createdAt: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit & { token?: string | null } = {}): Promise<T> {
  const { token, headers, ...rest } = init;
  const res = await fetch(`${BASE}/api${path}`, {
    ...rest,
    headers: {
      ...(rest.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error ?? `Error ${res.status}`);
  return data as T;
}

export const localized = (p: Project, lang: string) =>
  lang === 'es'
    ? { title: p.titleEs, summary: p.summaryEs, details: p.detailsEs }
    : { title: p.titleEn, summary: p.summaryEn, details: p.detailsEn };
