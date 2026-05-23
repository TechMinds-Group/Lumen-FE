# Lumen — Mapa Multidimensional do Pensamento Político

Dashboard educacional interativo para exploração histórica e filosófica do pensamento político ocidental, mapeando pensadores através de nove eixos analíticos e oferecendo diagnóstico personalizado de perfil de leituras.

![Lumen](https://img.shields.io/badge/React-18-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![i18n](https://img.shields.io/badge/i18n-PT--BR%20|%20EN%20|%20ES-success)

---

## 📖 Sobre o Projeto

**Lumen** é uma ferramenta de mapeamento multidimensional do pensamento político que permite:

- Explorar pensadores desde a Antiguidade até o Contemporâneo
- Analisar posicionamentos através de **9 eixos taxonômicos** (4 políticos + 5 metodológicos)
- Rastrear leituras e visualizar seu perfil político-filosófico personalizado
- Receber recomendações inteligentes para diversificar seu repertório
- Exportar dados de leitura em planilhas Excel estruturadas

O projeto adota uma estética **"Modern Academic"** com tipografia **Playfair Display** (títulos) e **Inter** (corpo), usando uma paleta inspirada em bibliotecas clássicas: Azul Noturno (`#0F1E35`), Ouro Antigo (`#C9A84C`), Prata (`#8A9BB8`) e Pergaminho (`#F2EEE2`).

---

## ✨ Principais Funcionalidades

### 🗺️ Navegação e Filtros
- **7 eras históricas**: Antiguidade, Renascimento/Modernidade, Iluminismo, Século XIX, Virada XIX-XX, Século XX, Contemporâneo
- **Filtros multidimensionais**: combine até 9 eixos analíticos simultaneamente
- **Busca inteligente**: pesquise por nome, obra, tag ou descrição (ignora acentos)
- **Duas visões**: alterne entre "Pensadores" e "Obras"

### 📊 Taxonomia de 9 Eixos Analíticos

**Eixos Políticos:**
1. **Liberdade vs. Autoridade** — autonomia individual vs. ordem hierárquica
2. **Estado vs. Mercado vs. Comunidade** — papel regulador, livre mercado ou organização comunitária
3. **Tradição vs. Ruptura** — preservação vs. transformação radical
4. **Individual vs. Coletivo** — direitos individuais vs. bem comum

**Eixos Metodológicos:**
5. **Epistemologia** — Racionalista (razão dedutiva) vs. Empiricista (experiência concreta)
6. **Ontologia** — Idealista (ideias como motor) vs. Materialista (forças materiais) vs. Interacionista (síntese)
7. **Historicidade** — A-histórico (princípios atemporais) vs. Historicista (evolução histórica) vs. Dialético (contradições imanentes)

**Outros Eixos:**
8. **Antropologia Filosófica** — Otimista vs. Pessimista vs. Ambivalente (quanto à natureza humana)
9. **Escopo de Aplicação** — Universalista (princípios gerais) vs. Particularista (contextos específicos)

### 📚 Rastreamento de Leituras
- Marque obras como lidas (persistência em `localStorage`)
- Progresso visual por era e pensador
- Filtro "Apenas Lidas" para revisar seu histórico
- Contador global de obras lidas

### 🎯 Diagnóstico Político Personalizado
- **Radar Chart** em SVG puro com 9 dimensões
- **Barras segmentadas** por eixo (políticos e metodológicos)
- **Tags dominantes** extraídas das suas leituras
- **Diagnóstico textual** em linguagem natural

### 💡 Recomendações Inteligentes
- Detecta **gaps** (desequilíbrios > 55%/65% por eixo)
- Sugere obras que **complementam** seu perfil
- Prioriza pensadores completamente novos
- Scoring por compatibilidade (Alta/Média)

### 📥 Exportação de Dados
- Formato `.xlsx` (Excel) com 3 abas:
  - **Obras**: lista completa com status de leitura
  - **Por Pensador**: agrupamento por autor
  - **Progresso por Era**: estatísticas por período

### 🌍 Internacionalização (i18n)
- **PT-BR** (Português Brasileiro)
- **EN** (English)
- **ES** (Español)
- Seletor de idioma com bandeiras na sidebar

### 🌗 Dark Mode
- Toggle persistente (light/dark)
- Paleta adaptada para acessibilidade
- Transições suaves entre temas

---

## 🛠️ Tecnologias Utilizadas

- **React 18** — biblioteca de componentes
- **TypeScript** — tipagem estática
- **Tailwind CSS v4** — estilização utilitária
- **i18next** + **react-i18next** — internacionalização
- **Lucide React** — ícones modernos
- **SheetJS (xlsx)** — exportação de planilhas
- **Vite** — bundler e dev server

---

## 📁 Estrutura do Projeto

```
/workspaces/default/code/
├── assets/
│   ├── eras/                    # JSONs dos pensadores por era (7 arquivos)
│   ├── meta.json                # Metadados (labels, eixos, descrições)
│   └── thinkers.ts              # Agregador dos 7 JSONs
├── src/
│   ├── app/
│   │   ├── components/          # Componentes React
│   │   │   ├── ThinkerCard.tsx
│   │   │   ├── BookListView.tsx
│   │   │   ├── PoliticalProfile.tsx
│   │   │   ├── RecommendationsModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DimensionBadge.tsx
│   │   │   ├── TagGlossary.tsx
│   │   │   └── WorkCheckbox.tsx
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx # Dark mode
│   │   ├── hooks/
│   │   │   ├── useReadingProgress.ts  # localStorage de leituras
│   │   │   └── useRecommendations.ts  # Detecção de gaps + scoring
│   │   ├── utils/
│   │   │   ├── tagColors.ts           # Paleta de cores por tag
│   │   │   ├── exportWorks.ts         # Exportação Excel
│   │   │   └── normalizeText.ts       # Busca sem acentos
│   │   ├── i18n.ts              # Configuração i18next
│   │   └── App.tsx              # Componente raiz
│   ├── locales/                 # Traduções (pt-BR, en, es)
│   └── styles/
│       ├── theme.css            # Tokens CSS customizados
│       └── fonts.css            # Importação de fontes
└── README.md                    # Este arquivo
```

---

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+
- pnpm (gerenciador de pacotes)

### Instalação
```bash
pnpm install
```

### Desenvolvimento
```bash
# O Vite dev server já está rodando automaticamente
# Não execute `npm run dev` ou `vite` manualmente
```

### Build
```bash
# ATENÇÃO: Este NÃO é um setup Vite padrão
# Não execute `vite build` — ele falhará neste ambiente
```

---

## 📊 Formato dos Dados

### Estrutura de um Pensador (JSON)
```json
{
  "id": "maquiavel",
  "name": "Maquiavel",
  "period": "1469–1527",
  "description": "Realismo político: o poder como é, não como deveria ser.",
  "tags": ["authority", "state", "rupture", "individual", "empiricist", "materialist"],
  "dimensions": {
    "freedom_vs_authority": "Autoridade: descrição...",
    "state_vs_market": "Estado forte: descrição...",
    "epistemology": "Empírica histórica: descrição...",
    "ontology": "Materialista: descrição...",
    "historicity": "Historicista: descrição...",
    "anthropology": "Pessimista: descrição...",
    "scope": "Particularista: descrição..."
  },
  "historical_context": "Contexto histórico...",
  "influences": ["Políbio", "Lívio"],
  "impact": ["Hobbes", "Realismo político"],
  "works": [
    { "title": "O Príncipe", "download_url": "principe.pdf" }
  ]
}
```

### Tags Disponíveis
```typescript
// Eixos políticos
"freedom" | "authority" | "state" | "market" | "community" | 
"tradition" | "rupture" | "individual" | "collective"

// Eixos metodológicos
"rationalist" | "empiricist" | "idealist" | "materialist" | "interactionist" |
"ahistorical" | "historicist" | "dialectical"

// Outros eixos
"optimistic" | "pessimistic" | "ambivalent" |
"universalist" | "particularist"
```

---

## 🎨 Paleta de Cores

### Light Mode
- **Background**: `#F2EEE2` (Pergaminho)
- **Surface**: `#FFFFFF`
- **Primary**: `#0F1E35` (Azul Noturno)
- **Accent**: `#C9A84C` (Ouro Antigo)
- **Muted**: `#8A9BB8` (Prata)

### Dark Mode
- **Background**: `#090F1C`
- **Surface**: `#0F1E35` (Azul Noturno)
- **Primary**: `#EDE8D8`
- **Accent**: `#C9A84C` (Ouro Antigo)
- **Muted**: `#687280`

---

## 🧭 Roadmap

- [ ] Migração manual dos dados para a nova taxonomia de 9 eixos
- [ ] Adicionar pensadores do Renascimento/Modernidade (Hobbes, Locke, Spinoza, etc.)
- [ ] Sistema de anotações por obra
- [ ] Comparação lado a lado entre pensadores
- [ ] Exportação de gráficos em PDF
- [ ] PWA com funcionamento offline

---

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

---

## 👨‍💻 Créditos

Desenvolvido com **Claude Sonnet 4.5** através da plataforma **Figma Make**.

Tipografia: **Playfair Display** (Google Fonts) + **Inter** (Google Fonts)

Ícones: **Lucide React**

---

**Lumen** — *Iluminando os caminhos do pensamento político*
