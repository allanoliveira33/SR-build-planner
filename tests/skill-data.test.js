const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'skill-data.js'), 'utf8'), context);
const data = context.window.SKILL_PLANNER_DATA;
const skills = data.skills;
const formulas = require('../formulas.js');

test('skills.json gera 79 skills únicas e ligadas ao mapa', () => {
  assert.equal(skills.length, 79);
  assert.equal(new Set(skills.map(skill => skill.id)).size, 79);
  assert.equal(new Set(skills.map(skill => skill.mapNodeId)).size, 79);
});

test('somente os oito ataques básicos oficiais usam o slot basic', () => {
  const expected = ['Holy Arrow', 'Magic Burst', 'Magic Slash', 'Ninja Throw', 'Nova', 'Shield Bash', 'Slash', 'Soul Shot'];
  const basics = Array.from(skills.filter(skill => skill.panelType === 'basic'), skill => skill.name).sort();
  assert.deepEqual(basics, expected);
});

test('correção do jogo mantém Onslaught em additional e Soul Shot em basic', () => {
  assert.equal(skills.find(skill => skill.id === 'onslaught').panelType, 'additional');
  assert.equal(skills.find(skill => skill.id === 'soul_shot').panelType, 'basic');
});

test('passivas e toggles ficam limitados aos slots de buff', () => {
  const classified = skills.filter(skill => /passive|buff\s*\/\s*toggle/i.test(skill.skillKind));
  assert.ok(classified.length > 0);
  assert.ok(classified.every(skill => skill.panelType === 'buff'));
});

test('Dash é uma additional skill e nenhuma skill mantém peso manual', () => {
  assert.equal(skills.find(skill => skill.id === 'dash').panelType, 'additional');
  assert.ok(skills.every(skill => !Object.hasOwn(skill, 'useWeight')));
});

test('skills mantêm somente o nível Active, sem estado de aprendizado', () => {
  assert.ok(skills.every(skill => Object.hasOwn(skill, 'activeLevel')));
  assert.ok(skills.every(skill => Object.hasOwn(skill, 'activeMax')));
  assert.ok(skills.every(skill => !Object.hasOwn(skill, 'learnedLevel')));
  assert.ok(skills.every(skill => !Object.hasOwn(skill, 'learnedMax')));
});

test('toda skill possui perfil explícito de ocorrências', () => {
  assert.ok(skills.every(skill => Number.isFinite(skill.hits) && skill.hits >= 1));
  assert.ok(skills.every(skill => Number.isFinite(skill.damageMultiplier) && skill.damageMultiplier >= 0));
  assert.ok(skills.every(skill => typeof skill.hitNote === 'string' && skill.hitNote.length > 0));
});

test('descrições multi-hit e efeitos ponderados alimentam o DPS', () => {
  const arrowStorm = skills.find(skill => skill.id === 'arrow_storm');
  const onslaught = skills.find(skill => skill.id === 'onslaught');
  const trueShot = skills.find(skill => skill.id === 'true_shot');
  const darkFire = skills.find(skill => skill.id === 'dark_fire');
  assert.equal(arrowStorm.hits, 8);
  assert.equal(onslaught.hits, 9.8);
  assert.equal(trueShot.hits, 2);
  assert.equal(trueShot.damageMultiplier, 4);
  assert.equal(trueShot.conditionalHits, true);
  assert.equal(darkFire.sustainedHitsPerSecond, 2);
});

test('Cross Strike converte Melee e Faith Attack Speed em dano', () => {
  const crossStrike = skills.find(skill => skill.id === 'cross_strike');
  assert.deepEqual(Array.from(crossStrike.cooldownSpeedCategories), []);
  assert.deepEqual(Array.from(crossStrike.damageSpeedCategories), ['melee', 'faith']);
});

test('todos os ícones gerados existem localmente', () => {
  const missing = skills.filter(skill => !fs.existsSync(path.join(root, skill.icon))).map(skill => skill.name);
  assert.equal(missing.length, 0);
});

test('modelo calibrado reproduz os baselines sem status', () => {
  const unarmed = formulas.attackVectorFromAttributes(
    { melee: 15, range: 15, magic: 15, faith: 15 },
    { melee: 0, range: 0, magic: 0, faith: 0 },
    {},
    data.attributeDamageModel
  );
  const global30 = formulas.attackVectorFromAttributes(
    { melee: 15, range: 15, magic: 15, faith: 15 },
    { melee: 30, range: 30, magic: 30, faith: 30 },
    {},
    data.attributeDamageModel
  );
  assert.deepEqual(Object.values(unarmed).map(Math.round), [16, 16, 16, 16]);
  assert.deepEqual(Object.values(global30).map(Math.round), [50, 50, 49, 50]);
});

test('modelo reproduz impactos primários e cruzados em 200 pontos', () => {
  const base = { melee: 15, range: 15, magic: 15, faith: 15 };
  const none = { melee: 0, range: 0, magic: 0, faith: 0 };
  const global30 = { melee: 30, range: 30, magic: 30, faith: 30 };
  const str = formulas.attackVectorFromAttributes(base, none, { str: 200 }, data.attributeDamageModel);
  const dex = formulas.attackVectorFromAttributes(base, global30, { dex: 200 }, data.attributeDamageModel);
  const int = formulas.attackVectorFromAttributes(base, none, { int: 200 }, data.attributeDamageModel);
  const spr = formulas.attackVectorFromAttributes(base, global30, { spr: 200 }, data.attributeDamageModel);
  assert.ok(Math.abs(str.melee - 128) < 1);
  assert.ok(Math.abs(str.faith - 45) < 1);
  assert.ok(Math.abs(dex.range - 389) < 1);
  assert.ok(Math.abs(int.magic - 127) < 1);
  assert.ok(Math.abs(spr.melee - 134) < 1);
  assert.ok(Math.abs(spr.range - 118) < 1);
  assert.ok(Math.abs(spr.magic - 199) < 1);
  assert.ok(Math.abs(spr.faith - 389) < 1);
});

test('modelo isola W e a contribuição da arma sem alterar o total calibrado', () => {
  const breakdown = formulas.attackDamageBreakdown('melee', 15, 30, { str: 100, spr: 25 }, data.attributeDamageModel);
  const expectedMultiplier = 1.133333 + 0.03727 * 100 + 0.00931 * 25;
  assert.ok(Math.abs(breakdown.weaponMultiplier - expectedMultiplier) < 1e-9);
  assert.ok(Math.abs(breakdown.weaponContribution - 30 * expectedMultiplier) < 1e-9);
  assert.ok(Math.abs(breakdown.total - (breakdown.damageWithoutWeapon + breakdown.weaponContribution)) < 1e-9);
  assert.equal(
    breakdown.total,
    formulas.attackDamageFromAttributes('melee', 15, 30, { str: 100, spr: 25 }, data.attributeDamageModel)
  );
});
