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
3. Ajuste apenas o nível Active; cada skill vai para o destino válido do loadout.
4. Na aba **DPS**, informe os ataques base, os quatro danos da arma, atributos e stats de combate.
5. Consulte a contribuição das skills ou rode o **Optimizer** para comparar os 11 arquétipos de arma.
6. Salve localmente, exporte JSON ou compartilhe a build pela URL.

## Estrutura

- `skills.json`: exportação completa do mapa da wiki.gg usada como fonte.
- `skill-data.js`: 79 skills geradas, arquétipos, fontes e confiança dos dados.
- `tree-map-data.js`: coordenadas, grupos e caminhos dos ícones do mapa oficial da wiki.gg.
- `formulas.js`: funções puras de scaling, dano, crítico, cooldown e vetores de arma.
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

O optimizer usa regressões da coleta in-game entre 0 e 200 pontos, sem arma e com uma arma de +30 Global. O bônus da arma é o parâmetro principal: `W` significa o ATK que a arma acrescenta naquele tipo. Com o ATK inato observado de 15, as fórmulas ficam:

```text
Melee ≈ Wₘ × (1,13333 + 0,03727 STR + 0,00931 SPR) + 16 + 0,55905 STR + 0,13965 SPR
Range ≈ Wᵣ × (1,13333 + 0,03762 DEX + 0,00752 SPR) + 16 + 0,56430 DEX + 0,11280 SPR
Magic ≈ Wₐ × (1,10000 + 0,03687 INT + 0,01668 SPR) + 16 + 0,55305 INT + 0,25020 SPR
Faith ≈ W𝒻 × (1,13333 + 0,00944 STR + 0,03762 SPR) + 16 + 0,14160 STR + 0,56430 SPR
```

Assim, por exemplo, cada ponto de STR acrescenta `0,03727 × Wₘ` ao dano vindo da arma Melee, além de `0,55905` gerado pelos 15 pontos inatos. Os ajustes têm `R²` entre aproximadamente `0,9976` e `1,0000`. A aba **Modelo** mostra essa decomposição sem depender de uma arma de referência fixa.

As abas **DPS** e **Modelo** também apresentam quatro indicadores circulares. Eles decompõem o DPS disponível pelas linhas de scaling Melee, Range, Magic e Faith; as participações somam 100% quando existe ao menos uma skill ofensiva calculável.
