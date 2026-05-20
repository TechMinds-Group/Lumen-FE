import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DimensionBadge } from './DimensionBadge';
import { WorkCheckbox } from './WorkCheckbox';
import { TAG_COLORS, TAG_COLOR_FALLBACK } from '../utils/tagColors';

interface Work {
  title: string;
  download_url: string;
}

interface Thinker {
  id: string;
  name: string;
  period: string;
  description: string;
  tags: string[];
  dimensions: Record<string, string>;
  historical_context?: string;
  influences?: string[];
  impact?: string[];
  works?: Work[];
}

interface ThinkerCardProps {
  thinker: Thinker;
  tagLabels: Record<string, string>;
  dimensionLabels: Record<string, string>;
  fieldLabels: Record<string, string>;
  isWorkRead: (thinkerId: string, workTitle: string) => boolean;
  onToggleWork: (thinkerId: string, workTitle: string) => void;
}


// Tags rendered as DimensionBadges — excluded from the inline tag list
const ALWAYS_BADGE_TAGS = new Set(['optimistic', 'pessimistic', 'ambivalent', 'universalist', 'particularist']);

export function ThinkerCard({
  thinker,
  tagLabels,
  dimensionLabels,
  fieldLabels,
  isWorkRead,
  onToggleWork,
}: ThinkerCardProps) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  const influences      = thinker.influences || [];
  const impact          = thinker.impact || [];
  const works           = thinker.works || [];
  const historicalContext = thinker.historical_context || '';

  const ANTHROPOLOGY_TAGS = new Set(['optimistic', 'pessimistic', 'ambivalent']);
  const SCOPE_TAGS = new Set(['universalist', 'particularist']);

  const anthropologyTag = thinker.tags.find(tag => ANTHROPOLOGY_TAGS.has(tag));
  const scopeTag        = thinker.tags.find(tag => SCOPE_TAGS.has(tag));

  const visibleTags = [...new Set(thinker.tags.filter(tag => !ALWAYS_BADGE_TAGS.has(tag)))];

  const readCount = works.filter(w => isWorkRead(thinker.id, w.title)).length;

  return (
    <div
      onClick={() => setShowDetails(!showDetails)}
      className="bg-white dark:bg-[#0F1E35] border border-[#DDD7C8] dark:border-[#1C2E44] rounded p-4 lg:p-5 hover:shadow-md dark:hover:shadow-black/40 transition-all cursor-pointer group"
    >
      <div className="mb-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-2">
          <span className="text-xs text-[#6A6355] dark:text-[#687280]">{thinker.period}</span>
          <h3 className="font-['Playfair_Display'] text-lg sm:text-xl text-[#0D1B2A] dark:text-[#EDE8D8]">
            {thinker.name}
          </h3>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map(tag => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded text-xs border ${
                  TAG_COLORS[tag] || TAG_COLOR_FALLBACK
                }`}
              >
                {tagLabels[tag] || tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {anthropologyTag && (
              <DimensionBadge type="anthropology" tagKey={anthropologyTag} />
            )}
            {scopeTag && (
              <DimensionBadge type="scope" tagKey={scopeTag} />
            )}
          </div>
        </div>

        <p className="text-sm text-[#2A2420] dark:text-[#A8B8C8] leading-relaxed">
          {thinker.description}
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs text-[#0F1E35] dark:text-[#687280] group-hover:text-[#1A2E4A] dark:group-hover:text-[#A8B8C8] transition-colors">
        <ChevronRight
          size={14}
          className={`transition-transform ${showDetails ? 'rotate-90' : ''}`}
        />
        <span className="hidden sm:inline">
          {showDetails ? t('thinker_card.hide_details') : t('thinker_card.show_details')}
        </span>
        <span className="sm:hidden">
          {showDetails ? t('thinker_card.hide') : t('thinker_card.show_more')}
        </span>
      </div>

      {showDetails && (
        <div
          className="mt-4 pt-4 border-t border-[#DDD7C8] dark:border-[#1C2E44] space-y-3"
          onClick={e => e.stopPropagation()}
        >
          {historicalContext && (
            <div>
              <div className="text-xs font-medium text-[#6A6355] dark:text-[#687280] mb-1">
                {fieldLabels.historical_context || t('fields.historical_context')}
              </div>
              <div className="text-xs sm:text-sm text-[#0F1E35] dark:text-[#A8B8C8]">{historicalContext}</div>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-[#6A6355] dark:text-[#687280] mb-2">
              {fieldLabels.dimensions || t('fields.dimensions')}
            </div>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(thinker.dimensions)
                .map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-[#6A6355] dark:text-[#687280] font-medium">
                      {dimensionLabels[key] || key.replace(/_/g, ' ')}:
                    </span>{' '}
                    <span className="text-[#0F1E35] dark:text-[#A8B8C8]">{value}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {influences.length > 0 && (
              <div>
                <div className="text-xs font-medium text-[#6A6355] dark:text-[#687280] mb-1.5">
                  {fieldLabels.influences || t('fields.influences')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {influences.map((inf, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-[#0F1E35]/8 dark:bg-[#C9A84C]/12 border border-[#0F1E35]/20 dark:border-[#C9A84C]/30 rounded text-xs text-[#0F1E35] dark:text-[#D8B85A]"
                    >
                      {inf}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {impact.length > 0 && (
              <div>
                <div className="text-xs font-medium text-[#6A6355] dark:text-[#687280] mb-1.5">
                  {fieldLabels.impact || t('fields.impact')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {impact.slice(0, 3).map((imp, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-700 dark:text-emerald-300"
                    >
                      {imp}
                    </span>
                  ))}
                  {impact.length > 3 && (
                    <span className="px-1.5 py-0.5 text-xs text-[#6A6355] dark:text-[#687280]">
                      +{impact.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {works.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-[#6A6355] dark:text-[#687280]">
                  {fieldLabels.works || t('fields.works')}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {t('thinker_card.read_count_of', { read: readCount, total: works.length })}
                </div>
              </div>
              <div className="space-y-1.5">
                {works.map((work, idx) => (
                  <WorkCheckbox
                    key={idx}
                    work={work}
                    isRead={isWorkRead(thinker.id, work.title)}
                    onToggle={() => onToggleWork(thinker.id, work.title)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}