# Especificação para Codex — Soul’s Remnant Build Planner

## 1. Objetivo geral

Criar uma **página web completa de planejamento e otimização de builds para Soul’s Remnant**, baseada principalmente na wiki:

- https://soulsremnant.wiki.gg/wiki/Skills
- páginas relacionadas de armas, atributos, skills e sistemas de combate.

A aplicação deve permitir que o jogador:

1. interaja com uma **skill tree visual praticamente igual à do jogo/wiki**;
2. defina o **nível ativo** de cada skill;
3. veja o **scaling total em % no nível atual**;
4. veja uma **estimativa de dano por uso e DPS**;
5. informe os atributos do personagem;
6. informe manualmente os quatro tipos de dano fornecidos pela arma equipada;
7. escolha quais skills fazem parte da build/rotação;
8. atribua um peso de uso para cada skill;
9. calcule a melhor distribuição de atributos;
10. calcule qual **arquétipo de arma** é matematicamente melhor para aquela combinação de skills;
11. salve, importe, exporte e compartilhe builds.

A página deve funcionar como um **planner/calculadora**, não como uma réplica apenas estética.

---

# 2. Prioridade de implementação

A prioridade máxima é:

> **A árvore de skills deve ser a interface principal e deve se comportar como a tree do jogo/wiki.**

Não criar uma árvore genérica em círculos com cards posicionados aproximadamente.

Não colocar uma imagem estática da árvore ao lado de uma lista separada.

O usuário deve clicar **diretamente nos nós da árvore**, exatamente como esperaria fazer dentro do jogo.

A árvore precisa parecer parte do jogo e não um diagrama externo.

---

# 3. Fonte visual da skill tree

Usar como referência principal a árvore interativa existente em:

https://soulsremnant.wiki.gg/wiki/Skills

Também usar screenshots da tree do jogo como referência de layout.

## Requisitos

A árvore deve reproduzir:

- posição relativa dos anéis;
- ordem das skills;
- ícones;
- ramificações;
- cores das linhas/anéis;
- estados desbloqueado/bloqueado;
- nível atual;
- skill selecionada;
- nós especiais;
- espaçamento e proporção.

## Estratégia recomendada

Se a wiki já possui HTML/SVG/JSON/JS que define a árvore:

1. inspecionar o DOM e assets da página;
2. identificar:
   - coordenadas;
   - ids;
   - classes;
   - nomes de skill;
   - ícones;
   - dependências;
3. recriar o componente localmente.

Preferir um modelo de dados semelhante a:

```ts
interface SkillNode {
  id: string;
  name: string;

  x: number;
  y: number;

  ring?: number;

  iconUrl?: string;

  category:
    | "melee"
    | "range"
    | "magic"
    | "faith"
    | "hybrid"
    | "starter";

  prerequisites?: string[];

  activeLevel: number;
  activeMax: number;

  scaling: SkillScaling;
}
```

Não usar coordenadas inventadas sem antes tentar extrair ou reproduzir as posições reais da wiki.

---

# 4. Interação com a árvore

Cada nó precisa suportar:

## Hover

Mostrar tooltip com:

- nome;
- categoria;
- Active Lv;
- nível máximo;
- cooldown;
- custo;
- scaling total atual;
- dano estimado;
- DPS estimado;
- resumo da descrição.

Exemplo:

```text
Upward Strike

Active Lv: 3 / 20

Melee Damage:
142.5%

Cooldown:
1.2s

Estimated Hit:
1,284

Estimated DPS:
1,070
```

---

## Clique

Ao clicar em uma skill:

- selecionar o nó;
- destacar visualmente;
- abrir o inspector lateral;
- permitir alterar:
  - Active Level;
  - peso na rotação;
  - ativo/inativo;
- atualizar todos os cálculos imediatamente.

---

## Badge no próprio nó

O nó deve mostrar sobre o ícone:

- nível ativo;
- ou algo equivalente ao jogo.

Exemplo:

```text
[ÍCONE]
   5
```

---

# 5. Painel esquerdo — loadout ativo

Imitar o conceito da UI do jogo.

Seções:

## Basic Attack

Um slot.

## Buffs

Slots de buffs.

## Additional Skills

Slots das demais skills.

Os slots devem mostrar:

- ícone;
- nome;
- Active Level;
- categoria.

Clicar no slot deve selecionar a skill correspondente na tree.

---

# 6. Painel direito — Skill Inspector

Quando uma skill estiver selecionada, mostrar:

