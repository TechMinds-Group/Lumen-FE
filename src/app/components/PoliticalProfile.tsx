import { useMemo } from 'react';
import { BookOpen, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import type { TFunction } from 'i18next';

interface Thinker {
  id: string;
  name: string;
  tags: string[];
  dimensions: Record<string, string>;
}

interface ReadWork {
  thinkerId: string;
  workTitle: string;
}

interface PoliticalProfileProps {
  thinkers: Thinker[];
  readWorks: ReadWork[];
  tagLabels: Record<string, string>;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface RadarDataPoint {
  label: string;
  value: number;
}

// Political axes with segmented bar colors — full class names for Tailwind scanning
const POLITICAL_AXES = [
  {
    key: 'freedom_vs_authority',
    tags: [
      { key: 'freedom',   barClass: 'bg-blue-400 dark:bg-blue-500',    dotClass: 'bg-blue-400 dark:bg-blue-500',    textClass: 'text-blue-700 dark:text-blue-300'    },
      { key: 'authority', barClass: 'bg-red-400 dark:bg-red-500',      dotClass: 'bg-red-400 dark:bg-red-500',      textClass: 'text-red-700 dark:text-red-300'      },
    ],
  },
  {
    key: 'state_vs_market',
    tags: [
      { key: 'state',     barClass: 'bg-purple-400 dark:bg-purple-500', dotClass: 'bg-purple-400 dark:bg-purple-500', textClass: 'text-purple-700 dark:text-purple-300' },
      { key: 'market',    barClass: 'bg-green-400 dark:bg-green-500',   dotClass: 'bg-green-400 dark:bg-green-500',   textClass: 'text-green-700 dark:text-green-300'   },
      { key: 'community', barClass: 'bg-emerald-400 dark:bg-emerald-500', dotClass: 'bg-emerald-400 dark:bg-emerald-500', textClass: 'text-emerald-700 dark:text-emerald-300' },
    ],
  },
  {
    key: 'tradition_vs_rupture',
    tags: [
      { key: 'tradition', barClass: 'bg-sky-400 dark:bg-sky-500',      dotClass: 'bg-sky-400 dark:bg-sky-500',      textClass: 'text-sky-800 dark:text-sky-300'      },
      { key: 'rupture',   barClass: 'bg-red-500 dark:bg-red-600',      dotClass: 'bg-red-500 dark:bg-red-600',      textClass: 'text-red-800 dark:text-red-300'      },
    ],
  },
  {
    key: 'individual_vs_collective',
    tags: [
      { key: 'individual', barClass: 'bg-cyan-400 dark:bg-cyan-500',   dotClass: 'bg-cyan-400 dark:bg-cyan-500',    textClass: 'text-cyan-700 dark:text-cyan-300'    },
      { key: 'collective', barClass: 'bg-indigo-400 dark:bg-indigo-500', dotClass: 'bg-indigo-400 dark:bg-indigo-500', textClass: 'text-indigo-700 dark:text-indigo-300' },
    ],
  },
] as const;

// Static color config for methodological axis bars — full class names for Tailwind scanning
const METHOD_AXES = [
  {
    key: 'epistemology',
    tags: [
      {
        key: 'rationalist',
        barClass: 'bg-pink-400 dark:bg-pink-500',
        dotClass: 'bg-pink-400 dark:bg-pink-500',
        textClass: 'text-pink-700 dark:text-pink-300',
      },
      {
        key: 'empiricist',
        barClass: 'bg-teal-400 dark:bg-teal-500',
        dotClass: 'bg-teal-400 dark:bg-teal-500',
        textClass: 'text-teal-700 dark:text-teal-300',
      },
    ],
  },
  {
    key: 'ontology',
    tags: [
      {
        key: 'idealist',
        barClass: 'bg-purple-400 dark:bg-purple-500',
        dotClass: 'bg-purple-400 dark:bg-purple-500',
        textClass: 'text-purple-700 dark:text-purple-300',
      },
      {
        key: 'materialist',
        barClass: 'bg-amber-400 dark:bg-amber-500',
        dotClass: 'bg-amber-400 dark:bg-amber-500',
        textClass: 'text-amber-700 dark:text-amber-300',
      },
      {
        key: 'interactionist',
        barClass: 'bg-slate-300 dark:bg-slate-500',
        dotClass: 'bg-slate-300 dark:bg-slate-500',
        textClass: 'text-slate-600 dark:text-slate-300',
      },
    ],
  },
  {
    key: 'historicity',
    tags: [
      {
        key: 'ahistorical',
        barClass: 'bg-stone-300 dark:bg-stone-500',
        dotClass: 'bg-stone-300 dark:bg-stone-500',
        textClass: 'text-stone-600 dark:text-stone-300',
      },
      {
        key: 'historicist',
        barClass: 'bg-rose-400 dark:bg-rose-500',
        dotClass: 'bg-rose-400 dark:bg-rose-500',
        textClass: 'text-rose-700 dark:text-rose-300',
      },
      {
        key: 'dialectical',
        barClass: 'bg-violet-400 dark:bg-violet-500',
        dotClass: 'bg-violet-400 dark:bg-violet-500',
        textClass: 'text-violet-700 dark:text-violet-300',
      },
    ],
  },
] as const;

function CustomRadarChart({ data, isDark }: { data: RadarDataPoint[]; isDark: boolean }) {
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 120;
  const levels = 5;
  const n = data.length;

  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, r: number) => {
    const angle = startAngle + index * angleStep;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const r = (radius / levels) * (i + 1);
    const points = Array.from({ length: n }, (_, j) => {
      const p = getPoint(j, r);
      return `${p.x},${p.y}`;
    }).join(' ');
    return { points, key: `grid-level-${i}` };
  });

  const axisLines = Array.from({ length: n }, (_, i) => {
    const p = getPoint(i, radius);
    return { x1: cx, y1: cy, x2: p.x, y2: p.y, key: `axis-line-${i}` };
  });

  const dataPoints = data
    .map((d, i) => {
      const r = (d.value / 100) * radius;
      const p = getPoint(i, r);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const labelPadding = 28;
  const labels = data.map((d, i) => {
    const p = getPoint(i, radius + labelPadding);
    let anchor: 'start' | 'end' | 'middle' = 'middle';
    const dx = p.x - cx;
    if (dx > 10) anchor = 'start';
    else if (dx < -10) anchor = 'end';
    return { ...p, label: d.label, anchor, key: `label-${i}`, value: d.value };
  });

  const gridColor  = isDark ? '#1C2E44' : '#DDD7C8';
  const polyStroke = isDark ? '#C9A84C' : '#0F1E35';
  const dotFill    = isDark ? '#D8B85A' : '#C9A84C';
  const dotStroke  = isDark ? '#0F1E35' : '#fff';
  const labelColor = isDark ? '#EDE8D8' : '#0D1B2A';
  const valueColor = isDark ? '#687280' : '#6A6355';

  const padX = 64;
  const padY = 28;

  return (
    <svg
      width="100%"
      viewBox={`-${padX} -${padY} ${size + padX * 2} ${size + padY * 2}`}
      style={{ overflow: 'visible' }}
    >
      {gridPolygons.map(({ points, key }) => (
        <polygon key={key} points={points} fill="none" stroke={gridColor} strokeWidth={1} />
      ))}
      {axisLines.map(({ x1, y1, x2, y2, key }) => (
        <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={gridColor} strokeWidth={1} />
      ))}
      <polygon
        points={dataPoints}
        fill="#C9A84C"
        fillOpacity={isDark ? 0.20 : 0.12}
        stroke={polyStroke}
        strokeWidth={2}
      />
      {data.map((d, i) => {
        const r = (d.value / 100) * radius;
        const p = getPoint(i, r);
        return (
          <circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={dotFill}
            stroke={dotStroke}
            strokeWidth={1.5}
          />
        );
      })}
      {labels.map(({ x, y, label, anchor, key, value }) => (
        <g key={key}>
          <text
            x={x}
            y={y - 6}
            textAnchor={anchor}
            dominantBaseline="middle"
            fill={labelColor}
            fontSize={11}
            fontWeight={500}
            fontFamily="Inter, sans-serif"
          >
            {label}
          </text>
          <text
            x={x}
            y={y + 6}
            textAnchor={anchor}
            dominantBaseline="middle"
            fill={valueColor}
            fontSize={9}
            fontFamily="Inter, sans-serif"
          >
            {Math.round(value)}%
          </text>
        </g>
      ))}
    </svg>
  );
}

export function PoliticalProfile({
  thinkers,
  readWorks,
  tagLabels,
  onClear,
  isOpen,
  onClose,
}: PoliticalProfileProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const analysis = useMemo(() => {
    if (readWorks.length === 0) return null;

    const readThinkerIds = new Set(readWorks.map(w => w.thinkerId));
    const readThinkers = thinkers.filter(t => readThinkerIds.has(t.id));

    const tagCounts: Record<string, number> = {};
    readThinkers.forEach(thinker => {
      thinker.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const radarTags = [
      'freedom', 'authority', 'state', 'market', 'community',
      'individual', 'collective', 'tradition', 'rupture',
    ];

    const maxCount = Math.max(...Object.values(tagCounts), 1);

    const radarData: RadarDataPoint[] = radarTags.map(tag => ({
      label: tagLabels[tag] || tag,
      value: ((tagCounts[tag] || 0) / maxCount) * 100,
    }));

    return {
      readCount: readWorks.length,
      thinkerCount: readThinkers.length,
      radarData,
      tagCounts,
    };
  }, [thinkers, readWorks, tagLabels]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0F1E35] rounded-lg shadow-2xl dark:shadow-black/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
        <div className="sticky top-0 bg-white dark:bg-[#0F1E35] border-b border-[#DDD7C8] dark:border-[#1C2E44] p-6 flex items-center justify-between transition-colors duration-300">
          <div>
            <h2 className="font-['Playfair_Display'] text-2xl text-[#0D1B2A] dark:text-[#EDE8D8] mb-1">
              {t('profile.title')}
            </h2>
            <p className="text-sm text-[#6A6355] dark:text-[#687280]">
              {t('profile.based_on', {
                works: analysis?.readCount || 0,
                thinkers: analysis?.thinkerCount || 0,
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#ECE7DA] dark:hover:bg-[#1C2E44] rounded-lg transition-colors"
          >
            <X size={24} className="text-[#6A6355] dark:text-[#687280]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!analysis || analysis.readCount === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-[#8A8275] dark:text-[#4A5E72] mb-4" />
              <h3 className="text-lg font-medium text-[#0F1E35] dark:text-[#EDE8D8] mb-2">
                {t('profile.no_works_title')}
              </h3>
              <p className="text-sm text-[#6A6355] dark:text-[#687280]">{t('profile.no_works_hint')}</p>
            </div>
          ) : (
            <>
              {/* Political inclination radar */}
              <div>
                <h3 className="text-sm font-medium text-[#6A6355] dark:text-[#687280] mb-1">
                  {t('profile.radar_title')}
                </h3>
                <p className="text-xs text-[#8A8275] dark:text-[#4A5E72] mb-4">
                  {t('profile.radar_description')}
                </p>
                <div className="flex justify-center py-4">
                  <div style={{ width: '100%', maxWidth: 420 }}>
                    <CustomRadarChart data={analysis.radarData} isDark={isDark} />
                  </div>
                </div>
              </div>

              {/* Methodological profile — 3 new axes */}
              <div className="border-t border-[#DDD7C8] dark:border-[#1C2E44] pt-6">
                <h3 className="text-sm font-medium text-[#6A6355] dark:text-[#687280] mb-1">
                  {t('profile.methodological_title')}
                </h3>
                <p className="text-xs text-[#8A8275] dark:text-[#4A5E72] mb-5">
                  {t('profile.methodological_description')}
                </p>
                <div className="space-y-5">
                  {METHOD_AXES.map(axis => {
                    const axisTotal = axis.tags.reduce(
                      (sum, tag) => sum + (analysis.tagCounts[tag.key] || 0),
                      0,
                    );
                    return (
                      <div key={axis.key}>
                        <div className="text-xs font-medium text-[#0F1E35] dark:text-[#EDE8D8] mb-2">
                          {t(`axes.${axis.key}`)}
                        </div>
                        {/* Segmented bar */}
                        <div className="flex h-2.5 rounded-full overflow-hidden gap-px bg-[#ECE7DA] dark:bg-[#1C2E44]">
                          {axisTotal === 0 ? (
                            <div className="h-full w-full bg-[#DDD7C8] dark:bg-[#1C2E44] rounded-full" />
                          ) : (
                            axis.tags.map(tag => {
                              const count = analysis.tagCounts[tag.key] || 0;
                              const width = (count / axisTotal) * 100;
                              if (width === 0) return null;
                              return (
                                <div
                                  key={tag.key}
                                  className={`h-full transition-all ${tag.barClass}`}
                                  style={{ width: `${width}%` }}
                                />
                              );
                            })
                          )}
                        </div>
                        {/* Legend */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
                          {axis.tags.map(tag => {
                            const count = analysis.tagCounts[tag.key] || 0;
                            const pct = axisTotal > 0 ? Math.round((count / axisTotal) * 100) : 0;
                            return (
                              <div key={tag.key} className="flex items-center gap-1.5 text-xs">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tag.dotClass}`} />
                                <span className="text-[#6A6355] dark:text-[#687280]">
                                  {tagLabels[tag.key] || tag.key}
                                </span>
                                <span className={`font-medium tabular-nums ${tag.textClass}`}>
                                  {count}
                                  <span className="font-normal text-[#8A8275] dark:text-[#4A5E72] ml-1.5">
                                    ({pct}%)
                                  </span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Political axes — segmented bars, same pattern as methodological profile */}
              <div className="border-t border-[#DDD7C8] dark:border-[#1C2E44] pt-6">
                <h3 className="text-sm font-medium text-[#6A6355] dark:text-[#687280] mb-5">
                  {t('profile.dominant_tags')}
                </h3>
                <div className="space-y-5">
                  {POLITICAL_AXES.map(axis => {
                    const axisTotal = axis.tags.reduce(
                      (sum, tag) => sum + (analysis.tagCounts[tag.key] || 0),
                      0,
                    );
                    return (
                      <div key={axis.key}>
                        <div className="text-xs font-medium text-[#0F1E35] dark:text-[#EDE8D8] mb-2">
                          {t(`axes.${axis.key}`)}
                        </div>
                        <div className="flex h-2.5 rounded-full overflow-hidden gap-px bg-[#ECE7DA] dark:bg-[#1C2E44]">
                          {axisTotal === 0 ? (
                            <div className="h-full w-full bg-[#DDD7C8] dark:bg-[#1C2E44] rounded-full" />
                          ) : (
                            axis.tags.map(tag => {
                              const count = analysis.tagCounts[tag.key] || 0;
                              const width = (count / axisTotal) * 100;
                              if (width === 0) return null;
                              return (
                                <div
                                  key={tag.key}
                                  className={`h-full transition-all ${tag.barClass}`}
                                  style={{ width: `${width}%` }}
                                />
                              );
                            })
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
                          {axis.tags.map(tag => {
                            const count = analysis.tagCounts[tag.key] || 0;
                            const pct = axisTotal > 0 ? Math.round((count / axisTotal) * 100) : 0;
                            return (
                              <div key={tag.key} className="flex items-center gap-1.5 text-xs">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tag.dotClass}`} />
                                <span className="text-[#6A6355] dark:text-[#687280]">
                                  {tagLabels[tag.key] || tag.key}
                                </span>
                                <span className={`font-medium tabular-nums ${tag.textClass}`}>
                                  {count}
                                  <span className="font-normal text-[#8A8275] dark:text-[#4A5E72] ml-1.5">
                                    ({pct}%)
                                  </span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Diagnostic */}
              <div className="bg-[#0F1E35]/6 dark:bg-[#C9A84C]/10 border border-[#0F1E35]/15 dark:border-[#C9A84C]/25 rounded-lg p-4">
                <h3 className="text-sm font-medium text-[#0F1E35] dark:text-[#D8B85A] mb-2">
                  {t('profile.diagnostic_label')}
                </h3>
                <p className="text-sm text-[#1A2E4A] dark:text-[#C9A84C] leading-relaxed">
                  {getDiagnostic(analysis.tagCounts, t)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClear}
                  className="flex-1 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                >
                  {t('profile.clear_all')}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-[#0F1E35] dark:bg-[#C9A84C] text-white dark:text-[#0F1E35] rounded-lg hover:bg-[#1A2E4A] dark:hover:bg-[#D8B85A] transition-colors text-sm font-medium"
                >
                  {t('profile.continue_reading')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getDiagnostic(
  tagCounts: Record<string, number>,
  t: TFunction
): string {
  const total = Object.values(tagCounts).reduce((sum, count) => sum + count, 0);
  if (total === 0) return t('diagnostic.start');

  const pct: Record<string, number> = {};
  Object.entries(tagCounts).forEach(([tag, count]) => {
    pct[tag] = (count / total) * 100;
  });

  const parts: string[] = [];

  // Political axes
  if ((pct.freedom || 0) > (pct.authority || 0)) {
    parts.push(t('diagnostic.tendency_freedom'));
  } else if ((pct.authority || 0) > (pct.freedom || 0)) {
    parts.push(t('diagnostic.tendency_authority'));
  }

  if ((pct.state || 0) > (pct.market || 0)) {
    parts.push(t('diagnostic.preference_state'));
  } else if ((pct.market || 0) > (pct.state || 0)) {
    parts.push(t('diagnostic.preference_market'));
  }

  if ((pct.community || 0) > 15) {
    parts.push(t('diagnostic.community_value'));
  }

  if ((pct.tradition || 0) > (pct.rupture || 0)) {
    parts.push(t('diagnostic.tradition_value'));
  } else if ((pct.rupture || 0) > (pct.tradition || 0)) {
    parts.push(t('diagnostic.rupture_value'));
  }

  if ((pct.individual || 0) > (pct.collective || 0)) {
    parts.push(t('diagnostic.individual_focus'));
  } else if ((pct.collective || 0) > (pct.individual || 0)) {
    parts.push(t('diagnostic.collective_focus'));
  }

  // Epistemology axis
  const rationalistN  = tagCounts.rationalist  || 0;
  const empiricistN   = tagCounts.empiricist   || 0;
  if (rationalistN + empiricistN > 0) {
    if (rationalistN > empiricistN) {
      parts.push(t('diagnostic.epistemology_rationalist'));
    } else if (empiricistN > rationalistN) {
      parts.push(t('diagnostic.epistemology_empiricist'));
    }
  }

  // Ontology axis
  const idealistN    = tagCounts.idealist    || 0;
  const materialistN = tagCounts.materialist || 0;
  const interactionistN = tagCounts.interactionist || 0;
  const ontologyTotal = idealistN + materialistN + interactionistN;
  if (ontologyTotal > 0) {
    if (idealistN >= materialistN && idealistN >= interactionistN && idealistN > 0) {
      parts.push(t('diagnostic.ontology_idealist'));
    } else if (materialistN >= idealistN && materialistN >= interactionistN && materialistN > 0) {
      parts.push(t('diagnostic.ontology_materialist'));
    } else if (interactionistN > 0) {
      parts.push(t('diagnostic.ontology_interactionist'));
    }
  }

  // Historicity axis
  const ahistoricalN  = tagCounts.ahistorical  || 0;
  const historicistN  = tagCounts.historicist  || 0;
  const dialecticalN  = tagCounts.dialectical  || 0;
  const historicityTotal = ahistoricalN + historicistN + dialecticalN;
  if (historicityTotal > 0) {
    if (dialecticalN >= historicistN && dialecticalN >= ahistoricalN && dialecticalN > 0) {
      parts.push(t('diagnostic.historicity_dialectical'));
    } else if (historicistN >= dialecticalN && historicistN >= ahistoricalN && historicistN > 0) {
      parts.push(t('diagnostic.historicity_historicist'));
    } else if (ahistoricalN > 0) {
      parts.push(t('diagnostic.historicity_ahistorical'));
    }
  }

  if (parts.length === 0) return t('diagnostic.balanced');

  return `${t('diagnostic.intro')} ${parts.join(', ')}.`;
}
