import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BookOpen, X } from 'lucide-react';

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

export function PoliticalProfile({
  thinkers,
  readWorks,
  tagLabels,
  onClear,
  isOpen,
  onClose
}: PoliticalProfileProps) {
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

    const axes = [
      { key: 'freedom_vs_authority', positive: 'freedom', negative: 'authority', label: 'Liberdade vs Autoridade' },
      { key: 'state_vs_market', positive: 'market', negative: 'state', label: 'Mercado vs Estado' },
      { key: 'tradition_vs_rupture', positive: 'rupture', negative: 'tradition', label: 'Ruptura vs Tradição' },
      { key: 'individual_vs_collective', positive: 'individual', negative: 'collective', label: 'Individual vs Coletivo' }
    ];

    const radarData = axes.map((axis, index) => {
      const positiveCount = tagCounts[axis.positive] || 0;
      const negativeCount = tagCounts[axis.negative] || 0;
      const total = positiveCount + negativeCount;

      const score = total > 0 ? ((positiveCount / total) * 100) : 50;

      return {
        id: axis.key,
        axis: axis.label,
        value: score,
        fullMark: 100
      };
    });

    const dominantTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    return {
      readCount: readWorks.length,
      thinkerCount: readThinkers.length,
      radarData,
      dominantTags,
      tagCounts
    };
  }, [thinkers, readWorks]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#e5e3df] p-6 flex items-center justify-between">
          <div>
            <h2 className="font-['Playfair_Display'] text-2xl text-[#1a1a1a] mb-1">
              Perfil de Inclinação Política
            </h2>
            <p className="text-sm text-[#7f8c8d]">
              Baseado em {analysis?.readCount || 0} obras lidas de {analysis?.thinkerCount || 0} pensadores
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-[#7f8c8d]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!analysis || analysis.readCount === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-[#95a5a6] mb-4" />
              <h3 className="text-lg font-medium text-[#2c3e50] mb-2">
                Nenhuma obra marcada ainda
              </h3>
              <p className="text-sm text-[#7f8c8d]">
                Marque as obras que você já leu para visualizar seu perfil político
              </p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium text-[#7f8c8d] mb-4">
                  Mapa de Inclinações
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={analysis.radarData}>
                    <PolarGrid stroke="#e5e3df" />
                    <PolarAngleAxis
                      dataKey="axis"
                      tick={{ fill: '#7f8c8d', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e3df',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => `${value.toFixed(1)}%`}
                    />
                    <Radar
                      name="Inclinação"
                      dataKey="value"
                      stroke="#2c3e50"
                      fill="#3498db"
                      fillOpacity={0.6}
                      isAnimationActive={false}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#7f8c8d] mb-3">
                  Tags Dominantes em Suas Leituras
                </h3>
                <div className="space-y-2">
                  {analysis.dominantTags.map(({ tag, count }, index) => (
                    <div key={`tag-${tag}-${index}`} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-[#2c3e50]">
                            {tagLabels[tag] || tag}
                          </span>
                          <span className="text-xs text-[#7f8c8d]">
                            {count} {count === 1 ? 'obra' : 'obras'}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3498db] rounded-full transition-all"
                            style={{ width: `${(count / analysis.thinkerCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  💡 Diagnóstico
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {getDiagnostic(analysis.tagCounts, tagLabels)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClear}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  Limpar Todas as Leituras
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] transition-colors text-sm font-medium"
                >
                  Continuar Lendo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getDiagnostic(tagCounts: Record<string, number>, tagLabels: Record<string, string>): string {
  const total = Object.values(tagCounts).reduce((sum, count) => sum + count, 0);
  if (total === 0) return 'Comece marcando as obras que você já leu!';

  const percentages: Record<string, number> = {};
  Object.entries(tagCounts).forEach(([tag, count]) => {
    percentages[tag] = (count / total) * 100;
  });

  const diagnostics: string[] = [];

  if (percentages.freedom > percentages.authority) {
    diagnostics.push('tendência liberal e valorização da autonomia individual');
  } else if (percentages.authority > percentages.freedom) {
    diagnostics.push('inclinação para a ordem estabelecida e autoridade');
  }

  if (percentages.state > percentages.market) {
    diagnostics.push('preferência por intervenção estatal');
  } else if (percentages.market > percentages.state) {
    diagnostics.push('valorização do mercado livre');
  }

  if (percentages.tradition > percentages.rupture) {
    diagnostics.push('respeito à tradição e mudança gradual');
  } else if (percentages.rupture > percentages.tradition) {
    diagnostics.push('abertura à ruptura e transformação');
  }

  if (diagnostics.length === 0) {
    return 'Suas leituras mostram um equilíbrio interessante entre diferentes perspectivas políticas.';
  }

  return `Sua biblioteca reflete ${diagnostics.join(', ')}.`;
}
