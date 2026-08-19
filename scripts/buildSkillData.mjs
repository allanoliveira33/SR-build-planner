import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const jsonPath = path.join(ROOT, 'skills.json');
const outputPath = path.join(ROOT, 'skill-data.js');

const DAMAGE_KEYS = new Set(['melee', 'range', 'magic', 'faith']);
const FORCED_BASIC_ATTACKS = new Set(['Soul Shot']);
const FORCED_ADDITIONAL_SKILLS = new Set(['Onslaught']);
const ACTIVE_BUFFS = new Set([
  'Bloodlust',
  'Blue Moon',
  'Bullseye',
  'Feather Jump',
  'Shadow Step',
  'Taunt',
  'Empower',
  'Armor Link',
  'Burst Shield',
  'Divine Blessing',
  'Divine Protection',
  'Life Line',
  'Perseverance'
]);
const INITIAL_ACTIVE_LEVELS = {
  slash: 5,
  heavy_strike: 5,
  upward_strike: 3,
  onslaught: 5,
  taunt: 5,
  revitalize: 4
};

// Os valores de scaling expostos pelo jogo são tratados como dano por
// ocorrência. `hits` conta ocorrências reais; `damageMultiplier` permite
// representar ocorrências com pesos diferentes (por exemplo 1x + 3x).
const HIT_PROFILES = {
  crimson_moon: { hits: 15, damageMultiplier: 15, hitNote: '15 crescents descritos.' },
  flash_strike: { hits: 7, damageMultiplier: 7, hitNote: '7 golpes descritos.' },
  lunar_step: { hits: 5, damageMultiplier: 5, hitNote: '5 golpes descritos.' },
  magic_slash: {
    hits: 1,
    damageMultiplier: 1.1167,
    hitNote: '1 golpe por cooldown; média da cadeia (1x + 1x + 1,35x) / 3.'
  },
  slash: {
    hits: 1,
    damageMultiplier: 1.1167,
    hitNote: '1 golpe por cooldown; média da cadeia (1x + 1x + 1,35x) / 3.'
  },
  arrow_rain: { hits: 5, damageMultiplier: 5, hitNote: '5 flechas descritas.' },
  arrow_storm: {
    hits: 8,
    damageMultiplier: 8,
    hitNote: '8 flechas descritas; a descrição prevalece sobre 4 ataques/s × 1s.'
  },
  cursed_throw: {
    hits: 4,
    damageMultiplier: 2.5,
    conditionalHits: true,
    hitNote: '1 impacto + até 3 ativações de 0,5x; bônus contra boss não incluído.'
  },
  flare_arrow: { hits: 3, damageMultiplier: 3, hitNote: 'Impacto + 2 explosões.' },
  heaven_arrow: { hits: 25, damageMultiplier: 25, hitNote: '25 flechas descritas.' },
  messenger: {
    hits: 10,
    damageMultiplier: 10,
    conditionalHits: true,
    hitConfidence: 'review',
    hitNote: 'Até 10 procs de true damage; pressupõe que o aliado consuma todos.'
  },
  seirei: { hits: 2, damageMultiplier: 2, hitNote: '2 facas descritas.' },
  triple_throw: { hits: 3, damageMultiplier: 3, hitNote: '3 facas descritas.' },
  true_shot: {
    hits: 2,
    damageMultiplier: 4,
    conditionalHits: true,
    hitNote: 'Impacto de 1x + detonação de 3x; pressupõe que a bomba seja preenchida.'
  },
  flame_barrage: {
    hits: 7,
    damageMultiplier: 7,
    hitNote: '7 fireballs descritas; a descrição prevalece sobre 7/s × 1,05s.'
  },
  star_fall: { hits: 15, damageMultiplier: 15, hitNote: '15 estrelas descritas.' },
  soul_shot: {
    hits: 1,
    damageMultiplier: 1,
    hitNote: '1 projétil; perfurar até 2 alvos e o bônus de distância de até 1,3x não multiplicam o DPS-base.'
  },
  realm_piercing_arrow: {
    hits: 1,
    damageMultiplier: 1,
    hitNote: '1 projétil; quantidade de alvos atravessados e bônus de 2x contra boss não incluídos.'
  },
  burst_shield: {
    hits: 1,
    damageMultiplier: 5,
    conditionalHits: true,
    hitNote: '1 reflexão de 5x; pressupõe que o escudo receba um golpe.'
  },
  dark_fire: {
    hits: 1,
    damageMultiplier: 1,
    sustainedHitsPerSecond: 2,
    hitNote: 'Toggle contínuo: 2 ticks por segundo enquanto estiver ligado.'
  },
  cross_strike: {
    hits: 1,
    damageMultiplier: 1,
    hitNote: '1 impacto; bônus de 1,6x contra boss não incluído.'
  },
  punishment: { hits: 3, damageMultiplier: 3, hitNote: 'Impacto inicial + 2 erupções.' }
};