## Cabeçalho

- ícone;
- nome;
- categoria;
- tipo de dano.

---

## Nível ativo

Manter somente o campo:

```text
Active Level
```

O planner não controla níveis aprendidos, pois eles não participam do cálculo.

Validar:

```text
0 <= Active Level <= Active Max
```

e também respeitar o Active Max da skill.

---

# 7. Scaling por nível

A aplicação precisa armazenar scaling no formato real da wiki.

Por exemplo:

```ts
{
  basePercent: 58.4,
  perLevelPercent: 19.7
}
```

O scaling total deve ser calculado por:

```ts
totalPercent =
  basePercent +
  perLevelPercent * (activeLevel - 1)
```

se essa for a convenção usada naquela skill.

IMPORTANTE:

Nem toda skill necessariamente usa uma única linha de dano.

Uma skill pode ter:

- Melee;
- Range;
- Magic;
- Faith;
- dois ou mais tipos;
- scaling híbrido.

Portanto o modelo deve suportar:

```ts
interface DamageScaling {
  melee?: Scaling;
  range?: Scaling;
  magic?: Scaling;
  faith?: Scaling;
}
```

Exemplo:

```ts
damageScaling: {
  melee: {
    basePercent: 70,
    perLevelPercent: 20
  },

  faith: {
    basePercent: 35,
    perLevelPercent: 10
  }
}
```

---

# 8. Exibição do % total

No inspector deve aparecer claramente:

```text
Melee Damage: 142.5%
Faith Damage: 73.0%
```

ou:

```text
Total Scaling
Melee   142.5%
Magic    65.0%
```

Esses valores devem atualizar em tempo real quando o Active Level mudar.

---

# 9. Status do personagem

Criar uma seção de atributos do personagem.

Campos:

```text
STR
DEX
INT
SPR
CON
LUK
```

Os valores devem ser digitáveis manualmente.

Separar:

```text
Base / personagem
```

dos valores vindos da arma.

---

# 10. Arma equipada — entrada manual

Não obrigar o usuário a selecionar uma arma específica.

Criar apenas quatro campos:

```text
Weapon Melee Damage
Weapon Range Damage
Weapon Magic Damage
Weapon Faith Damage
```

Exemplo:

```text
Melee: 105
Range: 0
Magic: 0
Faith: 0
```

ou:

```text
Melee: 70
Range: 70
Magic: 0
Faith: 0
```

ou arma Global:

```text
Melee: 45
Range: 45
Magic: 45
Faith: 45
```

Assim o usuário pode reproduzir qualquer arma existente, inclusive rolls diferentes.

---

# 11. Outros stats relevantes

Prever campos para:

```text
Melee Attack Speed
Range Attack Speed
Magic Attack Speed
Faith Attack Speed
Global Attack Speed

Crit Chance
Crit Damage

Damage Balance

Bonus Damage

Armor Pen

Element Effect Chance
Element Effect Potency
```

Nem todos precisam obrigatoriamente entrar no MVP, mas a arquitetura deve aceitar esses stats.

---

# 12. Cálculo de dano por skill

Modelo básico:

```text
DamagePerCast =
  Σ(
    EffectiveAttack[type]
    ×
    SkillScaling[type]
  )
```

onde:

```text
EffectiveAttack[type]
=
CharacterAttack[type]
+
WeaponDamage[type]
+
OtherBonuses[type]
```

Exemplo:

```text
Melee Attack efetivo = 150

Skill Melee Scaling = 250%

Dano bruto:

150 × 2.5 = 375
```

Para skill híbrida:

```text
Melee:
150 × 2.0 = 300

Faith:
80 × 1.2 = 96

Total:
396
```

---

# 13. DPS

Para skills com cooldown:

```text
DPS =
DamagePerCast
/
EffectiveCooldown
```

Attack Speed deve afetar apenas as categorias corretas.

Exemplo importante:

Onslaught pode ter dano híbrido, mas seu cooldown pode responder apenas a:

```text
Melee Attack Speed
Global Attack Speed
```

Logo não assumir automaticamente:

```text
tipo de dano == tipo de attack speed
```

A skill precisa armazenar explicitamente:

```ts
cooldownSpeedCategory:
  | "melee"
  | "range"
  | "magic"
  | "faith"
```

e sempre considerar Global Attack Speed.

---

# 14. DPS médio da rotação

O usuário precisa informar quanto usa cada skill.

Exemplo:

```text
Onslaught       40%
Heavy Strike    30%
Shield Slam     20%
Taunt           10%
```

