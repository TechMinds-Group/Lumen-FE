import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRecommendations } from '../hooks/useRecommendations';

interface Work {
  title: string;
  download_url: string;
}

interface Thinker {
  id: string;
  name: string;
  period: string;
  tags: string[];
  works?: Work[];
}

interface Era {
  id: string;
  label: string;
  thinkers: Thinker[];
}

interface ReadWork {
  thinkerId: string;
  workTitle: string;
}

interface RecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eras: readonly Era[];
  readWorks: ReadWork[];
  tagLabels: Record<string, string>;
  axisLabels: Record<string, string>;
}

export function RecommendationsModal({
  isOpen,
  onClose,
  eras,
  readWorks,
  tagLabels,
  axisLabels,
}: RecommendationsModalProps) {
  const { t } = useTranslation();
  const { gaps, recommendations, hasEnoughData } = useRecommendations(eras, readWorks);

  if (!isOpen) return null;

  if (!hasEnoughData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#0F1E35] border border-[#DDD7C8] dark:border-[#1C2E44] rounded-xl max-w-md w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-[#0D1B2A] dark:text-[#EDE8D8]">
              {t('recommendations.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-[#6A6355] dark:text-[#687280] hover:text-[#0D1B2A] dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-[#6A6355] dark:text-[#687280]">
            {t('recommendations.insufficient_data')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0F1E35] border border-[#DDD7C8] dark:border-[#1C2E44] rounded-xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#DDD7C8] dark:border-[#1C2E44]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[17px] font-medium text-[#0D1B2A] dark:text-[#EDE8D8] mb-1">
                {t('recommendations.title')}
              </h2>
              <p className="text-xs text-[#6A6355] dark:text-[#687280]">
                {gaps.length === 1
                  ? t('recommendations.subtitle_one', {
                      works: readWorks.length,
                      gaps: gaps.length,
                    })
                  : t('recommendations.subtitle_other', {
                      works: readWorks.length,
                      gaps: gaps.length,
                    })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#6A6355] dark:text-[#687280] hover:text-[#0D1B2A] dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Gaps detectados */}
          {gaps.length > 0 && (
            <div className="bg-[#eab740]/7 dark:bg-[#eab740]/7 border border-[#eab740]/20 dark:border-[#eab740]/20 rounded-lg p-4">
              <p className="text-[11px] uppercase tracking-wider font-medium text-[#a0896b] dark:text-[#a0896b] mb-3">
                {t('recommendations.gaps_detected')}
              </p>
              <div className="space-y-3">
                {gaps.map((gap, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-[#0D1B2A] dark:text-[#EDE8D8]">
                        {axisLabels[gap.axis] || gap.axis}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-[#6A6355] dark:text-[#687280]">
                        <span>
                          {tagLabels[gap.dominantTag]}{' '}
                          <span className="font-medium text-[#eab740]">
                            {Math.round(gap.dominantPercentage)}%
                          </span>
                        </span>
                        <span className="opacity-50">·</span>
                        <span>
                          {gap.underrepresentedTags.map(tag => tagLabels[tag]).join(', ')}{' '}
                          <span className="font-medium">
                            {Math.round(gap.underrepresentedPercentage)}%
                          </span>
                        </span>
                      </div>
                    </div>
                    {/* Barra de progresso */}
                    <div className="h-1.5 bg-[#DDD7C8] dark:bg-[#1C2E44] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#eab740] rounded-full transition-all"
                        style={{ width: `${gap.dominantPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendações */}
          {recommendations.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wider font-medium text-[#6A6355] dark:text-[#687280] mb-3">
                {t('recommendations.suggested_readings')}
              </p>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F7F3EA] dark:bg-[#131E30] border border-[#DDD7C8] dark:border-[#1C2E44] rounded-lg p-4 hover:border-[#eab740]/30 dark:hover:border-[#eab740]/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#0D1B2A] dark:text-[#EDE8D8] mb-1">
                          {rec.work.title}
                        </h3>
                        <p className="text-xs text-[#6A6355] dark:text-[#687280]">
                          {rec.thinker.name} · {rec.thinker.period}
                        </p>
                      </div>
                      {/* Badge de compatibilidade */}
                      <span
                        className={`shrink-0 text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 rounded ${
                          rec.score >= 3
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20'
                        }`}
                      >
                        {rec.score >= 3
                          ? t('recommendations.high_compatibility')
                          : t('recommendations.medium_compatibility')}
                      </span>
                    </div>

                    {/* Justificativa */}
                    <p className="text-xs text-[#6A6355] dark:text-[#9ca3af] leading-relaxed mb-3">
                      {t('recommendations.justification', {
                        tags: rec.matchingTags
                          .map(tag => tagLabels[tag])
                          .join(', '),
                      })}
                    </p>

                    {/* Tags que justificam */}
                    <div className="flex flex-wrap gap-1.5">
                      {rec.matchingTags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-[#ba7517]/15 dark:bg-[#ba7517]/15 border border-[#ba7517]/30 dark:border-[#ba7517]/30 text-[#eab840] dark:text-[#eab840]"
                        >
                          {tagLabels[tag]}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.length === 0 && gaps.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-[#6A6355] dark:text-[#687280]">
                {t('recommendations.no_recommendations')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
