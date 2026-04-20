# Assets — Documentação Técnica

Esta pasta contém os dois arquivos de dados centrais da aplicação **Pensadores Políticos — Mapa Multidimensional**.

| Arquivo | Papel |
|---|---|
| `meta.json` | Metadados, rótulos, traduções e definição dos eixos analíticos |
| `thinkers.json` | Catálogo completo de pensadores organizados por eras históricas |

---

## Convenção de Keys / Values

Todos os arquivos JSON seguem o mesmo padrão:

- **Keys** → em inglês (padrão de desenvolvimento, estáveis e insensíveis a refatorações de tradução)
- **Values / rótulos de exibição** → em português (conteúdo apresentado ao usuário final)

---

## Estrutura de `meta.json`

```jsonc
{
  "title": "...",        // título da aplicação
  "version": "...",      // versão do schema de dados
  "axes": [...],         // lista dos 7 eixos analíticos com seus valores possíveis
  "tag_labels": {...},   // mapa key → rótulo PT-BR de cada tag
  "dimension_labels": {...}, // mapa id → rótulo PT-BR de cada dimensão
  "field_labels": {...}  // mapa id → rótulo PT-BR de campos do card do pensador
}
```

---

## Estrutura de `thinkers.json`

Cada pensador possui os seguintes campos:

```jsonc
{
  "id": "slug-unico",
  "name": "Nome Completo",
  "years": "AAAA–AAAA",
  "nationality": "Nacionalidade",
  "historical_context": "Breve descrição do contexto histórico",
  "influences": ["Nome1", "Nome2"],
  "impact": "Descrição do legado e impacto",
  "works": [
    { "title": "Título da Obra", "year": AAAA }
  ],
  "dimensions": {
    "freedom_vs_authority": "freedom | authority",
    "state_vs_market": "state | market | community",
    "tradition_vs_rupture": "tradition | rupture",
    "individual_vs_collective": "individual | collective",
    "method": "rational | empirical | dialectic | historical | idealist | realist",
    "anthropology": "optimistic | pessimistic | mixed",
    "scope": "universalist | particularist"
  }
}
```

---

## Os 7 Eixos Analíticos e suas Tags

A seguir, cada eixo é descrito com suas tags, rótulos em português e significado semântico — de forma idêntica ao **Glossário de Dimensões e Tags** exibido na interface da aplicação.

---

### 1 · Liberdade vs. Autoridade (`freedom_vs_authority`)

Eixo que mapeia a **orientação política fundamental** do pensador quanto à relação entre o indivíduo e o poder.

| Key | Rótulo PT-BR | Descrição |
|---|---|---|
| `freedom` | Liberdade | Ênfase na autonomia individual e limitação do poder estatal. |
| `authority` | Autoridade | Valorização da ordem, hierarquia e legitimidade do poder central. |

> **Nota de uso:** Pensadores liberais clássicos (Locke, Mill, Hayek) tendem a `freedom`; pensadores absolutistas ou comunitaristas fortes (Hobbes, De Maistre) tendem a `authority`.

---

### 2 · Estado vs. Mercado (`state_vs_market`)

Eixo que representa a **preferência pela forma de organização econômica e social** — do intervencionismo estatal ao livre mercado, passando por alternativas comunitárias.

| Key | Rótulo PT-BR | Descrição |
|---|---|---|
| `state` | Estado forte | Defesa de um papel ativo e regulador do Estado na economia e sociedade. |
| `market` | Mercado livre | Confiança nos mecanismos de livre mercado e competição econômica. |
| `community` | Comunidade | Foco em formas de organização comunitária e solidariedade local, fora da dicotomia Estado/Mercado. |

> **Nota de uso:** `community` foi adicionado para abarcar pensadores anarquistas, comunitaristas e de tradições não-ocidentais que rejeitam ambos os pólos clássicos.

---

### 3 · Tradição vs. Ruptura (`tradition_vs_rupture`)

Eixo que indica a **atitude do pensador perante a mudança histórica e social**.

| Key | Rótulo PT-BR | Cor de referência na UI | Descrição |
|---|---|---|---|
| `tradition` | Tradição | Azul/céu `#3498db` | Preservação de valores, instituições e práticas estabelecidas. |
| `rupture` | Ruptura | Vermelho intenso `#e74c3c` | Defesa de mudanças radicais e transformação das estruturas vigentes. |

> **Nota de uso:** Este é o eixo com maior carga visual na interface — as cores divergentes (azul × vermelho) sinalizam o espectro conservador × revolucionário de forma intuitiva.

---

### 4 · Individual vs. Coletivo (`individual_vs_collective`)

Eixo que marca o **foco ontológico e ético** do pensador — se o ponto de partida analítico é o sujeito individual ou o grupo social.

| Key | Rótulo PT-BR | Descrição |
|---|---|---|
| `individual` | Individual | Priorização dos direitos e interesses do indivíduo como unidade básica da análise política. |
| `collective` | Coletivo | Ênfase nos interesses do grupo, classe, nação ou comunidade como sujeito central. |

> **Nota de uso:** Diferente do eixo Liberdade/Autoridade (que trata de poder), este eixo trata de **ontologia social** — de onde parte a explicação do mundo político.

---

### 5 · Método (`method`)

Eixo que classifica a **abordagem epistemológica e metodológica** predominante no pensamento do autor. É o eixo com maior granularidade: 6 valores possíveis.

