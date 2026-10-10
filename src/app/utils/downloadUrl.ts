// RN-010: URL final de download = prefixo GitHub raw fixo + valor do campo download_url.
// O prefixo é configurável via VITE_DOWNLOAD_BASE_URL; sem a env, o fallback
// preserva o valor em produção (comportamento idêntico ao anterior à extração).
const FALLBACK_DOWNLOAD_BASE_URL =
  'https://github.com/victor-souza-dev/RepoStaticFile/raw/refs/heads/main/politica/';

export const DOWNLOAD_BASE_URL: string =
  (import.meta.env.VITE_DOWNLOAD_BASE_URL as string | undefined)?.trim() ||
  FALLBACK_DOWNLOAD_BASE_URL;
