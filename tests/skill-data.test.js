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

test('proficiências são progressão automática e não ocupam slots de buff', () => {
  const proficiencies = skills.filter(skill => skill.skillKind === 'Proficiency (passive)');
  assert.deepEqual(Array.from(proficiencies, skill => skill.id).sort(), ['faith', 'magic', 'melee', 'range']);
  assert.ok(proficiencies.every(skill => skill.panelType === 'passive'));
  assert.ok(proficiencies.every(skill => skill.activeMax === 99));
  assert.ok(proficiencies.every(skill => skill.spCostBase === 0));
  const slottedBuffs = skills.filter(skill => /passive stance|buff\s*\/\s*toggle/i.test(skill.skillKind));
  assert.ok(slottedBuffs.every(skill => skill.panelType === 'buff'));
});

test('custos cumulativos de SP incorporados excluem buffs e proficiências', () => {
  assert.ok(skills.filter(skill => ['buff','passive'].includes(skill.panelType)).every(skill => skill.spCostBase === 0));
  assert.ok(skills.every(skill => Array.isArray(skill.spCosts) && skill.spCosts.length === 20));
  assert.deepEqual(Array.from(skills.find(skill => skill.id === 'heavy_strike').spCosts.slice(0,5)), [2,3,4,5,6]);
  assert.deepEqual(Array.from(skills.find(skill => skill.id === 'slash').spCosts.slice(0,5)), [0,1,2,3,4]);
  assert.equal(skills.find(skill => skill.id === 'blink').spCosts[19], 3);
  skills.filter(skill=>!['buff','passive'].includes(skill.panelType)).forEach(skill=>{
    assert.ok(skill.spCosts.every(Number.isInteger));
    assert.ok(skill.spCosts.every((cost,index,costs)=>index===0 || cost>=costs[index-1]));
  });
});

test('configuração inicial representa uma build limpa', () => {
  const levels = Object.fromEntries(['melee','range','magic','faith'].map(id => [id, skills.find(skill => skill.id === id).activeLevel]));
  assert.deepEqual(levels, { melee: 0, range: 0, magic: 0, faith: 0 });
  assert.ok(skills.every(skill => skill.activeLevel === 0));
});

test('referência da coleta continua validando a progressão', () => {
  const levels = { melee: 40, range: 41, magic: 45, faith: 45 };
  const stats = formulas.characterProgression(42, { con: 0, spr: 0, luk: 0 }, levels, data.progressionModel, data.passiveRules);
  assert.equal(Math.round(stats.maxHp), 171);
  assert.equal(Math.round(stats.maxMp), 70);
  assert.equal(stats.shield, 44);
  assert.equal(stats.defense, 5.1);
  assert.ok(stats.hpRegen > 4 && stats.hpRegen < 4.1);
  assert.ok(stats.mpRegen > 8.3 && stats.mpRegen < 8.4);
  assert.ok(stats.critChance > 6 && stats.critChance < 7);
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
  assert.ok(Math.abs(formulas.hitCount(onslaught) - 19.6) < 1e-9);
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

test('todas as skills mapeadas receberam dados de runtime', () => {
  assert.ok(skills.every(skill => skill.confidence === 'confirmed'));
  assert.ok(skills.every(skill => Number.isFinite(skill.cooldownMs)));
  assert.ok(skills.every(skill => skill.mpCost && Number.isFinite(skill.mpCost.base)));
  assert.ok(skills.every(skill => skill.mobCount && Number.isFinite(skill.mobCount.base)));
});
