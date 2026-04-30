import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DimensionBadge } from './DimensionBadge';
import { WorkCheckbox } from './WorkCheckbox';

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

const TAG_COLORS: Record<string, string> = {
  freedom:      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  authority:    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  state:        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
  market:       'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
  community:    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
  tradition:    'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700',
  rupture:      'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  individual:   'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700',
  collective:   'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700',
  rational:     'bg-pink-50 text-pink-700 border-pink-300 font-medium dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
  empirical:    'bg-teal-50 text-teal-700 border-teal-300 font-medium dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',
  dialectic:    'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700',
  historical:   'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700',
  idealist:     'bg-purple-50 text-purple-800 border-purple-300 font-medium dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
  realist:      'bg-gray-100 text-gray-800 border-gray-400 font-medium dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-500',
  optimistic:   'bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
  pessimistic:  'bg-slate-100 text-slate-800 border-slate-400 dark:bg-slate-700/50 dark:text-slate-200 dark:border-slate-500',
  universalist: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  particularist:'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
};

// Tags rendered as DimensionBadge — excluded from the inline tag list
const DIMENSION_BADGE_TAGS = new Set([
  'optimistic', 'pessimistic', 'mixed', 'universalist', 'particularist',
]);

const ANTHROPOLOGY_TAGS = new Set(['optimistic', 'pessimistic', 'mixed']);
const SCOPE_TAGS        = new Set(['universalist', 'particularist']);

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

  const visibleTags = thinker.tags.filter(tag => !DIMENSION_BADGE_TAGS.has(tag));

  const anthropologyTag = thinker.tags.find(tag => ANTHROPOLOGY_TAGS.has(tag));
  const scopeTag        = thinker.tags.find(tag => SCOPE_TAGS.has(tag));

  const readCount = works.filter(w => isWorkRead(thinker.id, w.title)).length;

  return (
    <div
      onClick={() => setShowDetails(!showDetails)}
      className="bg-white dark:bg-[#161b27] border border-[#e5e3df] dark:border-[#2d3748] rounded p-4 lg:p-5 hover:shadow-md dark:hover:shadow-black/30 transition-all cursor-pointer group"
    >
      <div className="mb-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-2">
          <span className="text-xs text-[#7f8c8d] dark:text-[#64748b]">{thinker.period}</span>
          <h3 className="font-['Playfair_Display'] text-lg sm:text-xl text-[#1a1a1a] dark:text-[#e2e8f0]">
            {thinker.name}
          </h3>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map(tag => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded text-xs border ${
                  TAG_COLORS[tag] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600'
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

        <p className="text-sm text-[#4a4a4a] dark:text-[#94a3b8] leading-relaxed">
          {thinker.description}
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs text-[#2c3e50] dark:text-[#64748b] group-hover:text-[#34495e] dark:group-hover:text-[#94a3b8] transition-colors">
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
          className="mt-4 pt-4 border-t border-[#e5e3df] dark:border-[#2d3748] space-y-3"
          onClick={e => e.stopPropagation()}
        >
          {historicalContext && (
            <div>
              <div className="text-xs font-medium text-[#7f8c8d] dark:text-[#64748b] mb-1">
                {fieldLabels.historical_context || t('fields.historical_context')}
              </div>
              <div className="text-xs sm:text-sm text-[#2c3e50] dark:text-[#94a3b8]">{historicalContext}</div>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-[#7f8c8d] dark:text-[#64748b] mb-2">
              {fieldLabels.dimensions || t('fields.dimensions')}
            </div>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(thinker.dimensions)
                .filter(([key]) => key !== 'anthropology' && key !== 'scope')
                .map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-[#7f8c8d] dark:text-[#64748b] font-medium">
                      {dimensionLabels[key] || key.replace(/_/g, ' ')}:
                    </span>{' '}
                    <span className="text-[#2c3e50] dark:text-[#94a3b8]">{value}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {influences.length > 0 && (
              <div>
                <div className="text-xs font-medium text-[#7f8c8d] dark:text-[#64748b] mb-1.5">
                  {fieldLabels.influences || t('fields.influences')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {influences.map((inf, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300"
                    >
                      {inf}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {impact.length > 0 && (
              <div>
                <div className="text-xs font-medium text-[#7f8c8d] dark:text-[#64748b] mb-1.5">
                  {fieldLabels.impact || t('fields.impact')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {impact.slice(0, 3).map((imp, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-xs text-green-700 dark:text-green-300"
                    >
                      {imp}
                    </span>
                  ))}
                  {impact.length > 3 && (
                    <span className="px-1.5 py-0.5 text-xs text-[#7f8c8d] dark:text-[#64748b]">
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
                <div className="text-xs font-medium text-[#7f8c8d] dark:text-[#64748b]">
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
