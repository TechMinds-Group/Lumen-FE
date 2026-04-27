import { User, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DimensionBadgeProps {
  type: 'anthropology' | 'scope';
  /** Tag key, e.g. "optimistic" | "pessimistic" | "mixed" | "universalist" | "particularist" */
  tagKey: string;
}

export function DimensionBadge({ type, tagKey }: DimensionBadgeProps) {
  const { t } = useTranslation();
  const label = t(`tags.${tagKey}`, { defaultValue: tagKey });

  if (type === 'anthropology') {
    const isOptimistic = tagKey === 'optimistic';
    const isPessimistic = tagKey === 'pessimistic';

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${
          isOptimistic
            ? 'bg-yellow-50 text-yellow-800 border-yellow-300'
            : isPessimistic
            ? 'bg-slate-100 text-slate-800 border-slate-400'
            : 'bg-gray-50 text-gray-700 border-gray-300'
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
            ? 'bg-blue-100 text-blue-800 border-blue-300'
            : 'bg-orange-50 text-orange-800 border-orange-300'
        }`}
      >
        <Globe size={12} />
        <span>{label}</span>
      </div>
    );
  }

  return null;
}
