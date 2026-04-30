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
            ? 'bg-slate-100 text-slate-800 border-slate-400 dark:bg-slate-700/50 dark:text-slate-200 dark:border-slate-500'
            : 'bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-500'
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
            ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
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
