export const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function apiFetch(path: string, options?: RequestInit) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = new Headers(options?.headers as HeadersInit);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const fetchOpts: RequestInit = { ...(options || {}), headers };
  const res = await fetch(url, fetchOpts);
  if (!res.ok) {
    const text = await res.text();
    let body: any = text;
    try { body = JSON.parse(text); } catch (_) {}
    const err = new Error(`API request failed: ${res.status} ${res.statusText}`);
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }
  return res.json();
}
