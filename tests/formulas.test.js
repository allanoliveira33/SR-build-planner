const test = require('node:test');
const assert = require('node:assert/strict');
const formulas = require('../formulas.js');

const close = (actual, expected, epsilon = 1e-9) => assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} != ${expected}`);
function skill(overrides = {}) { return { id:'test_skill', activeLevel:1, cooldown:2, cooldownMs:2000, attackCount:1, hits:1, scalings:{}, basePower:{base:0,perLevel:0}, ...overrides }; }

test('atributo final inclui base 1, aditivo e percentual', () => {
  const result = formulas.primaryStats({ str:20 }, { str:4 }, { str:20 });
  assert.equal(result.raw.str, 25);
  assert.equal(result.final.str, 30);
});

test('dano por tipo usa os coeficientes exatos do runtime', () => {
  const result = formulas.attackDamageVector({ str:31, dex:11, int:21, spr:41, con:6, luk:16 }, { additiveGlobalAttack:30 });
  close(result.scales.melee, 42.81);
  close(result.attacks.melee, 45 * (30 + 42.81) / 30);
  close(result.scales.range, 29.6);
  close(result.scales.magic, 45.05);
  close(result.scales.faith, 50.505);
});

test('conversões usam o dano original e não encadeiam', () => {
  const result = formulas.attackDamageVector({ str:1,dex:1,int:1,spr:1,con:1,luk:1 }, { meleeToMagicPercent:100, magicToMeleePercent:100 });
  close(result.attacks.melee, result.original.melee + result.original.magic);
  close(result.attacks.magic, result.original.magic + result.original.melee);
});

test('character sheet calcula AP, HP, MP, defesa, crit e regen', () => {
  const rules = { maxLevel:99,
    melee:{bonuses:[{key:'maxHp',every:5,amount:2},{key:'defense',every:8,amount:1},{key:'hpRegen',every:12,amount:1}]},
    range:{bonuses:[{key:'critChance',every:6,amount:1}]},
    magic:{bonuses:[{key:'shield',every:2,amount:2},{key:'maxMp',every:5,amount:2},{key:'mpRegen',every:12,amount:1}]},
    faith:{bonuses:[{key:'elementPotency',every:5,amount:1},{key:'damageReduction',every:6,amount:1},{key:'elementChance',every:9,amount:1}]}
  };
  const sheet = formulas.characterSheet({ level:42, allocated:{}, passiveLevels:{melee:40,range:41,magic:45,faith:45}, passiveRules:rules });
  assert.equal(sheet.totalAP, 210);
  close(sheet.maxHp, 171);
  close(sheet.maxMp, 70.2);
  close(sheet.defense, 5.1);
  assert.equal(sheet.shield, 44);
  assert.ok(sheet.hpRegenTick > 4 && sheet.hpRegenTick < 4.1);
  assert.ok(sheet.mpRegenTick > 8.3 && sheet.mpRegenTick < 8.4);
  assert.ok(sheet.critRate > 6 && sheet.critRate < 7);
});

test('skill power trunca e aplica o fator de saída 0,94', () => {
  const s = skill({ basePower:{base:10,perLevel:5}, scalings:{melee:{base:100,perLevel:0}} });
  close(formulas.damagePerHit(s, { melee:100.9 }), 103.4);
});

test('skills periódicas usam attack count × APS × duração', () => {
  const periodic = skill({ id:'star_fall', attackCount:1, attacksPerSecond:3, durationRuntime:{base:5,perLevel:0}, hits:1 });
  assert.equal(formulas.hitCount(periodic), 15);
  const gravity = skill({ id:'gravity_well', attackCount:1, attacksPerSecond:3, durationRuntime:{base:5,perLevel:0} });
  assert.equal(formulas.hitCount(gravity), 16);
});

test('efeitos especiais usam fatores ponderados do compêndio', () => {
  assert.equal(formulas.totalDamageMultiplier(skill({id:'true_shot'})), 4);
  assert.equal(formulas.totalDamageMultiplier(skill({id:'cursed_throw'})), 2.5);
  assert.equal(formulas.totalDamageMultiplier(skill({id:'cursed_throw'}), {isBoss:true}), 8.5);
  assert.equal(formulas.totalDamageMultiplier(skill({id:'burst_shield'})), 1.5);
});

test('buffs globais documentados multiplicam a rotação', () => {
  const skills=[skill({id:'shadow_twin',activeLevel:10,nonDamage:true}),skill({id:'clarity',activeLevel:5,nonDamage:true}),skill({id:'vanguard',activeLevel:1,nonDamage:true})];
  const expected=(1+.288)*(1+(8.4+1.68*5)/100)*1.042;
  close(formulas.rotationBuffMultiplier(skills,{targetHasStatus:true}),expected);
});

test('cura e shield especiais usam HP, MP, INT e nível ativo', () => {
  const revitalize=skill({id:'revitalize',activeLevel:10,basePower:{base:50,perLevel:25}});
  assert.equal(formulas.skillHealing(revitalize,{maxHp:500,maxMp:200,elementPotency:50}),275+Math.ceil(500*.06+200*.096));
  const whirlwind=skill({id:'whirlwind',activeLevel:5});
  assert.equal(formulas.skillShield(whirlwind,{primary:{int:100}}),60);
});

test('cooldown usa CDR por classes e respeita exclusões', () => {
  const normal = skill({ classes:['melee','range'], cooldownMs:2600 });
  assert.equal(formulas.effectiveCooldown(normal, { globalCooldownReduction:5, meleeCooldownReduction:10, rangeCooldownReduction:15 }), 2);
  const fixed = skill({ id:'cross_strike', classes:['melee','faith'], cooldownMs:9000 });
  assert.equal(formulas.effectiveCooldown(fixed, { globalCooldownReduction:100, meleeCooldownReduction:100 }), 9);
});

test('pipeline de defesa usa K=40 e crítico esperado', () => {
  const combat = { critRate:20, critDamage:50, armorPenetration:5, defenseIgnore:10 };
  const context = { playerLevel:42, targetLevel:42, targetDefense:20 };
  const def = formulas.defenseMultiplier(context, combat);
  assert.equal(def.effective, 13);
  const expected = Math.max(1, Math.round((100 - 13 / 3) * 40 / 53)) * 1.1;
  close(formulas.applyTargetPipeline(100, context, combat), expected);
});

test('rotação soma skills usadas no cooldown e calcula share', () => {
  const fast=skill({id:'fast',cooldownMs:1000,scalings:{melee:{base:100,perLevel:0}}});
  const slow=skill({id:'slow',cooldownMs:2000,scalings:{melee:{base:100,perLevel:0}}});
  const rotation=formulas.rotationDps([fast,slow],{melee:100});
  assert.equal(rotation.total,141);
  close(rotation.rows[0].contributionShare,2/3);
});

test('SP usa a tabela cumulativa de cada skill', () => {
  const skills=[
    {panelType:'additional',activeLevel:5,spCosts:[2,3,4,5,6]},
    {panelType:'basic',activeLevel:5,spCosts:[0,1,2,3,4]},
    {panelType:'additional',activeLevel:1,spCosts:[3]},
    {panelType:'buff',activeLevel:20,spCosts:Array(20).fill(0)}
  ];
  assert.equal(formulas.skillPointCost(skills),13);
});

test('orçamento de SP inclui bônus dos níveis 5 e 10', () => {
  const model={starting:1,perLevelUp:1,every5:1,every10:1};
  assert.equal(formulas.skillPointBudget(42,model),54);
  assert.equal(formulas.minimumLevelForSkillPoints(22,model),18);
});
