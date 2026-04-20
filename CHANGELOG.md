# Changelog - Mapa Multidimensional de Pensadores Políticos

## v2.0 - Expansão de Dimensões Analíticas

### Novas Dimensões Adicionadas

#### 1. **Antropologia Filosófica** (`anthropology`)
Avalia a visão do pensador sobre a natureza humana:
- **Otimista** (`optimistic`): Acredita no potencial humano para cooperação, virtude e progresso moral
- **Pessimista** (`pessimistic`): Vê a natureza humana como tendente ao conflito, necessitando contenção
- **Mista**: Visão contextual - natureza moldável pelo ambiente social

**Exemplos:**
- Otimistas: Locke, Rousseau, Kropotkin
- Pessimistas: Hobbes, Maquiavel, Nietzsche

#### 2. **Escopo de Aplicação** (`scope`)
Define o alcance geográfico/cultural das teorias:
- **Universalista** (`universalist`): Princípios aplicáveis a toda humanidade
- **Particularista** (`particularist`): Respeito a tradições e contextos locais específicos
- **Contextual**: Princípios universais com adaptações particulares

**Exemplos:**
- Universalistas: Kant, Rawls, Habermas
- Particularistas: Burke, Scruton, Confúcio

### Refinamento de Eixos Existentes

#### Estado vs. Mercado - Zona Central Adicionada
- **Estado forte**: Planejamento centralizado
- **Comunidade** (`community`): Associativismo, federalismo, cooperativas (zona intermediária)
- **Mercado livre**: Descentralização econômica

#### Método - Novas Categorias
Além de Racional, Empírico, Dialético e Histórico:
- **Idealista** (`idealist`): Normativo, baseado em princípios e valores a priori
- **Realista** (`realist`): Pragmático, baseado em como o poder realmente opera

**Exemplos:**
- Idealistas: Platão, Kant, Rawls, Hegel
- Realistas: Maquiavel, Hobbes, Nietzsche, Sun Tzu

### Melhorias Visuais

#### Sistema de Cores Refinado
- **Tradição**: Tons de azul/céu (estabilidade, continuidade)
- **Ruptura**: Tons de vermelho intenso (alerta, transformação)
- **Método Racional/Empírico**: Bordas com peso médio para destaque
- **Novas dimensões**: Paleta específica para antropologia e escopo

#### Layout de Dimensões
- Grid de 2 colunas para melhor escaneabilidade
- Total de 7 eixos organizados hierarquicamente
- Badges visuais com ícones para antropologia (User) e escopo (Globe)

### Componentes Criados

1. **DimensionBadge.tsx**: Componente visual para exibir antropologia e escopo com ícones
2. Atualização do **ThinkerCard.tsx**: Grid de 2 colunas para dimensões
3. Atualização do **Header.tsx**: Suporte para filtros de 3+ valores (Estado/Mercado/Comunidade)

### Estrutura de Dados

**meta.json v2.0:**
- 7 eixos (5 originais + 2 novos)
- 20 labels de tags
- 7 labels de dimensões

**thinkers.json:**
- Todas as entradas incluem `anthropology` e `scope` nas dimensões
- Tags expandidas com novos valores (idealist, realist, optimistic, pessimistic, universalist, particularist)

### Breaking Changes
- Versão do meta.json atualizada para `2.0`
- Estrutura de dimensões expandida (requer migração de dados antigos)
