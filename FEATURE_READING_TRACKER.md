# Feature: Rastreador de Leituras e Diagnóstico Político

## Visão Geral

Transforma o Mapa Multidimensional em uma ferramenta interativa de autoconhecimento político baseada em leituras. O usuário marca quais obras já leu e recebe um diagnóstico de sua inclinação política em tempo real.

## Componentes Criados

### 1. `useReadingProgress` Hook
**Localização:** `src/app/hooks/useReadingProgress.tsx`

Gerencia o estado persistente das obras lidas:
- Armazena dados no `localStorage`
- Interface `ReadWork`: `{ thinkerId, workTitle, timestamp }`
- Métodos:
  - `toggleWork(thinkerId, workTitle)` - Marca/desmarca obra
  - `isWorkRead(thinkerId, workTitle)` - Verifica se lida
  - `clearAll()` - Limpa todo progresso

### 2. `WorkCheckbox` Component
**Localização:** `src/app/components/WorkCheckbox.tsx`

Checkbox estilizado para cada obra:
- **Estado default**: Fundo bege, borda cinza
- **Estado checked**: Fundo verde esmeralda, check branco, borda verde
- **Micro-interações**:
  - Hover suave na borda (transição de cor)
  - Ícone de check com strokeWidth=3 para destaque
- Mantém botão "Baixar" ou badge "Indisponível"

### 3. `PoliticalProfile` Component
**Localização:** `src/app/components/PoliticalProfile.tsx`

Modal fullscreen com análise agregada:

#### Layout
- **Header sticky**: Título, contador de obras/pensadores, botão fechar
- **Radar Chart**: Visualização de 4 eixos principais
  - Liberdade vs Autoridade
  - Mercado vs Estado  
  - Ruptura vs Tradição
  - Individual vs Coletivo
- **Barras de Tags Dominantes**: Top 5 tags com percentual
- **Card de Diagnóstico**: Texto dinâmico baseado em algoritmo

#### Algoritmo de Diagnóstico
```javascript
// Calcula percentual de cada tag
percentages[tag] = (count / total) * 100

// Compara pares de eixos
if (percentages.freedom > percentages.authority)
  → "tendência liberal e valorização da autonomia"
else
  → "inclinação para ordem e autoridade"

// Combina diagnósticos
"Sua biblioteca reflete {diagnostics.join(', ')}."
```

#### Gráfico Radar
- Biblioteca: `recharts`
- Configuração:
  - `PolarGrid` com stroke cinza claro
  - `PolarAngleAxis` com labels pequenas
  - `Radar` com fill azul 60% opacidade
  - Tooltip customizado

## Modificações em Componentes Existentes

### `ThinkerCard.tsx`
**Alterações:**
1. Nova prop: `isWorkRead`, `onToggleWork`
2. Substituiu lista estática por `<WorkCheckbox />`
3. Contador "X/Y lidas" ao lado do título "Obras Principais"
4. Feedback visual verde quando obra marcada

### `Header.tsx`
**Novos controles:**
1. **Toggle "Apenas Lidas"**
   - Botão verde quando ativo
   - Ícone: `BookCheck`
   - Filtra pensadores com pelo menos 1 obra lida

2. **Botão "Ver Perfil (N)"**
   - Aparece quando `totalReadWorks > 0`
   - Fundo azul, ícone `BarChart3`
   - Abre modal `PoliticalProfile`

### `App.tsx`
**Integrações:**
1. Hook `useReadingProgress()` inicializado
2. Estados: `showOnlyRead`, `profileOpen`
3. Lógica de filtro estendida:
```javascript
const matchesReadFilter = !showOnlyRead ||
  (thinker.works && thinker.works.some(w => isWorkRead(thinker.id, w.title)))
```
4. Contador por era:
```javascript
{era.thinkers.reduce((sum, t) => {
  return sum + t.works?.filter(w => isWorkRead(t.id, w.title)).length || 0
}, 0)}/{era.thinkers.reduce((sum, t) => sum + (t.works?.length || 0), 0)} obras lidas
```

## Fluxo de Uso

1. **Usuário navega pelos pensadores**
2. **Expande detalhes de um autor**
3. **Marca obras lidas** → Estado persiste no localStorage
4. **Contador atualiza** em tempo real (header e cards)
5. **Clica "Ver Perfil (N)"** → Modal abre
6. **Visualiza radar + diagnóstico**
7. **Opções:**
   - "Limpar Todas as Leituras" (vermelho)
   - "Continuar Lendo" (azul, fecha modal)

## Persistência de Dados

### LocalStorage Schema
```json
{
  "political-thinkers-read-works": [
    {
      "thinkerId": "platao",
      "workTitle": "A República",
      "timestamp": 1713564800000
    },
    ...
  ]
}
```

### Vantagens
- Sem backend necessário
- Dados persistem entre sessões
- Fácil export/import futuro
- Privacy-friendly (dados locais)

## Estilos e Cores Semânticas

### Obras Lidas
- **Verde esmeralda** (`emerald-50/600`): Progresso positivo
- **Check icon**: Branco em fundo verde escuro
- **Contador**: Texto verde médio

### Diagnóstico
- **Fundo azul claro**: Informação neutra
- **Radar**: Azul `#3498db` com opacidade 60%

### Botões de Ação
- **Ver Perfil**: Azul `blue-600`
- **Apenas Lidas**: Verde `emerald-600` quando ativo
- **Limpar**: Vermelho `red-50/700` (ação destrutiva)

## Métricas Calculadas

### Por Pensador
- `readCount / totalWorks` (X/Y lidas)

### Por Era
- Soma de obras lidas de todos pensadores da era

### Global (Modal)
- Total de obras lidas
- Total de pensadores distintos lidos
- Percentual de cada tag
- Inclinação nos 4 eixos principais

## Melhorias Futuras

1. **Export de dados**: Botão para baixar JSON do progresso
2. **Sugestões de leitura**: Baseado em gaps no perfil
3. **Timeline de leituras**: Visualização cronológica
4. **Comparação com grupos**: "Sua biblioteca vs. média dos usuários"
5. **Badges de conquista**: "Leu todos os clássicos", "Explorador de eras", etc.
6. **Gráfico de evolução**: Como perfil muda ao longo do tempo

## Compatibilidade

- ✅ Responsivo (mobile/desktop)
- ✅ localStorage disponível em todos navegadores modernos
- ✅ Graceful degradation (se JS disabled, checkboxes não funcionam)
- ✅ Acessibilidade: Labels, aria-labels, keyboard navigation
