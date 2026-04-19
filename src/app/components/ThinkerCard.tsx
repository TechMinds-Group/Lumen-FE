import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface Thinker {
  id: string;
  nome: string;
  periodo: string;
  descricao: string;
  tags: string[];
  dimensoes: Record<string, string>;
  contexto_historico?: string;
  contextohistorico?: string;
  influencias_recebidas?: string[];
  influenciasrecebidas?: string[];
  herdeiros_e_impacto?: string[];
  herdeiroseimpacto?: string[];
  obras_principais?: string[];
  obrasprincipais?: string[];
}

interface ThinkerCardProps {
  thinker: Thinker;
  tagLabels: Record<string, string>;
}

const TAG_COLORS: Record<string, string> = {
  liberdade: 'bg-blue-50 text-blue-700 border-blue-200',
  autoridade: 'bg-red-50 text-red-700 border-red-200',
  estado: 'bg-purple-50 text-purple-700 border-purple-200',
  mercado: 'bg-green-50 text-green-700 border-green-200',
  tradicao: 'bg-amber-50 text-amber-800 border-amber-200',
  ruptura: 'bg-orange-50 text-orange-700 border-orange-200',
  individual: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  coletivo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  racional: 'bg-pink-50 text-pink-700 border-pink-200',
  empirico: 'bg-teal-50 text-teal-700 border-teal-200',
  dialetico: 'bg-violet-50 text-violet-700 border-violet-200',
  historico: 'bg-rose-50 text-rose-700 border-rose-200'
};

export function ThinkerCard({ thinker, tagLabels }: ThinkerCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const influencias = thinker.influencias_recebidas || thinker.influenciasrecebidas || [];
  const herdeiros = thinker.herdeiros_e_impacto || thinker.herdeiroseimpacto || [];
  const obras = thinker.obras_principais || thinker.obrasprincipais || [];
  const contexto = thinker.contexto_historico || thinker.contextohistorico || '';

  return (
    <div
      onClick={() => setShowDetails(!showDetails)}
      className="bg-white border border-[#e5e3df] rounded p-4 lg:p-5 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="mb-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-2">
          <span className="text-xs text-[#7f8c8d]">{thinker.periodo}</span>
          <h3 className="font-['Playfair_Display'] text-lg sm:text-xl text-[#1a1a1a]">
            {thinker.nome}
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
          {thinker.descricao}
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
        <div className="mt-4 pt-4 border-t border-[#e5e3df] space-y-3">
          {contexto && (
            <div>
              <div className="text-xs font-medium text-[#7f8c8d] mb-1">Contexto Histórico</div>
              <div className="text-xs sm:text-sm text-[#2c3e50]">{contexto}</div>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-[#7f8c8d] mb-2">Dimensões</div>
            <div className="space-y-2">
              {Object.entries(thinker.dimensoes).map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="text-[#7f8c8d]">
                    {key.replace(/_/g, ' ').replace(/vs/g, 'vs.')}:
                  </span>{' '}
                  <span className="text-[#2c3e50]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {influencias.length > 0 && (
              <div>
                <div className="text-xs font-medium text-[#7f8c8d] mb-1.5">Influências</div>
                <div className="flex flex-wrap gap-1">
                  {influencias.map((inf, idx) => (
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

            {herdeiros.length > 0 && (
              <div>
                <div className="text-xs font-medium text-[#7f8c8d] mb-1.5">Impacto</div>
                <div className="flex flex-wrap gap-1">
                  {herdeiros.slice(0, 3).map((her, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-green-50 border border-green-200 rounded text-xs text-green-700"
                    >
                      {her}
                    </span>
                  ))}
                  {herdeiros.length > 3 && (
                    <span className="px-1.5 py-0.5 text-xs text-[#7f8c8d]">
                      +{herdeiros.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {obras.length > 0 && (
            <div>
              <div className="text-xs font-medium text-[#7f8c8d] mb-1.5">Obras Principais</div>
              <ul className="text-xs text-[#2c3e50] space-y-0.5">
                {obras.slice(0, 3).map((obra, idx) => (
                  <li key={idx}>• {obra}</li>
                ))}
                {obras.length > 3 && (
                  <li className="text-[#7f8c8d]">+{obras.length - 3} obras</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
