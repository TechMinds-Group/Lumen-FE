import { User, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DimensionBadgeProps {
  type: 'anthropology' | 'scope';
  tagKey: string;
}

export function DimensionBadge({ type, tagKey }: DimensionBadgeProps) {
  const { t } = useTranslation();
  const label = t(`tags.${tagKey}`, { defaultValue: tagKey });

  if (type === 'anthropology') {
    const isOptimistic  = tagKey === 'optimistic';
    const isPessimistic = tagKey === 'pessimistic';

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${
          isOptimistic
            ? 'bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
            : isPessimistic
            ? 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-500'
            : 'bg-[#F2EEE2] text-[#6A6355] border-[#DDD7C8] dark:bg-[#131E30] dark:text-[#A8B8C8] dark:border-[#1C2E44]'
        }`}
      >
        <User size={12} />
        <span>{label}</span>
      </div>
    );
  }

  if (type === 'scope') {
    const isUniversal = tagKey === 'universalist';

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${
          isUniversal
            ? 'bg-[#8A9BB8]/15 text-[#1A2E4A] border-[#8A9BB8]/40 dark:bg-[#8A9BB8]/20 dark:text-[#A8B8C8] dark:border-[#8A9BB8]/40'
            : 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700'
        }`}
      >
        <Globe size={12} />
        <span>{label}</span>
      </div>
    );
  }

  return null;
}