| Key | Rótulo PT-BR | Descrição |
|---|---|---|
| `rational` | Racional | Uso da razão dedutiva e de princípios universais como método central de análise. |
| `empirical` | Empírico | Base na observação, experiência e dados concretos para construir o conhecimento político. |
| `dialectic` | Dialético | Análise por meio de contradições internas e síntese de opostos (associado sobretudo ao marxismo e ao hegelianismo). |
| `historical` | Histórico | Compreensão dos fenômenos políticos pela sua evolução e determinação histórica. |
| `idealist` | Idealista | Primazia das ideias, valores e consciência na explicação e transformação da realidade social. |
| `realist` | Realista | Foco em interesses materiais, poder e relações de força como motores da política. |

> **Nota de uso:** Estes valores **não são mutuamente exclusivos** no mundo real, mas cada pensador recebe apenas **um** valor neste sistema, correspondendo ao método *predominante* identificado pelos historiadores do pensamento político.

---

### 6 · Antropologia Filosófica (`anthropology`)

Eixo que captura a **visão do pensador sobre a natureza humana** — otimista, pessimista ou ambivalente. Esta percepção costuma fundamentar toda a arquitetura do pensamento político subsequente.

| Key | Rótulo PT-BR | Cor de referência na UI | Descrição |
|---|---|---|---|
| `optimistic` | Otimista | Amarelo `#f1c40f` | Visão positiva da natureza humana e da capacidade de progresso moral e político. |
| `pessimistic` | Pessimista | Cinza grafite `#7f8c8d` | Desconfiança quanto à natureza humana; enfatiza a necessidade de controle e freios institucionais. |
| `mixed` | Mista | Padrão neutro `#2c3e50` | Perspectiva equilibrada: reconhece simultaneamente as potencialidades e os limites inerentes ao ser humano. |

> **Nota de uso:** A tag `mixed` foi incorporada na versão atual para acomodar pensadores que resistem à dicotomia binária — como Aristóteles, Tocqueville, Arendt e outros que constroem teorias a partir de tensões internas à natureza humana. Antes desta adição, esses pensadores ficavam sem classificação no filtro de Antropologia.

---

### 7 · Escopo de Aplicação (`scope`)

Eixo que indica o **alcance geográfico-cultural pretendido** pela teoria do pensador — se suas proposições são formuladas como verdades universais ou como respostas a contextos específicos.

| Key | Rótulo PT-BR | Cor de referência na UI | Descrição |
|---|---|---|---|
| `universalist` | Universal | Azul forte `#2980b9` | Princípios formulados como aplicáveis a toda a humanidade, independentemente de contexto histórico ou cultural. |
| `particularist` | Particular | Laranja `#e67e22` | Valorização de contextos específicos, culturas e tradições locais como condição de validade da teoria. |

> **Nota de uso:** Pensadores do jusnaturalismo e do iluminismo tendem a `universalist`; pensadores românticos, nacionalistas, comunitaristas e pós-coloniais tendem a `particularist`.

---

## Resumo rápido de todas as tags (21 valores)

| Key | Rótulo PT-BR | Eixo |
|---|---|---|
| `freedom` | Liberdade | Liberdade vs. Autoridade |
| `authority` | Autoridade | Liberdade vs. Autoridade |
| `state` | Estado forte | Estado vs. Mercado |
| `market` | Mercado livre | Estado vs. Mercado |
| `community` | Comunidade | Estado vs. Mercado |
| `tradition` | Tradição | Tradição vs. Ruptura |
| `rupture` | Ruptura | Tradição vs. Ruptura |
| `individual` | Individual | Individual vs. Coletivo |
| `collective` | Coletivo | Individual vs. Coletivo |
| `rational` | Racional | Método |
| `empirical` | Empírico | Método |
| `dialectic` | Dialético | Método |
| `historical` | Histórico | Método |
| `idealist` | Idealista | Método |
| `realist` | Realista | Método |
| `optimistic` | Otimista | Antropologia Filosófica |
| `pessimistic` | Pessimista | Antropologia Filosófica |
| `mixed` | Mista | Antropologia Filosófica |
| `universalist` | Universal | Escopo de Aplicação |
| `particularist` | Particular | Escopo de Aplicação |

---

## Paleta de cores das tags na interface

As tags recebem destaque visual no componente `DimensionBadge.tsx` e no `TagGlossary.tsx` segundo a seguinte lógica:

| Situação | Cor aplicada |
|---|---|
| Tag `rupture` | Fundo `#e74c3c/10`, texto `#e74c3c` (vermelho) |
| Tag `tradition` | Fundo `#3498db/10`, texto `#3498db` (azul) |
| Demais tags | Fundo `#2c3e50/10`, texto `#2c3e50` (azul marinho) |

A divergência cromática no eixo **Tradição vs. Ruptura** é intencional: sinaliza visualmente o espectro conservador–transformador que é o eixo mais carregado politicamente do sistema.

---

## Adicionando novas tags

Para adicionar uma nova tag ao sistema, é necessário atualizar **três locais**:

1. **`meta.json`** — acrescentar o valor no array `values` do eixo correspondente, e adicionar o par `"key": "Rótulo PT-BR"` no objeto `tag_labels`.
2. **`thinkers.json`** — atribuir o novo valor no campo `dimensions` de cada pensador que se enquadra na tag.
3. **`TagGlossary.tsx`** — adicionar a descrição da nova tag no objeto `tagDescriptions` dentro do componente.

> Manter os três locais sincronizados garante que o glossário, os filtros e os cards dos pensadores exibam informações consistentes.