Normalizar automaticamente os pesos.

Calcular:

```text
WeightedDPS =
Σ(
  SkillDPS
  ×
  NormalizedUsageWeight
)
```

Mostrar:

```text
Estimated Rotation DPS
```

e uma tabela:

| Skill | Scaling | Hit | DPS | Usage | DPS contribution |
|---|---:|---:|---:|---:|---:|
| Onslaught | 245% | ... | ... | 40% | ... |
| Heavy Strike | 370% | ... | ... | 30% | ... |

---

# 15. Transparência do cálculo

Não apresentar DPS como valor "oficial".

Usar labels como:

```text
Estimated Raw DPS
```

ou:

```text
DPS estimado antes de DEF/resistências
```

Quando algum dado estiver faltando, não inventar silenciosamente.

Mostrar:

```text
Cooldown ainda não confirmado
```

ou:

```text
Tick count desconhecido
```

e excluir ou aproximar explicitamente.

---

# 16. Otimizador de atributos

Criar uma aba:

```text
Optimizer
```

Entradas:

```text
Points available
Minimum CON
Objective
```

Objetivos:

```text
Maximum DPS
Balanced
Survivability
Custom
```

No modo Custom:

```text
DPS weight
Survival weight
Support weight
```

---

# 17. Otimização

O otimizador deve procurar uma distribuição ótima entre:

```text
STR
DEX
INT
SPR
CON
LUK
```

Para cada distribuição candidata:

1. calcular stats finais;
2. calcular dano de todas as skills ativas;
3. calcular DPS;
4. ponderar pela rotação;
5. incluir crit quando aplicável;
6. respeitar CON mínimo;
7. calcular score.

Saída:

```text
Recommended allocation

STR 82
DEX 0
INT 0
SPR 31
CON 25
LUK 22
```

Também mostrar:

```text
Marginal value of next point
```

Exemplo:

| Stat | Gain |
|---|---:|
| STR | +0.52% DPS |
| LUK | +0.41% DPS |
| SPR | +0.22% DPS |

---

# 18. Otimizador de arma

Esse é um recurso obrigatório.

O usuário pode informar os valores reais da arma equipada para o cálculo atual.

Mas o **otimizador de melhor arma deve ignorar esses valores informados**.

Ele precisa gerar armas teóricas normalizadas de diferentes arquétipos e comparar qual delas funciona melhor com a build.

---

# 19. Arquétipos de arma

Considerar:

## Single

Apenas um tipo de dano:

```text
Melee
Range
Magic
Faith
```

4 possibilidades.

---

## Dual

Dois tipos:

```text
Melee + Range
Melee + Magic
Melee + Faith
Range + Magic
Range + Faith
Magic + Faith
```

6 possibilidades.

---

## Global

Dano global aplicado aos quatro:

```text
Melee
Range
Magic
Faith
```

1 possibilidade.

Total:

```text
11 arquétipos
```

---

# 20. Proporções Single / Dual / Global

Não comparar:

```text
100 / 100 / 100
```

porque as armas reais não têm os mesmos valores absolutos.

Usar os ranges reais da wiki.

Extrair amostras de tiers equivalentes, por exemplo:

```text
Stone
Copper
Quartz
...
```

Para cada tier:

1. pegar midpoint de uma arma Single;
2. midpoint por tipo de uma Dual;
3. midpoint de Global;
4. normalizar em relação à Single.

Exemplo conceitual:

```text
Single = 1.00
Dual per type ≈ 0.75
Global per type ≈ 0.59
```

Esses valores devem vir da média dos dados disponíveis.

Guardar isso configurável:

```ts
weaponArchetypeRatios = {
  singlePerType: 1,
  dualPerType: 0.75,
  globalPerType: 0.59
}
```

---

# 21. Importante sobre dano total das armas

O sistema precisa refletir esta característica:

## Single

Maior valor absoluto em um tipo.

Exemplo:

```text
100 Melee
```

Total nominal:

```text
100
```

---

## Dual

Valor menor por tipo.

Exemplo:

```text
75 Melee
75 Magic
```

Total nominal:

```text
150
```

---

## Global

Menor valor por tipo.

Exemplo:

```text
59 Melee
59 Range
59 Magic
59 Faith
```

Total nominal:

```text
236
```

Portanto:

```text
Global tem maior soma nominal.
Single tem maior concentração.
```

Mas isso NÃO significa que Global sempre seja melhor.

