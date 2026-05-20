# Revisão Taxonômica: Quebra do Eixo de Método

## Contexto

Na versão original da taxonomia, o eixo **Método** (`method`) concentrava em um único campo seis valores que, na prática, pertencem a planos analíticos distintos. Esta revisão propõe a dissolução desse eixo em três eixos independentes, cada um com responsabilidade semântica própria e bem delimitada.

---

## O Problema com o Eixo Original

O eixo `method` original continha os seguintes valores:

| Key original | Rótulo |
|---|---|
| `rational` | Racional |
| `empirical` | Empírico |
| `dialectic` | Dialético |
| `historical` | Histórico |
| `idealist` | Idealista |
| `realist` | Realista |

À primeira vista, esses seis valores parecem cobrir o espectro metodológico do pensamento político. Mas uma análise mais cuidadosa revela que eles respondem a **perguntas diferentes** sobre o pensador — perguntas que não deveriam competir pelo mesmo slot:

- `rational` e `empirical` respondem: *como o pensador fundamenta seu conhecimento?*
- `idealist` e `realist` respondem: *o que o pensador considera o motor explicativo da realidade política?*
- `historical` e `dialectic` respondem: *qual é a relação do pensador com o tempo e a mudança histórica?*

Forçar essas três dimensões a competir por um único valor cria dois problemas graves:

**Problema 1 — Perda de informação.** Um pensador como Burke é simultaneamente empirista (fundamenta seu conhecimento na experiência concreta) e historicista (compreende a política pela evolução histórica). O eixo único o obrigava a escolher entre `empirical` e `historical`, descartando metade do perfil metodológico.

**Problema 2 — Classificações arbitrárias.** Maquiavel poderia receber `realist` ou `historical` com igual justificativa. A escolha dizia mais sobre o classificador do que sobre o pensador.

---

## As Críticas Específicas a Cada Tag Original

### `rational` — Racional
Funcionalmente correto, mas semanticamente impreciso. Todo filósofo usa a razão; o que distingue os pensadores neste polo é o uso da **razão dedutiva a priori** — princípios universais derivados independentemente da experiência. O termo `racionalista` (em oposição a `empirista`) é o par canônico consagrado pela história da filosofia e evitaria ambiguidade.

### `empirical` — Empírico
O mais limpo dos seis valores originais. A oposição com o racionalismo é clássica, bem estabelecida e intuitiva. Mantido sem alteração na nova versão, apenas renomeado para `empiricist` por consistência morfológica com `rationalist`.

### `dialectic` — Dialético
Funcionalmente correto para capturar Hegel e Marx, mas esconde uma tensão importante: a dialética é simultaneamente um *método lógico* e uma *ontologia histórica*. Na nova estrutura, ela encontra seu lugar mais preciso no eixo de historicidade, onde a progressão a-histórico → historicista → dialético tem lógica interna clara.

### `historical` — Histórico
O mais escorregadio do conjunto original. Todo pensador tem alguma relação com a história; o que especifica essa tag é o uso da história como **método primário de compreensão** — o que a tradição alemã chamou de *Historismus*. O termo `historicist` (historicista) é mais preciso e evita a falsa impressão de que pensadores em outros slots são "a-históricos" por descuido.

### `idealist` — Idealista
Sofre de uma colisão semântica entre dois usos: o filosófico (primazia das ideias sobre a matéria) e o coloquial (ingenuidade utópica). A descrição no documento original aponta para o sentido filosófico correto, mas o rótulo sem contexto pode induzir erro. Na nova estrutura, colocado em oposição explícita a `materialist`, o sentido filosófico fica imediatamente mais claro.

### `realist` — Realista
O mais problemático de todos. "Realismo" é um termo fortemente ocupado no vocabulário das Relações Internacionais (Morgenthau, Waltz, Mearsheimer), onde designa uma escola específica centrada em poder estatal e anarquia internacional. Um usuário que lê `realist` no eixo de método tende a associar ao Realismo de RI — não à ideia mais ampla de "primazia dos interesses materiais e relações de força". A substituição por `materialist` elimina essa colisão e cria simetria filosófica limpa com `idealist`.

