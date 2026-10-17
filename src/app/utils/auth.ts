// RN-033: Contas de usuário e autenticação.
// Endpoints: POST /api/v1/auth/{register,login,google,forgot-password,reset-password}; GET /api/v1/me
// Contrato: API_CONTRACTS.md §8.2 — envelope de erros: array [{message, field, detail, code}]

const FALLBACK_API_BASE_URL = 'http://localhost:5000';

const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  FALLBACK_API_BASE_URL;

const TOKEN_KEY = 'lumen_token';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  emailVerified: boolean;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
  tokenExpiresAtUtc: string;
}

export interface ApiError {
  code?: string;
  message: string;
  field?: string;
  detail?: string;
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function logout(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage indisponível — nada a limpar
  }
}

async function request<T>(path: string, body?: unknown, auth = false): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!res.ok) {
    let errors: ApiError[] = [];
    try {
      const data = await res.json();
      if (Array.isArray(data)) errors = data as ApiError[];
    } catch {
      // corpo sem JSON — mantém lista vazia
    }
    const err = new Error('API_ERROR') as Error & { apiErrors: ApiError[]; status: number };
    err.apiErrors = errors;
    err.status = res.status;
    throw err;
  }

  return res.json() as Promise<T>;
}

export function register(email: string, password: string, fullName?: string): Promise<AuthResult> {
  return request<AuthResult>('/api/v1/auth/register', { email, password, fullName });
}

export function login(email: string, password: string): Promise<AuthResult> {
  return request<AuthResult>('/api/v1/auth/login', { email, password });
}

export function googleLogin(idToken: string): Promise<AuthResult> {
  return request<AuthResult>('/api/v1/auth/google', { idToken });
}

export function forgotPassword(email: string): Promise<void> {
  return request<void>('/api/v1/auth/forgot-password', { email });
}

export function resetPassword(token: string, newPassword: string): Promise<void> {
  return request<void>('/api/v1/auth/reset-password', { token, newPassword });
}

export function getMe(): Promise<AuthUser> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(`${API_BASE_URL}/api/v1/me`, { headers }).then(res => {
    if (!res.ok) {
      const err = new Error('API_ERROR') as Error & { apiErrors: ApiError[]; status: number };
      err.apiErrors = [];
      err.status = res.status;
      throw err;
    }
    return res.json() as Promise<AuthUser>;
  });
}
