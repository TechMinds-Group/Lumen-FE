/**
 * Normaliza texto removendo acentos e convertendo para minúsculas
 * para comparação de busca mais flexível
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompõe caracteres acentuados
    .replace(/[̀-ͯ]/g, '') // Remove marcas de acento
    .trim();
}