---

## A Proposta: Três Eixos Independentes

### Eixo A · Fonte do Conhecimento (`epistemology`)

**Pergunta que responde:** *Como o pensador fundamenta e valida seu conhecimento político?*

| Key | Rótulo PT-BR | Descrição |
|---|---|---|
| `rationalist` | Racionalista | Fundamentação pelo uso da razão dedutiva e princípios universais a priori, independentemente da experiência. |
| `empiricist` | Empirista | Fundamentação pela observação, experiência concreta e dados do mundo real como base do conhecimento político. |

**Exemplos canônicos:**
- `rationalist`: Kant, Rawls, Rousseau (no Contrato Social), Grotius
- `empiricist`: Locke, Hume, Mill, Tocqueville, Montesquieu

**Nota:** Este é o eixo epistemológico clássico da filosofia moderna. A oposição racionalismo/empirismo tem genealogia clara e é ensinada de forma consistente na tradição filosófica ocidental.

---

### Eixo B · Motor da Realidade Política (`ontology`)

**Pergunta que responde:** *O que o pensador considera a força explicativa fundamental da política — ideias ou matéria/poder?*

| Key | Rótulo PT-BR | Descrição |
|---|---|---|
| `idealist` | Idealista | Primazia das ideias, valores, consciência e normas como forças motrizes da realidade política. |
| `materialist` | Materialista | Primazia dos interesses materiais, relações de poder e estruturas concretas como forças motrizes da realidade política. |
| `mixed` | Mista | Reconhecimento simultâneo de forças ideais e materiais como motores da realidade política, sem subordinar um polo ao outro. |

**Exemplos canônicos:**
- `idealist`: Platão, Kant, Habermas, Rousseau
- `materialist`: Maquiavel, Marx, Tucídides, Morgenthau
- `mixed`: Tocqueville, Aristóteles, Arendt, Weber

**Nota:** `materialist` substitui `realist` da versão original. A mudança resolve a colisão com o Realismo de Relações Internacionais e cria uma oposição filosófica mais precisa. Morgenthau, por exemplo, agora pode ser classificado como `materialist` no eixo ontológico e ainda ser discutido como representante do Realismo de RI no conteúdo descritivo — sem que os dois usos se confundam na tag.

`mixed` foi incorporado para acomodar pensadores que resistem à dicotomia binária — e que no sistema anterior ficavam sem classificação adequada ou eram forçados a um polo que os distorcia. Tocqueville é o caso mais evidente: reconhece simultaneamente a força das ideias, crenças e cultura (polo idealista) e a determinação das estruturas sociais e condições materiais de igualdade (polo materialista), sem que um reduza o outro. Weber pertence aqui pela mesma razão — sua tese sobre o ethos protestante e o capitalismo é precisamente sobre a *interação* entre ideias e estrutura material, não sobre a primazia de nenhum dos dois.

---

### Eixo C · Relação com a História (`historicity`)

**Pergunta que responde:** *Como o pensador usa o tempo histórico como ferramenta analítica? A história explica, determina ou transforma a política?*

| Key | Rótulo PT-BR | Descrição |
|---|---|---|
| `ahistorical` | A-histórico | Busca de princípios políticos atemporais e universais, válidos independentemente de contexto histórico. |
| `historicist` | Historicista | Compreensão dos fenômenos políticos pela sua evolução e determinação histórica, sem necessidade de lei universal de movimento. |
| `dialectical` | Dialético | A história se move por contradições internas necessárias que produzem sínteses — a transformação é imanente à própria estrutura da realidade. |

**Exemplos canônicos:**
- `ahistorical`: Kant, Rawls, Grotius, os contratualistas em geral
- `historicist`: Burke, Montesquieu, Tocqueville, o historicismo alemão (Savigny, Ranke)
- `dialectical`: Hegel, Marx, Engels

**Nota:** A progressão dos três valores tem lógica interna clara. O a-histórico busca o eterno; o historicista reconhece que o tempo importa mas não prescreve direção; o dialético afirma que a história tem motor próprio — a contradição — e caminha necessariamente. `dialectical` incorpora e supera `historical` da versão original.

