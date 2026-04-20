import { X, HelpCircle } from 'lucide-react';

interface Axis {
  id: string;
  label: string;
  values: string[];
}

interface TagGlossaryProps {
  isOpen: boolean;
  onClose: () => void;
  axes: Axis[];
  tagLabels: Record<string, string>;
}

export function TagGlossary({ isOpen, onClose, axes, tagLabels }: TagGlossaryProps) {
  if (!isOpen) return null;

  const tagDescriptions: Record<string, string> = {
    freedom: "Ênfase na autonomia individual e limitação do poder estatal.",
    authority: "Valorização da ordem, hierarquia e legitimidade do poder central.",
    state: "Defesa de um papel ativo e regulador do Estado na economia e sociedade.",
    market: "Confiança nos mecanismos de livre mercado e competição econômica.",
    community: "Foco em formas de organização comunitária e solidariedade local.",
    tradition: "Preservação de valores, instituições e práticas estabelecidas.",
    rupture: "Defesa de mudanças radicais e transformação das estruturas vigentes.",
    individual: "Priorização dos direitos e interesses do indivíduo.",
    collective: "Ênfase nos interesses do grupo, classe ou nação.",
    rational: "Uso da razão dedutiva e de princípios universais como método.",
    empirical: "Base na observação, experiência e dados concretos.",
    dialectic: "Análise por meio de contradições e síntese de opostos.",
    historical: "Compreensão dos fenômenos pela evolução histórica.",
    idealist: "Primazia das ideias, valores e consciência na transformação social.",
    realist: "Foco em interesses materiais, poder e relações de força.",
    optimistic: "Visão positiva da natureza humana e capacidade de progresso.",
    pessimistic: "Desconfiança quanto à natureza humana e necessidade de controle.",
    mixed: "Perspectiva equilibrada: reconhece potencialidades e limites humanos.",
    universalist: "Princípios aplicáveis a toda humanidade, independente de contexto.",
    particularist: "Valorização de contextos específicos, culturas e tradições locais."
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#e5e3df] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="text-[#2c3e50]" size={24} />
            <h2 className="text-xl font-medium text-[#2c3e50]">Glossário de Dimensões e Tags</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#7f8c8d] hover:text-[#2c3e50] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-[#7f8c8d] mb-6">
            Este glossário explica cada dimensão analítica e suas respectivas tags utilizadas
            no mapeamento dos pensadores políticos.
          </p>

          <div className="space-y-6">
            {axes.map((axis) => (
              <div key={axis.id} className="bg-[#f5f4f0] rounded-lg p-5 border border-[#e5e3df]">
                <h3 className="font-semibold text-[#2c3e50] mb-4 text-lg">
                  {axis.label}
                </h3>
                <div className="space-y-3">
                  {axis.values.map((value) => (
                    <div key={value} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                          value === 'rupture'
                            ? 'bg-[#e74c3c]/10 text-[#e74c3c]'
                            : value === 'tradition'
                            ? 'bg-[#3498db]/10 text-[#3498db]'
                            : 'bg-[#2c3e50]/10 text-[#2c3e50]'
                        }`}>
                          {tagLabels[value] || value}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#34495e]">
                          {tagDescriptions[value] || "Descrição em desenvolvimento."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-900">
              <strong>Dica:</strong> Use os filtros no topo da página para explorar pensadores
              por qualquer combinação dessas dimensões.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
