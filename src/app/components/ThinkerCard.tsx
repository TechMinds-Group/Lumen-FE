import { useState } from 'react';
import { ChevronRight, Download } from 'lucide-react';

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
}

const TAG_COLORS: Record<string, string> = {
  freedom: 'bg-blue-50 text-blue-700 border-blue-200',
  authority: 'bg-red-50 text-red-700 border-red-200',
  state: 'bg-purple-50 text-purple-700 border-purple-200',
  market: 'bg-green-50 text-green-700 border-green-200',
  tradition: 'bg-amber-50 text-amber-800 border-amber-200',
  rupture: 'bg-orange-50 text-orange-700 border-orange-200',
  individual: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  collective: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  rational: 'bg-pink-50 text-pink-700 border-pink-200',
  empirical: 'bg-teal-50 text-teal-700 border-teal-200',
  dialectic: 'bg-violet-50 text-violet-700 border-violet-200',
  historical: 'bg-rose-50 text-rose-700 border-rose-200'
};

export function ThinkerCard({ thinker, tagLabels, dimensionLabels, fieldLabels }: ThinkerCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const influences = thinker.influences || [];
  const impact = thinker.impact || [];
  const works = thinker.works || [];
  const historicalContext = thinker.historical_context || '';

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

        <div className="flex flex-wrap gap-1.5 mb-3">
          {thinker.tags.map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 rounded text-xs border ${TAG_COLORS[tag] || 'bg-gray-50 text-gray-700 border-gray-200'}`}
            >
              {tagLabels[tag] || tag}
            </span>
          ))}
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
          {showDetails ? 'Ocultar detalhes' : 'Ver dimensões e influências'}
        </span>
        <span className="sm:hidden">
          {showDetails ? 'Ocultar' : 'Ver mais'}
        </span>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-[#e5e3df] space-y-3" onClick={(e) => e.stopPropagation()}>
          {historicalContext && (
            <div>
              <div className="text-xs font-medium text-[#7f8c8d] mb-1">
                {fieldLabels.historical_context || 'Contexto Histórico'}
              </div>
              <div className="text-xs sm:text-sm text-[#2c3e50]">{historicalContext}</div>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-[#7f8c8d] mb-2">
              {fieldLabels.dimensions || 'Dimensões'}
            </div>
            <div className="space-y-2">
              {Object.entries(thinker.dimensions).map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="text-[#7f8c8d]">
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
                  {fieldLabels.influences || 'Influências'}
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
                  {fieldLabels.impact || 'Impacto'}
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
              <div className="text-xs font-medium text-[#7f8c8d] mb-2">
                {fieldLabels.works || 'Obras Principais'}
              </div>
              <div className="space-y-1.5">
                {works.map((work, idx) => {
                  const hasValidUrl = work.download_url &&
                    work.download_url.trim() !== '';

                  return (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-[#faf9f7] rounded border border-[#e5e3df] hover:bg-[#f5f4f0] transition-colors">
                      <span className="text-xs text-[#2c3e50] flex-1">{work.title}</span>
                      {hasValidUrl ? (
                        <a
                          href={`https://github.com/Do-nada-ao-tudo/RepoStaticFile/raw/refs/heads/main/politica/${work.download_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 bg-[#2c3e50] text-white rounded text-xs hover:bg-[#34495e] transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download size={12} />
                          <span className="hidden sm:inline">Baixar</span>
                        </a>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs border border-amber-200">
                          <span className="text-[10px]">⚠️</span>
                          <span className="hidden sm:inline">Indisponível</span>
                          <span className="sm:hidden">N/D</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