A eficiência depende de quanto das quatro linhas a build realmente utiliza.

Esse é exatamente o propósito do Weapon Optimizer.

---

# 22. Comparação das armas

Para cada arquétipo:

1. gerar os quatro danos;
2. rodar o cálculo da build inteira;
3. calcular Rotation DPS;
4. ordenar.

Exemplo:

```text
Weapon recommendation

1. Melee + Faith      14,320 DPS
2. Global             14,110 DPS
3. Melee              13,950 DPS
4. Melee + Magic      12,870 DPS
...
```

Mostrar:

```text
Best weapon archetype:
Melee + Faith
```

---

# 23. Otimização conjunta atributo + arma

Idealmente fazer duas análises:

## Modo rápido

Usar atributos atuais e comparar armas.

## Modo completo

Para cada arma:

1. otimizar atributos;
2. calcular melhor score;
3. comparar com as demais.

Isso evita o erro de:

```text
otimizar atributos para Sword
e depois usar essa mesma distribuição para Global
```

Cada arma pode produzir uma distribuição ótima diferente.

---

# 24. Resultado completo

Mostrar um resumo:

```text
Recommended Build

Weapon:
Melee + Faith

Stats:
STR 82
SPR 41
CON 25
LUK 12

Estimated Rotation DPS:
15,284

Main contributor:
Onslaught — 48%

Second:
Shield Slam — 31%
```

---

# 25. Ranking de armas

Tabela:

| Rank | Weapon archetype | Optimal stats | DPS |
|---|---|---|---:|
| 1 | Melee + Faith | 80 STR / 40 SPR | 15,284 |
| 2 | Global | 64 STR / 28 SPR / 24 LUK | 14,991 |
| 3 | Melee | 103 STR / 15 LUK | 14,733 |

---

# 26. Separar dados de lógica

Não hardcodar fórmulas dentro dos componentes React/UI.

Criar arquivos separados:

```text
/data/skills.ts
/data/weapons.ts
/data/game-formulas.ts
/data/tree-layout.ts
```

Exemplo:

```ts
export const skills = [...]
```

---

# 27. Dados da skill

Estrutura sugerida:

```ts
interface Skill {
  id: string;
  name: string;
  icon?: string;

  category: SkillCategory;

  activeMax: number;

  damage: {
    melee?: LevelScaling;
    range?: LevelScaling;
    magic?: LevelScaling;
    faith?: LevelScaling;
  };

  cooldown?: number;

  cooldownScaling?: {
    attackSpeedType:
      | "melee"
      | "range"
      | "magic"
      | "faith";

    acceptsGlobalAttackSpeed: boolean;
  };

  hits?: number;

  support?: {
    sprScaling?: LevelScaling;
    conScaling?: LevelScaling;
  };

  notes?: string;

  sourceUrl?: string;
}
```

---

# 28. Fórmulas configuráveis

Algumas mecânicas podem ainda não estar totalmente documentadas.

Criar um objeto configurável:

```ts
gameModel = {
  critFormula: ...,
  damageBalanceFormula: ...,
  attackSpeedFormula: ...,
  conToHp: ...,
  conToDefense: ...
}
```

Criar uma aba avançada:

```text
Model / Advanced
```

onde esses parâmetros possam ser editados.

---

# 29. Import/export

Implementar:

```text
Save locally
Export JSON
Import JSON
Share URL
```

URL pode serializar a build em hash/query.

Exemplo:

```text
/#build=...
```

---

# 30. Loadouts

Ter pelo menos:

```text
1 2 3 4 5
```

Cada loadout salva independentemente:

- levels;
- active skills;
- weights;
- stats;
- weapon;
- optimizer settings.

---

# 31. UX

A tela principal deve lembrar a organização do jogo:

```text
┌──────────────┬─────────────────────────────────┬───────────────┐
│ Active Skills│                                 │ Skill Details │
│              │        INTERACTIVE TREE         │               │
│ Basic        │                                 │ Name          │
│ Buffs        │                                 │ Level         │
│ Additional   │                                 │ Scaling       │
│              │                                 │ DPS           │
└──────────────┴─────────────────────────────────┴───────────────┘
```

A árvore precisa ser o maior elemento visual.

---

# 32. Responsividade

Desktop é prioridade.

Alvo principal:

```text
1440p
1080p
ultrawide
```

Em mobile/tablet:

- tree pode ocupar tela inteira;
- side panels podem virar drawer/modal.

---

# 33. Stack sugerida

