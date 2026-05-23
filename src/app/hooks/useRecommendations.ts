import { useMemo } from 'react';

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

interface Gap {
  axis: string;
  underrepresentedTags: string[]; // Pode haver múltiplas tags igualmente sub-representadas
  dominantTag: string;
  dominantPercentage: number;
  underrepresentedPercentage: number;
}

interface Recommendation {
  work: Work;
  thinker: Thinker;
  score: number;
  matchingTags: string[];
  isNewThinker: boolean;
}

// Definição dos eixos com seus polos opostos
const AXIS_POLES: Record<string, string[]> = {
  freedom_vs_authority: ['freedom', 'authority'],
  state_vs_market: ['state', 'market', 'community'],
  tradition_vs_rupture: ['tradition', 'rupture'],
  individual_vs_collective: ['individual', 'collective'],
  epistemology: ['rationalist', 'empiricist'],
  ontology: ['idealist', 'materialist', 'interactionist'],
  historicity: ['ahistorical', 'historicist', 'dialectical'],
  anthropology: ['optimistic', 'pessimistic', 'ambivalent'],
  scope: ['universalist', 'particularist'],
};

const BINARY_THRESHOLD = 0.65;   // 65% para eixos com 2 polos
const TERNARY_THRESHOLD = 0.55;  // 55% para eixos com 3 polos

export function useRecommendations(
  eras: readonly Era[],
  readWorks: ReadWork[]
) {
  const allThinkers = useMemo(
    () => eras.flatMap(era => era.thinkers),
    [eras]
  );

  // Detectar gaps no perfil de leituras
  const gaps = useMemo((): Gap[] => {
    if (readWorks.length < 5) return [];

    // Coletar todas as tags das obras lidas
    const readTags: string[] = [];
    const readThinkerIds = new Set<string>();

    readWorks.forEach(({ thinkerId, workTitle }) => {
      const thinker = allThinkers.find(t => t.id === thinkerId);
      if (thinker) {
        readThinkerIds.add(thinkerId);
        readTags.push(...thinker.tags);
      }
    });

    // Analisar cada eixo
    const detectedGaps: Gap[] = [];

    Object.entries(AXIS_POLES).forEach(([axisId, poles]) => {
      const poleCounts = poles.map(pole => ({
        tag: pole,
        count: readTags.filter(tag => tag === pole).length,
      }));

      const totalInAxis = poleCounts.reduce((sum, p) => sum + p.count, 0);

      // Determinar limiar baseado no número de polos
      const isTernary = poles.length === 3;
      const threshold = isTernary ? TERNARY_THRESHOLD : BINARY_THRESHOLD;

      if (totalInAxis === 0) return; // Eixo sem leituras

      // Avaliar cada polo individualmente para detectar desequilíbrios
      poleCounts.forEach(pole => {
        const percentage = pole.count / totalInAxis;

        if (percentage > threshold) {
          // Encontrar TODAS as tags sub-representadas (não apenas a de menor contagem)
          const otherPoles = poleCounts.filter(p => p.tag !== pole.tag);
          const minCount = Math.min(...otherPoles.map(p => p.count));

          // Todas as tags com a menor contagem estão igualmente sub-representadas
          const underrepresentedTags = otherPoles
            .filter(p => p.count === minCount)
            .map(p => p.tag);

          // Só adicionar gap se ainda não existe gap detectado para este eixo
          // (evita duplicação quando múltiplos polos estão acima do threshold)
          const alreadyDetected = detectedGaps.some(g => g.axis === axisId);
          if (!alreadyDetected) {
            detectedGaps.push({
              axis: axisId,
              dominantTag: pole.tag,
              dominantPercentage: percentage * 100,
              underrepresentedTags,
              underrepresentedPercentage: (minCount / totalInAxis) * 100,
            });
          }
        }
      });
    });

    // Ordenar por severidade (maior desequilíbrio primeiro)
    return detectedGaps.sort(
      (a, b) => b.dominantPercentage - a.dominantPercentage
    );
  }, [readWorks, allThinkers]);

  // Gerar recomendações baseadas nos gaps
  const recommendations = useMemo((): Recommendation[] => {
    if (gaps.length === 0) return [];

    // Coletar TODAS as tags sub-representadas de todos os gaps (pode haver múltiplas por gap)
    const underrepresentedTags = gaps.flatMap(g => g.underrepresentedTags);

    const readThinkerIds = new Set(readWorks.map(rw => rw.thinkerId));
    const readWorkKeys = new Set(
      readWorks.map(rw => `${rw.thinkerId}:${rw.workTitle}`)
    );

    const scoredWorks: Recommendation[] = [];

    allThinkers.forEach(thinker => {
      if (!thinker.works || thinker.works.length === 0) return;

      const isNewThinker = !readThinkerIds.has(thinker.id);

      thinker.works.forEach(work => {
        const workKey = `${thinker.id}:${work.title}`;
        if (readWorkKeys.has(workKey)) return; // Já lida

        const matchingTags = thinker.tags.filter(tag =>
          underrepresentedTags.includes(tag)
        );
        const score = matchingTags.length;

        if (score > 0) {
          scoredWorks.push({
            work,
            thinker,
            score,
            matchingTags,
            isNewThinker,
          });
        }
      });
    });

    // Ordenar: priorizar score alto, depois pensadores novos (nunca lidos)
    return scoredWorks
      .sort((a, b) => {
        // 1º critério: score de complementaridade (maior = melhor)
        if (b.score !== a.score) return b.score - a.score;

        // 2º critério: priorizar pensadores completamente novos
        if (a.isNewThinker !== b.isNewThinker) {
          return a.isNewThinker ? -1 : 1;
        }

        // 3º critério: ordem alfabética do nome do pensador (desempate)
        return a.thinker.name.localeCompare(b.thinker.name);
      })
      .slice(0, 5);
  }, [gaps, allThinkers, readWorks]);

  return {
    gaps: gaps.slice(0, 3), // Máximo 3 gaps no modal
    recommendations,
    hasEnoughData: readWorks.length >= 5,
  };
}
