export const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function apiFetch(path: string, options?: RequestInit) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, options);
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