Preferência:

```text
React
TypeScript
Vite
```

Opcional:

```text
Zustand
```

para state.

Evitar dependências grandes desnecessárias.

Para a tree:

- SVG;
- HTML absolute positioning;
- ou Canvas apenas se realmente necessário.

SVG é preferível se a árvore tiver conexões/linhas complexas.

---

# 34. Componentes sugeridos

```text
App

TopBar
LoadoutSelector

BuildScreen
 ├── ActiveSkillPanel
 ├── SkillTree
 │    ├── SkillNode
 │    ├── SkillTooltip
 │    └── SkillConnections
 └── SkillInspector

StatsPanel
WeaponInput

DpsPanel

OptimizerPage
 ├── OptimizerSettings
 ├── StatOptimizer
 ├── WeaponOptimizer
 ├── WeaponRanking
 └── SkillContributionChart

AdvancedDataPage
```

---

# 35. Não fazer

Evitar os erros das versões anteriores:

## Não fazer uma árvore aproximada

Não criar círculos grandes e distribuir skills manualmente apenas para "parecer uma tree".

---

## Não usar screenshot apenas como decoração

A imagem/estrutura da tree deve ser a interface propriamente dita.

---

## Não criar dois componentes redundantes

Não colocar:

```text
imagem da tree
+
lista de skills
```

como duas interfaces principais separadas.

A tree deve controlar a build.

Uma tabela auxiliar é aceitável em outra aba.

---

## Não inventar fórmulas silenciosamente

Quando um valor não for confirmado:

```text
Estimated
Experimental
Unknown
```

e permitir editar o coeficiente.

---

## Não assumir que categoria da skill determina todos os scalings

Uma skill pode:

- causar múltiplos tipos de dano;
- usar uma categoria de Attack Speed diferente;
- ter componente de suporte.

---

## Não assumir que Global é sempre melhor

O Weapon Optimizer precisa calcular o aproveitamento real de cada linha.

---

# 36. Wiki scraper / atualização de dados

Idealmente criar um script opcional:

```text
scripts/updateWikiData.ts
```

para ajudar a atualizar:

- nomes;
- levels;
- cooldown;
- scaling;
- weapon ranges.

Não depender dele em runtime.

A aplicação deve funcionar offline depois dos dados terem sido gerados.

---

# 37. Testes

Adicionar testes unitários para:

## Scaling

```text
base 58.4
per level 19.7
level 1

= 58.4
```

```text
level 5

58.4 + 19.7 × 4
```

---

## Skill híbrida

Verificar soma de dois ataques.

---

## Weapon optimizer

Caso de teste:

Build 100% Melee.

Esperado:

```text
Single Melee
```

deve competir fortemente/vencer Global quando a concentração adicional superar a soma não aproveitada.

Outro caso:

Build utiliza igualmente os quatro tipos.

Esperado:

```text
Global
```

deve tender a vencer.

---

## Dual

Build 50% Melee + 50% Faith.

Esperado:

```text
Melee + Faith
```

deve ter boa probabilidade de ser a recomendação.

---

# 38. Estado de dados

Como Soul’s Remnant está em Early Access, marcar dados com:

```ts
confidence:
  | "confirmed"
  | "wiki"
  | "community"
  | "estimated"
```

Mostrar isso quando apropriado.

---

# 39. Resultado mínimo aceitável

O MVP só deve ser considerado pronto quando for possível:

1. clicar numa skill diretamente na tree;
2. alterar seu nível;
3. ver seu scaling total;
4. informar stats;
5. informar os quatro danos da arma;
6. ver Estimated Hit e Estimated DPS;
7. montar uma rotação com várias skills;
8. ver Rotation DPS;
9. rodar otimização de stats;
10. receber recomendação de arma;
11. comparar Single / Dual / Global;
12. salvar e carregar a build.

---

# 40. Objetivo final de experiência

A experiência desejada é:

> "Eu abro a página, vejo praticamente a mesma árvore que vejo dentro de Soul’s Remnant, clico nas skills que uso, coloco os níveis delas e os meus stats, informo os quatro danos da minha arma e imediatamente vejo quanto cada skill escala, meu DPS aproximado, a melhor distribuição de atributos e qual tipo de arma combina melhor com essa build."

Esse é o norte do projeto.

A precisão matemática deve crescer conforme novos dados da wiki forem confirmados, mas a arquitetura precisa estar pronta desde o início para substituir aproximações por fórmulas oficiais sem reescrever a aplicação.