---

## Comparativo Direto: Antes e Depois

| Versão Original | Eixo na Nova Versão | Substituído por |
|---|---|---|
| `rational` | Epistemologia | `rationalist` |
| `empirical` | Epistemologia | `empiricist` |
| `idealist` | Ontologia | `idealist` (mantido) |
| `realist` | Ontologia | `materialist` ⚠️ |
| `historical` | Historicidade | `historicist` |
| `dialectic` | Historicidade | `dialectical` |
| *(ausente)* | Ontologia | `mixed` ✨ |

> ⚠️ **Mudança crítica:** `realist` → `materialist` é a alteração mais significativa. Não é renomeação cosmética — é correção de uma colisão semântica com consequências práticas na classificação de pensadores.

> ✨ **Adição:** `mixed` no eixo ontológico é um valor genuinamente novo, sem equivalente na versão original. Resolve o problema de pensadores que o sistema anterior não conseguia classificar sem distorção.

---

## O que se Ganha: Perfis Combinatórios

Com três eixos independentes, cada pensador recebe **um valor em cada eixo**, produzindo combinações que revelam nuances impossíveis no sistema original:

| Pensador | Epistemologia | Ontologia | Historicidade |
|---|---|---|---|
| **Kant** | `rationalist` | `idealist` | `ahistorical` |
| **Marx** | `empiricist` | `materialist` | `dialectical` |
| **Burke** | `empiricist` | `idealist` | `historicist` |
| **Maquiavel** | `empiricist` | `materialist` | `ahistorical` |
| **Hegel** | `rationalist` | `idealist` | `dialectical` |
| **Tocqueville** | `empiricist` | `mixed` | `historicist` |
| **Weber** | `empiricist` | `mixed` | `historicist` |
| **Aristóteles** | `empiricist` | `mixed` | `ahistorical` |
| **Rawls** | `rationalist` | `idealist` | `ahistorical` |
| **Morgenthau** | `empiricist` | `materialist` | `ahistorical` |

Tocqueville e Weber são os casos mais ilustrativos do valor de `mixed`: ambos constroem teorias que dependem essencialmente da *interação* entre ideias e estrutura material, e classificá-los em qualquer dos polos puros seria uma distorção. Aristóteles aparece aqui por razão diferente — sua teoria da alma e da pólis reconhece tanto a dimensão material (o ser humano como animal político, determinado pela natureza) quanto a dimensão ideal (a virtude como fim e a razão como elemento distintivo).

**Burke** é o caso mais ilustrativo do ganho: no sistema original, ficava preso entre `empirical` e `historical` sem conseguir capturar ambos. Na nova estrutura, `empiricist` + `idealist` + `historicist` descreve com precisão um pensador que parte da experiência concreta, acredita que valores e tradições têm força explicativa real, e compreende a política como produto de evolução histórica — três dimensões simultaneamente verdadeiras e sem contradição entre si.

---

## Resumo das Mudanças

1. O eixo `method` original é **dissolvido** e substituído por três eixos com responsabilidade semântica própria.
2. Os seis valores originais são redistribuídos e em dois casos **renomeados** (`rational` → `rationalist`, `empirical` → `empiricist`) por consistência morfológica.
3. `realist` é **substituído** por `materialist` — a mudança mais substantiva, que elimina colisão semântica com o Realismo de Relações Internacionais.
4. `historical` é **substituído** por `historicist` — mais preciso tecnicamente.
5. `dialectic` passa ao eixo de historicidade como `dialectical`, onde encontra posição mais adequada dentro de uma progressão lógica clara.
6. `mixed` é **adicionado** ao eixo ontológico como valor genuinamente novo — sem equivalente na versão original — para acomodar pensadores que constroem teorias a partir da interação entre forças ideais e materiais, sem subordinar um polo ao outro.
7. A estrutura resultante permite **perfis combinatórios** que revelam nuances impossíveis no sistema original de valor único.