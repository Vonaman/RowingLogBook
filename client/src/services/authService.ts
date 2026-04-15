const API_URL = 'http://localhost:3000/api';

export interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; role: string };
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? 'Identifiants incorrects.');
  }
  return res.json();
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? 'Erreur lors de la création du compte.');
  }
  return res.json();
}

export function saveAuth(response: AuthResponse) {
  localStorage.setItem('access_token', response.accessToken);
  localStorage.setItem('user', JSON.stringify(response.user));
}

export function getToken(): string | null {
  return localStorage.getItem('access_token');
}

export function getUser(): { id: string; email: string; role: string } | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
}
