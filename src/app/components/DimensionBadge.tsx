import { User, Globe } from 'lucide-react';

interface DimensionBadgeProps {
  type: 'anthropology' | 'scope';
  value: string;
}

export function DimensionBadge({ type, value }: DimensionBadgeProps) {
  const isOptimistic = value.toLowerCase().includes('otimista');
  const isPessimistic = value.toLowerCase().includes('pessimista');
  const isUniversal = value.toLowerCase().includes('universal');
  const isParticular = value.toLowerCase().includes('particular') || value.toLowerCase().includes('contextual');

  if (type === 'anthropology') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${
        isOptimistic
          ? 'bg-yellow-50 text-yellow-800 border-yellow-300'
          : isPessimistic
          ? 'bg-slate-100 text-slate-800 border-slate-400'
          : 'bg-gray-50 text-gray-700 border-gray-300'
      }`}>
        <User size={12} />
        <span>{isOptimistic ? 'Otimista' : isPessimistic ? 'Pessimista' : 'Mista'}</span>
      </div>
    );
  }

  if (type === 'scope') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${
        isUniversal
          ? 'bg-blue-100 text-blue-800 border-blue-300'
          : isParticular
          ? 'bg-orange-50 text-orange-800 border-orange-300'
          : 'bg-gray-50 text-gray-700 border-gray-300'
      }`}>
        <Globe size={12} />
        <span>{isUniversal ? 'Universal' : isParticular ? 'Particular' : 'Contextual'}</span>
      </div>
    );
  }

  return null;
}