const FIXED_COOLDOWN_SKILLS = new Set(['Blue Moon', 'Cross Strike']);
const DAMAGE_SPEED_CATEGORIES = {
  'Cross Strike': ['melee', 'faith']
};

function idFromName(value) {
  return value
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function assetSlug(value) {
  return value
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\(skill\)/g, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function shortName(name) {
  return name.split(/\s+/).map(part => part[0]).join('').slice(0, 3).toUpperCase();
}

function stripWiki(value) {
  return value
    .replace(/\[\[File:[^\]]+\]\]/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/'''/g, '')
    .replace(/&bull;/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function levelValue(value) {
  const match = String(value).match(/(-?\d+(?:\.\d+)?)(?:\s*\(\+?(-?\d+(?:\.\d+)?)\/lv\))?/i);
  return match ? { base: Number(match[1]), perLevel: Number(match[2] || 0) } : null;
}

function rawField(description, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return description.match(new RegExp(`'''${escaped}:'''<\\/span>\\s*([^\\n]+)`, 'i'))?.[1]?.trim() || '';
}

function parseScaling(description) {
  const source = stripWiki(rawField(description, 'Scaling'));
  const scalings = {};
  const pattern = /([a-z_]+):\s*(-?\d+(?:\.\d+)?)(?:\s*\(\+?(-?\d+(?:\.\d+)?)\/lv\))?/gi;
  for (const match of source.matchAll(pattern)) {
    const sourceKey = match[1].toLowerCase();
    const key = ({ melee_damage: 'melee', range_damage: 'range', magic_damage: 'magic', faith_damage: 'faith', max_hp: 'health', max_mp: 'mana' })[sourceKey] || sourceKey;
    const multiplier = DAMAGE_KEYS.has(key) ? 100 : 1;
    scalings[key] = {
      base: Number((Number(match[2]) * multiplier).toFixed(4)),
      perLevel: Number((Number(match[3] || 0) * multiplier).toFixed(4))
    };
  }
  return scalings;
}

function skillKind(marker) {
  return marker.searchKeywords.slice(`${marker.name} ${marker.group} `.length).trim();
}

function skillClasses(description, fallback) {
  const match = description.match(/&bull;\s*[^&\n]+\s*&bull;\s*([^\n]+)/i);
  if (!match) return [fallback];
  return stripWiki(match[1]).split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
}

function panelTypeFor(marker, kind) {
  if (FORCED_BASIC_ATTACKS.has(marker.name)) return 'basic';
  if (FORCED_ADDITIONAL_SKILLS.has(marker.name)) return 'additional';
  if (kind === 'Basic Attack') return 'basic';
  if (/passive|buff\s*\/\s*toggle/i.test(kind) || ACTIVE_BUFFS.has(marker.name)) return 'buff';
  return 'additional';
}

function descriptionBody(description) {
  const section = description.split('----')[1] || '';
  return stripWiki(section.replace(/Known scaling[\s\S]*$/i, '').replace(/^\s*[-*]\s*/gm, '')).replace(/\n/g, ' ').trim();
}

function mpRegenPenalty(description) {
  const clean = stripWiki(description);
  const match = clean.match(/Lowers your MP regen by\s+(-?\d+(?:\.\d+)?)(?:\s*\(\+?(-?\d+(?:\.\d+)?)\/lv\))?/i);
  return match ? { base: Number(match[1]), perLevel: Number(match[2] || 0) } : null;
}

function hitProfile(id, attacksPerSecond, duration) {
  const explicit = HIT_PROFILES[id];
  if (explicit) {
    return {
      hitSource: 'descrição',
      hitConfidence: 'wiki',
      conditionalHits: false,
      sustainedHitsPerSecond: 0,
      ...explicit
    };
  }
  if (attacksPerSecond > 0 && duration > 0) {
    const hits = Number((attacksPerSecond * duration).toFixed(3));
    return {
      hits,
      damageMultiplier: hits,
      sustainedHitsPerSecond: 0,
      conditionalHits: false,
      hitSource: 'cadência × duração',
      hitConfidence: 'derived',
      hitNote: `${attacksPerSecond}/s × ${duration}s = ${hits} ocorrências esperadas.`
    };
  }
  return {
    hits: 1,
    damageMultiplier: 1,
    sustainedHitsPerSecond: 0,
    conditionalHits: false,
    hitSource: 'padrão de 1 hit',
    hitConfidence: 'assumption',
    hitNote: 'A descrição não informa múltiplos acertos; considerado 1 hit.'
  };
}

const map = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
const markers = Object.entries(map.markers).flatMap(([group, entries]) => entries.map(marker => ({ ...marker, group })));
const skills = markers.map(marker => {
  const id = idFromName(marker.name);
  const sourceSkillKind = skillKind(marker);
  const kind = FORCED_BASIC_ATTACKS.has(marker.name) ? 'Basic Attack' : FORCED_ADDITIONAL_SKILLS.has(marker.name) ? 'Active' : sourceSkillKind;
  const scalings = parseScaling(marker.description);
  const damageTypes = Object.keys(scalings).filter(key => DAMAGE_KEYS.has(key));
  const initialActiveLevel = INITIAL_ACTIVE_LEVELS[id] || 0;
  const cooldownMs = Number.parseFloat(rawField(marker.description, 'Cooldown'));
  const durationMs = Number.parseFloat(rawField(marker.description, 'Duration'));
  const attacksPerSecond = Number.parseFloat(rawField(marker.description, 'Attacks/sec'));
  const basePower = levelValue(stripWiki(rawField(marker.description, 'Base power')));
  const unlock = stripWiki(marker.description.match(/'''Unlock:'''<\/span>\s*([^\n]+)/i)?.[1] || '');
  const panelType = panelTypeFor(marker, kind);
  const duration = Number.isFinite(durationMs) ? durationMs / 1000 : 0;
  const attacksPerSecondValue = Number.isFinite(attacksPerSecond) ? attacksPerSecond : 0;
  const hits = hitProfile(id, attacksPerSecondValue, duration);

  return {
    id,
    mapNodeId: marker.id,
    name: marker.name,
    short: shortName(marker.name),
    icon: `assets/skill-icons/${assetSlug(marker.icon.replace(/\.png$/i, ''))}.png`,
    category: panelType === 'buff' ? 'utility' : damageTypes.length > 1 ? 'hybrid' : marker.group,
    group: marker.group,
    classes: skillClasses(marker.description, marker.group),
    panelType,
    slotSource: FORCED_BASIC_ATTACKS.has(marker.name) || FORCED_ADDITIONAL_SKILLS.has(marker.name) ? 'correção do jogo' : 'skills.json',
    skillKind: kind,
    sourceSkillKind,
    activeLevel: initialActiveLevel,
    activeMax: 20,
    cooldown: Number.isFinite(cooldownMs) && cooldownMs > 0 ? cooldownMs / 1000 : null,
    duration,
    attacksPerSecond: attacksPerSecondValue,
    ...hits,
    basePower,
    mpRegenPenalty: mpRegenPenalty(marker.description),
    description: descriptionBody(marker.description),
    unlock,
    sourceStatus: 'skills.json · wiki.gg',
    confidence: 'wiki',
    scalings,
    damageTypes,
    nonDamage: damageTypes.length === 0,
    cooldownSpeedCategories: FIXED_COOLDOWN_SKILLS.has(marker.name) ? [] : [marker.group],
    cooldownSpeedConfidence: 'wiki',
    acceptsGlobalAttackSpeed: true,
    damageSpeedCategories: DAMAGE_SPEED_CATEGORIES[marker.name] || [],
    acceptsGlobalDamageSpeed: true
  };
});

const existing = await fs.readFile(outputPath, 'utf8');
const skillsIndex = existing.indexOf('  skills:');
if (skillsIndex < 0) throw new Error('Bloco skills não encontrado em skill-data.js');
const prefix = existing.slice(0, skillsIndex);
const output = `${prefix}  skills: ${JSON.stringify(skills, null, 2)}\n};\n`;
await fs.writeFile(outputPath, output, 'utf8');

const counts = skills.reduce((result, skill) => {
  result[skill.panelType] = (result[skill.panelType] || 0) + 1;
  return result;
}, {});
console.log(`skill-data.js atualizado: ${skills.length} skills (${Object.entries(counts).map(([key, value]) => `${key}=${value}`).join(', ')}).`);
