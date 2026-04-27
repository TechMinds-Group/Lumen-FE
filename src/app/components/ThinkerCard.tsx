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
  freedom:      'bg-blue-50 text-blue-700 border-blue-200',
  authority:    'bg-red-50 text-red-700 border-red-200',
  state:        'bg-purple-50 text-purple-700 border-purple-200',
  market:       'bg-green-50 text-green-700 border-green-200',
  community:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  tradition:    'bg-sky-50 text-sky-800 border-sky-300',
  rupture:      'bg-red-100 text-red-800 border-red-300',
  individual:   'bg-cyan-50 text-cyan-700 border-cyan-200',
  collective:   'bg-indigo-50 text-indigo-700 border-indigo-200',
  rational:     'bg-pink-50 text-pink-700 border-pink-300 font-medium',
  empirical:    'bg-teal-50 text-teal-700 border-teal-300 font-medium',
  dialectic:    'bg-violet-50 text-violet-700 border-violet-200',
  historical:   'bg-rose-50 text-rose-700 border-rose-200',
  idealist:     'bg-purple-50 text-purple-800 border-purple-300 font-medium',
  realist:      'bg-gray-100 text-gray-800 border-gray-400 font-medium',
  optimistic:   'bg-yellow-50 text-yellow-800 border-yellow-300',
  pessimistic:  'bg-slate-100 text-slate-800 border-slate-400',
  universalist: 'bg-blue-100 text-blue-800 border-blue-300',
  particularist:'bg-orange-50 text-orange-800 border-orange-300',
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

  // Resolve badge tag keys from the thinker's tag array
  const anthropologyTag = thinker.tags.find(tag => ANTHROPOLOGY_TAGS.has(tag));
  const scopeTag        = thinker.tags.find(tag => SCOPE_TAGS.has(tag));

  const readCount = works.filter(w => isWorkRead(thinker.id, w.title)).length;

  return (
    <div
      onClick={() => setShowDetails(!showDetails)}
      className="bg-white border border-[#e5e3df] rounded p-4 lg:p-5 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="mb-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-2">
          <span className="text-xs text-[#7f8c8d]">{thinker.period}</span>
          <h3 className="font-['Playfair_Display'] text-lg sm:text-xl text-[#1a1a1a]">
            {thinker.name}
          </h3>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map(tag => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded text-xs border ${
                  TAG_COLORS[tag] || 'bg-gray-50 text-gray-700 border-gray-200'
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

        <p className="text-sm text-[#4a4a4a] leading-relaxed">
          {thinker.description}
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs text-[#2c3e50] group-hover:text-[#34495e] transition-colors">
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
          className="mt-4 pt-4 border-t border-[#e5e3df] space-y-3"
          onClick={e => e.stopPropagation()}
        >
          {historicalContext && (
            <div>
              <div className="text-xs font-medium text-[#7f8c8d] mb-1">
                {fieldLabels.historical_context || t('fields.historical_context')}
              </div>
              <div className="text-xs sm:text-sm text-[#2c3e50]">{historicalContext}</div>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-[#7f8c8d] mb-2">
              {fieldLabels.dimensions || t('fields.dimensions')}
            </div>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(thinker.dimensions)
                .filter(([key]) => key !== 'anthropology' && key !== 'scope')
                .map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-[#7f8c8d] font-medium">
                      {dimensionLabels[key] || key.replace(/_/g, ' ')}:
                    </span>{' '}
                    <span className="text-[#2c3e50]">{value}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {influences.length > 0 && (
              <div>
                <div className="text-xs font-medium text-[#7f8c8d] mb-1.5">
                  {fieldLabels.influences || t('fields.influences')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {influences.map((inf, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700"
                    >
                      {inf}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {impact.length > 0 && (
              <div>
                <div className="text-xs font-medium text-[#7f8c8d] mb-1.5">
                  {fieldLabels.impact || t('fields.impact')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {impact.slice(0, 3).map((imp, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-green-50 border border-green-200 rounded text-xs text-green-700"
                    >
                      {imp}
                    </span>
                  ))}
                  {impact.length > 3 && (
                    <span className="px-1.5 py-0.5 text-xs text-[#7f8c8d]">
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
                <div className="text-xs font-medium text-[#7f8c8d]">
                  {fieldLabels.works || t('fields.works')}
                </div>
                <div className="text-xs text-emerald-600 font-medium">
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
