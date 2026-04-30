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

  const gridColor  = isDark ? '#2d3748' : '#e5e3df';
  const polyStroke = isDark ? '#4a6fa5' : '#2c3e50';
  const dotFill    = isDark ? '#60a5fa' : '#2c3e50';
  const dotStroke  = isDark ? '#161b27' : '#fff';
  const labelColor = isDark ? '#e2e8f0' : '#2c3e50';
  const valueColor = isDark ? '#64748b' : '#95a5a6';

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {gridPolygons.map(({ points, key }) => (
        <polygon key={key} points={points} fill="none" stroke={gridColor} strokeWidth={1} />
      ))}
      {axisLines.map(({ x1, y1, x2, y2, key }) => (
        <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={gridColor} strokeWidth={1} />
      ))}
      <polygon
        points={dataPoints}
        fill="#3498db"
        fillOpacity={isDark ? 0.25 : 0.35}
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

    const dominantTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    return {
      readCount: readWorks.length,
      thinkerCount: readThinkers.length,
      radarData,
      dominantTags,
      tagCounts,
    };
  }, [thinkers, readWorks, tagLabels]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#161b27] rounded-lg shadow-2xl dark:shadow-black/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
        <div className="sticky top-0 bg-white dark:bg-[#161b27] border-b border-[#e5e3df] dark:border-[#2d3748] p-6 flex items-center justify-between transition-colors duration-300">
          <div>
            <h2 className="font-['Playfair_Display'] text-2xl text-[#1a1a1a] dark:text-[#e2e8f0] mb-1">
              {t('profile.title')}
            </h2>
            <p className="text-sm text-[#7f8c8d] dark:text-[#64748b]">
              {t('profile.based_on', {
                works: analysis?.readCount || 0,
                thinkers: analysis?.thinkerCount || 0,
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2d3748] rounded-lg transition-colors"
          >
            <X size={24} className="text-[#7f8c8d] dark:text-[#64748b]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!analysis || analysis.readCount === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-[#95a5a6] dark:text-[#475569] mb-4" />
              <h3 className="text-lg font-medium text-[#2c3e50] dark:text-[#e2e8f0] mb-2">
                {t('profile.no_works_title')}
              </h3>
              <p className="text-sm text-[#7f8c8d] dark:text-[#64748b]">{t('profile.no_works_hint')}</p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium text-[#7f8c8d] dark:text-[#64748b] mb-4">
                  {t('profile.radar_title')}
                </h3>
                <p className="text-xs text-[#95a5a6] dark:text-[#475569] mb-4">
                  {t('profile.radar_description')}
                </p>
                <div className="flex justify-center py-4">
                  <div style={{ width: 380, height: 380 }}>
                    <CustomRadarChart data={analysis.radarData} isDark={isDark} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#7f8c8d] dark:text-[#64748b] mb-3">
                  {t('profile.dominant_tags')}
                </h3>
                <div className="space-y-2">
                  {analysis.dominantTags.map(({ tag, count }, index) => (
                    <div key={`tag-${tag}-${index}`} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-[#2c3e50] dark:text-[#e2e8f0]">
                            {tagLabels[tag] || tag}
                          </span>
                          <span className="text-xs text-[#7f8c8d] dark:text-[#64748b]">
                            {count}{' '}
                            {count === 1 ? t('profile.work_one') : t('profile.work_other')}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-[#2d3748] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3498db] dark:bg-[#4a6fa5] rounded-full transition-all"
                            style={{ width: `${(count / analysis.thinkerCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                  {t('profile.diagnostic_label')}
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
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
                  className="flex-1 px-4 py-2 bg-[#2c3e50] dark:bg-[#4a6fa5] text-white rounded-lg hover:bg-[#34495e] dark:hover:bg-[#3d5a8a] transition-colors text-sm font-medium"
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

  if (parts.length === 0) return t('diagnostic.balanced');

  return `${t('diagnostic.intro')} ${parts.join(', ')}.`;
}
