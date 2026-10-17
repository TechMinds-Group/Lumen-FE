import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AffiliateLink } from '../utils/affiliateLinks';

interface AffiliateSectionProps {
  thinkerId: string;
  workTitle: string;
  links: AffiliateLink[];
  hasDownload: boolean;
}

// Mapeia provider+kind → i18n key
const AFFILIATE_I18N_MAP: Record<string, string> = {
  'Amazon::novo': 'affiliate.amazon_novo',
  'Amazon::ebook': 'affiliate.amazon_ebook',
  'Amazon::usado': 'affiliate.amazon_usado',
  'Estante Virtual::novo': 'affiliate.estante_virtual_novo',
  'Estante Virtual::ebook': 'affiliate.estante_virtual_ebook',
  'Estante Virtual::usado': 'affiliate.estante_virtual_usado',
};

/**
 * Renderiza os links de afiliados para compra de uma obra.
 * - Se a obra tem download interno (hasDownload = true), o download é ação primária
 *   e a seção exibe "Também disponível para compra em:".
 * - Obra sem links → seção oculta (AC-D8 provisório).
 * - Obra sem links nem download → seção oculta.
 */
export function AffiliateSection({
  thinkerId,
  workTitle,
  links,
  hasDownload,
}: AffiliateSectionProps) {
  const { t } = useTranslation();

  if (links.length === 0) return null;

  const heading = hasDownload
    ? t('affiliate.also_available')
    : t('affiliate.buy_this_work');

  return (
    <div className="mt-2 pt-2 border-t border-[#DDD7C8] dark:border-[#1C2E44]">
      <p className="text-[10px] font-medium text-[#6A6355] dark:text-[#687280] mb-1.5">
        {heading}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {links.map((link, idx) => {
          const i18nKey = AFFILIATE_I18N_MAP[`${link.provider}::${link.kind}`];
          const label = i18nKey ? t(i18nKey) : `${link.provider} (${link.kind})`;
          return (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener sponsored"
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#C9A84C]/15 dark:bg-[#C9A84C]/20 border border-[#C9A84C]/40 dark:border-[#C9A84C]/60 rounded text-xs text-[#0F1E35] dark:text-[#D8B85A] hover:bg-[#C9A84C]/25 dark:hover:bg-[#C9A84C]/30 transition-colors"
            >
              <span className="font-['Inter'] tracking-tight">{label}</span>
              <ExternalLink size={10} />
            </a>
          );
        })}
      </div>
    </div>
  );
}