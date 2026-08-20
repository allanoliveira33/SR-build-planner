# Soul's Remnant Build Planner

Planner local e offline para montar skills, calcular dano bruto estimado, comparar rotações e otimizar atributos e arquétipos de arma.

## Executar

Abra `index.html` diretamente ou sirva a pasta com qualquer servidor estático. Não há etapa de build nem dependências de runtime.

```bash
npm test
npm run check
```

Os testes usam apenas o runner nativo do Node.js.

## Fluxo principal

1. Clique em um ícone da árvore de skills.
2. Use os filtros ou a busca para destacar uma rota; todos os 79 nós continuam navegáveis.
3. Informe o nível do personagem, ajuste as quatro proficiências (máximo 99) e defina o nível Active das skills equipadas.
4. Na aba **DPS**, informe os ataques base, os quatro danos da arma, atributos e stats de combate.
5. Consulte a contribuição das skills ou rode o **Optimizer** para comparar os 11 arquétipos de arma.
6. Salve localmente, exporte JSON ou compartilhe a build pela URL.

## Estrutura

- `skills.json`: exportação completa do mapa da wiki.gg usada como fonte.
- `skill-data.js`: 79 skills geradas, arquétipos, fontes e confiança dos dados.
- `tree-map-data.js`: coordenadas, grupos e caminhos dos ícones do mapa oficial da wiki.gg.
- `formulas.js`: funções puras de scaling, dano, progressão, SP, crítico, cooldown e vetores de arma.
- `app.js`: estado, persistência, renderização e interações.
- `styles.css`: sistema visual e layouts responsivos.
- `tests/formulas.test.js`: testes do modelo matemático.
- `scripts/updateWikiAssets.mjs`: sincroniza o mapa e seus assets para uso offline.
- `scripts/buildSkillData.mjs`: converte `skills.json` no modelo usado pelo planner.

## Transparência dos dados

Soul's Remnant muda com frequência. Dados confirmados na consulta de 17/08/2026 foram atualizados a partir da [wiki da comunidade](https://soulsremnant.wiki.gg/wiki/Skills). O restante mantém um estado de confiança explícito e continua editável na aba **Modelo**.

O fundo, as coordenadas e os ícones da árvore são sincronizados do `Map:Combat Skill Tree` publicado pela wiki e ficam empacotados em `assets/` para o site continuar funcionando offline. Para atualizar esse conjunto com acesso à internet, execute:

```bash
npm run sync:wiki-assets
```

Também é possível regerar somente os dados locais, sem baixar assets:

```bash
npm run sync:skills
```

As 79 skills da árvore possuem tipo, descrição, cooldown e scalings importados quando presentes no JSON. O DPS considera cada skill ofensiva ativa sendo usada sempre que fica disponível; a participação percentual é calculada automaticamente e aparece apenas na aba **DPS**.

Power e scaling são tratados como dano por hit/tick:

```text
DanoPorHit = Power + Σ(ATK[tipo] × Scaling[tipo])
DanoPorUso = DanoPorHit × FatorTotalDasOcorrências
DPS = DanoPorUso ÷ CooldownEfetivo
```

Contagens explícitas da descrição prevalecem. Quando só existem `Attacks/sec` e duração, o planner usa o produto dos dois; sem qualquer contagem, assume 1 hit. Efeitos ponderados mantêm hits e dano separados (por exemplo, True Shot tem 2 ocorrências, mas fator total 4×). Dark Fire usa 2 ticks/s enquanto ativo, e efeitos condicionais são marcados como potencial máximo.

## Modelo de atributos

O planner usa as fórmulas reconstruídas do runtime, documentadas em `Souls_Remnant_formula_compendium.md`. Cada atributo efetivo começa em 1 e recebe pontos aplicados, bônus aditivos e percentuais antes de alimentar as quatro linhas de dano:

```text
MeleeScale = STR + 0,26 CON + 0,25 SPR
RangeScale = DEX + 0,65 LUK + 0,20 SPR
MagicScale = INT + 0,45 SPR + 0,35 LUK
FaithScale = SPR + 0,25 STR + 0,2925 CON
DanoTipo = ATKTipo × (30 + ScaleTipo) ÷ 30 × DanoGlobal% × DanoTipo%
```

`ATKTipo` começa em 15, soma ATK global aditivo e ATK aditivo daquele tipo. Conversões são calculadas a partir das quatro linhas originais para que uma conversão nunca alimente outra.

As abas **DPS** e **Modelo** também apresentam quatro indicadores circulares. Eles decompõem o DPS disponível pelas linhas de scaling Melee, Range, Magic e Faith; as participações somam 100% quando existe ao menos uma skill ofensiva calculável.

## Progressão, proficiências e SP

Uma build nova começa limpa: personagem no nível 1, atributos distribuídos, proficiências, skills, arma e bônus adicionais em zero. Valores intrínsecos do jogo, como os atributos-base e os recursos iniciais de HP/MP, continuam sendo aplicados pelas fórmulas. O personagem de nível 42 com Melee 40, Range 41, Magic 45 e Faith 45 permanece somente como referência de validação da coleta. As proficiências têm máximo 99 e seus bônus por marco entram nos stats derivados:

```text
Max HP ≈ 50 + 2,5 × (nível − 1) + 2,5 × CON + 2 × floor(Melee / 5)
Max MP ≈ 10 + (nível − 1) + 1,2 × SPR + 2 × floor(Magic / 5)
Defense ≈ 0,1 × CON + floor(Melee / 8)
SP disponível = nível + floor(nível / 5) + floor(nível / 10)
```

HP regen, MP regen e Crit Rate usam as equações do runtime, não interpolação. Cada skill consulta sua tabela cumulativa real de SP capturada; buffs e proficiências custam zero. Additional Skills não têm limite. O terceiro buff exige nível 60, e o planner combina essa regra com o orçamento de SP para mostrar o nível mínimo do setup. Todas as entradas do personagem ficam na aba **Status**, junto da ficha consolidada.
