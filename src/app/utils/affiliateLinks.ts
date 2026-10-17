// RN-028: Links de afiliados por obra.
// Endpoint público (sem auth): GET /api/v1/works/{thinkerId}/{workTitle}/affiliate-links

export interface AffiliateLink {
  provider: 'Amazon' | 'Estante Virtual';
  url: string;
  kind: 'novo' | 'ebook' | 'usado';
}

const FALLBACK_API_BASE_URL = 'http://localhost:5000';

const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  FALLBACK_API_BASE_URL;

// Cache session-level: evita refetch do mesmo par (thinkerId, workTitle)
const linkCache = new Map<string, Promise<AffiliateLink[]>>();

function cacheKey(thinkerId: string, workTitle: string): string {
  return `${thinkerId}::${workTitle}`;
}

export function getAffiliateLinks(
  thinkerId: string,
  workTitle: string,
): Promise<AffiliateLink[]> {
  const key = cacheKey(thinkerId, workTitle);

  if (linkCache.has(key)) {
    return linkCache.get(key)!;
  }

  const encodedThinker = encodeURIComponent(thinkerId);
  const encodedWork = encodeURIComponent(workTitle);
  const url = `${API_BASE_URL}/api/v1/works/${encodedThinker}/${encodedWork}/affiliate-links`;

  const promise = fetch(url, { method: 'GET' })
    .then(res => {
      if (!res.ok) {
        // 404 e outros erros silenciosos → array vazio
        return [] as AffiliateLink[];
      }
      return res.json() as Promise<AffiliateLink[]>;
    })
    .catch(() => {
      // Timeout / network error → array vazio, sem erro visível
      return [] as AffiliateLink[];
    });

  linkCache.set(key, promise);
  return promise;
}