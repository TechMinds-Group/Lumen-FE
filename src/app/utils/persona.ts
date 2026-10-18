// RN-029: chat com persona de IA por autor.
// Endpoints: GET /api/v1/personas/{thinkerId} (available) ·
// GET/POST /api/v1/personas/{thinkerId}/messages (Bearer + X-Tenant-ID).

import { getToken } from './auth';

const FALLBACK_API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  FALLBACK_API_BASE_URL;

// Single-tenant MVP — o TenantMiddleware do backend exige o header
export const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000000';

export interface PersonaMessage {
  role: 'user' | 'persona';
  content: string;
  flaggedOffBase?: boolean;
  createdAt?: string;
}

export interface SendMessageResult {
  reply: string;
  flaggedOffBase: boolean;
  remainingToday: number;
}

export class PersonaApiError extends Error {
  code?: string;
  status: number;
  constructor(code: string | undefined, status: number) {
    super(code === 'ERR-140' ? 'ERR-140' : code === 'ERR-141' ? 'ERR-141' : 'API_ERROR');
    this.code = code;
    this.status = status;
  }
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Tenant-ID': DEFAULT_TENANT_ID
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function parseErrors(res: Response): Promise<never> {
  let code: string | undefined;
  try {
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) code = data[0].code;
  } catch {
    // corpo sem JSON
  }
  throw new PersonaApiError(code, res.status);
}

export async function isPersonaAvailable(thinkerId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/personas/${encodeURIComponent(thinkerId)}`, {
      headers: { 'X-Tenant-ID': DEFAULT_TENANT_ID }
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { available: boolean };
    return data.available === true;
  } catch {
    return false; // backend offline → botão oculto (graceful)
  }
}

export async function getPersonaMessages(thinkerId: string): Promise<PersonaMessage[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/personas/${encodeURIComponent(thinkerId)}/messages`,
    { headers: authHeaders() }
  );
  if (!res.ok) await parseErrors(res);
  return res.json() as Promise<PersonaMessage[]>;
}

export async function sendPersonaMessage(
  thinkerId: string, content: string
): Promise<SendMessageResult> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/personas/${encodeURIComponent(thinkerId)}/messages`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ content })
    }
  );
  if (!res.ok) await parseErrors(res);
  return res.json() as Promise<SendMessageResult>;
}