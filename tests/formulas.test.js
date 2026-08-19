const test = require('node:test');
const assert = require('node:assert/strict');
const formulas = require('../formulas.js');

function skill(overrides = {}) {
  return {
    id: 'test-skill',
    activeLevel: 1,
    cooldown: 2,
    scalings: {},
    ...overrides
  };
}

test('scaling usa base no nível 1', () => {
  assert.equal(formulas.totalScaleComponent({ base: 58.4, perLevel: 19.7 }, 1), 58.4);
});

test('scaling soma quatro incrementos no nível 5', () => {
  assert.equal(formulas.totalScaleComponent({ base: 58.4, perLevel: 19.7 }, 5), 137.2);
});

test('skill híbrida soma as linhas de ataque', () => {
  const hybrid = skill({ scalings: { melee: { base: 200, perLevel: 0 }, faith: { base: 120, perLevel: 0 } } });
  assert.equal(formulas.damagePerCast(hybrid, { melee: 150, faith: 80 }), 396);
});

test('Power e scaling são dano por hit e o uso multiplica as ocorrências', () => {
  const multi = skill({
    basePower: { base: 10, perLevel: 5 },
    hits: 3,
    damageMultiplier: 3,
    scalings: { melee: { base: 100, perLevel: 0 } }
  });
  assert.equal(formulas.damagePerHit(multi, { melee: 100 }), 110);
  assert.equal(formulas.damagePerCast(multi, { melee: 100 }), 330);
});

test('efeitos ponderados distinguem hits reais do multiplicador de dano', () => {
  const trueShot = skill({
    hits: 2,
    damageMultiplier: 4,
    scalings: { range: { base: 100, perLevel: 0 } }
  });
  assert.equal(formulas.hitCount(trueShot), 2);
  assert.equal(formulas.damagePerCast(trueShot, { range: 100 }), 400);
});

test('attack speed usa somente a categoria declarada e Global', () => {
  const melee = skill({ cooldown: 2, cooldownSpeedCategory: 'melee', acceptsGlobalAttackSpeed: true });
  assert.equal(formulas.effectiveCooldown(melee, { meleeAttackSpeed: 25, magicAttackSpeed: 500, globalAttackSpeed: 25 }), 4 / 3);
});

test('skill com duas categorias acumula apenas os dois Attack Speeds declarados', () => {
  const dashStrike = skill({ cooldown: 2.6, cooldownSpeedCategories: ['melee','range'] });
  assert.equal(formulas.effectiveCooldown(dashStrike, { meleeAttackSpeed: 10, rangeAttackSpeed: 15, magicAttackSpeed: 500, globalAttackSpeed: 5 }), 2);
});

test('Attack Speed de Cross Strike multiplica dano sem reduzir cooldown', () => {
  const crossStrike = skill({
    cooldown: 9,
    cooldownSpeedCategories: [],
    damageSpeedCategories: ['melee', 'faith'],
    scalings: { melee: { base: 100, perLevel: 0 } }
  });
  const combat = { meleeAttackSpeed: 10, faithAttackSpeed: 20, globalAttackSpeed: 5 };
  assert.equal(formulas.effectiveCooldown(crossStrike, combat), 9);
  assert.equal(formulas.damageSpeedMultiplier(crossStrike, combat), 1.35);
  assert.equal(formulas.skillDps(crossStrike, { melee: 100 }, combat), 15);
});

test('toggle contínuo usa ticks por segundo em vez do cooldown de ativação', () => {
  const toggle = skill({
    cooldown: 5,
    sustainedHitsPerSecond: 2,
    scalings: { faith: { base: 100, perLevel: 0 } }
  });
  assert.equal(formulas.damageFactorPerSecond(toggle), 2);
  assert.equal(formulas.skillDps(toggle, { faith: 100 }), 200);
});

test('rotação soma o DPS de skills usadas sempre que disponíveis', () => {
  const fast = skill({ id: 'fast', cooldown: 1, scalings: { melee: { base: 100, perLevel: 0 } } });
  const slow = skill({ id: 'slow', cooldown: 2, scalings: { melee: { base: 100, perLevel: 0 } } });
  const rotation = formulas.rotationDps([fast, slow], { melee: 100 });
  assert.equal(rotation.total, 150);
  assert.equal(rotation.rows[0].contributionShare, 2 / 3);
  assert.equal(rotation.rows[1].contributionShare, 1 / 3);
});

test('influência por tipo de dano decompõe exatamente o DPS da rotação', () => {
  const hybrid = skill({
    cooldown: 2,
    scalings: {
      melee: { base: 200, perLevel: 0 },
      magic: { base: 100, perLevel: 0 }
    }
  });
  const attacks = { melee: 150, range: 0, magic: 100, faith: 0 };
  const rotation = formulas.rotationDps([hybrid], attacks);
  const influence = formulas.rotationDpsByType([hybrid], attacks);
  assert.equal(influence.total, rotation.total);
  assert.equal(influence.shares.melee, 0.75);
  assert.equal(influence.shares.magic, 0.25);
  assert.equal(Object.values(influence.shares).reduce((sum, share) => sum + share, 0), 1);
});

test('Single Melee vence Global em uma build 100% Melee', () => {
  const melee = skill({ scalings: { melee: { base: 100, perLevel: 0 } } });
  const ratios = { single: 100, dual: 75.43, global: 59.41 };
  const single = formulas.weaponVector({ kind: 'single', types: ['melee'] }, ratios);
  const global = formulas.weaponVector({ kind: 'global', types: ['melee','range','magic','faith'] }, ratios);
  assert.ok(formulas.damagePerCast(melee, single) > formulas.damagePerCast(melee, global));
});

test('Global vence quando a skill aproveita igualmente os quatro tipos', () => {
  const omni = skill({ scalings: Object.fromEntries(formulas.DAMAGE_TYPES.map(type => [type, { base: 100, perLevel: 0 }])) });
  const ratios = { single: 100, dual: 75.43, global: 59.41 };
  const single = formulas.weaponVector({ kind: 'single', types: ['melee'] }, ratios);
  const global = formulas.weaponVector({ kind: 'global', types: formulas.DAMAGE_TYPES }, ratios);
  assert.ok(formulas.damagePerCast(omni, global) > formulas.damagePerCast(omni, single));
});

test('Dual Melee + Faith vence as alternativas normalizadas na build híbrida', () => {
  const hybrid = skill({ scalings: { melee: { base: 100, perLevel: 0 }, faith: { base: 100, perLevel: 0 } } });
  const ratios = { single: 100, dual: 75.43, global: 59.41 };
  const dual = formulas.weaponVector({ kind: 'dual', types: ['melee','faith'] }, ratios);
  const single = formulas.weaponVector({ kind: 'single', types: ['melee'] }, ratios);
  const global = formulas.weaponVector({ kind: 'global', types: formulas.DAMAGE_TYPES }, ratios);
  assert.ok(formulas.damagePerCast(hybrid, dual) > formulas.damagePerCast(hybrid, single));
  assert.ok(formulas.damagePerCast(hybrid, dual) > formulas.damagePerCast(hybrid, global));
});
