(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PLANNER_FORMULAS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DAMAGE_TYPES = ['melee', 'range', 'magic', 'faith'];
  const ATTRIBUTES = ['str', 'dex', 'int', 'spr', 'con', 'luk'];
  const TYPE_SCALE = {
    melee: { str: 1, con: .26, spr: .25 }, range: { dex: 1, luk: .65, spr: .20 },
    magic: { int: 1, spr: .45, luk: .35 }, faith: { spr: 1, str: .25, con: .2925 }
  };
  const CONVERSIONS = {
    melee: ['magic', 'magicToMeleePercent'], range: ['faith', 'faithToRangePercent'],
    magic: ['melee', 'meleeToMagicPercent'], faith: ['range', 'rangeToFaithPercent']
  };
  const PERIODIC_SKILLS = new Set(['flame_barrage', 'arrow_storm', 'onslaught', 'star_fall', 'arcane_surge', 'whirlwind', 'heaven_arrow', 'force_of_will', 'dark_fire', 'holy_field']);
  const FIXED_COOLDOWN_SKILLS = new Set(['bloodlust', 'shadow_twin', 'perseverance', 'vanguard', 'cross_strike', 'dash', 'blink', 'blue_moon', 'life_line']);

  function finite(value, fallback = 0) { const n = Number(value); return Number.isFinite(n) ? n : fallback; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, finite(value, min))); }
  function pct(value) { return 1 + finite(value) / 100; }
  function cap(value) { return value[0].toUpperCase() + value.slice(1); }
  function valueAt(component, level) {
    if (!component || finite(level) <= 0) return 0;
    return finite(component.base ?? component.amount) + finite(component.perLevel ?? component.per_level) * Math.max(0, finite(level) - 1);
  }

  function milestoneBonus(level, every, amount, maxLevel = 99) {
    return Math.floor(clamp(level, 0, maxLevel) / Math.max(1, finite(every, 1))) * finite(amount);
  }
  function passiveBonuses(levels = {}, rules = {}) {
    const totals = {};
    Object.entries(rules).forEach(([type, rule]) => {
      if (type === 'maxLevel' || !rule?.bonuses) return;
      rule.bonuses.forEach(b => { totals[b.key] = finite(totals[b.key]) + milestoneBonus(levels[type], b.every, b.amount, rules.maxLevel || 99); });
    });
    return totals;
  }

  function skillPointBudget(characterLevel, model = {}) {
    const level = Math.max(1, Math.floor(finite(characterLevel, 1)));
    return finite(model.starting, 1) + (level - 1) * finite(model.perLevelUp, 1)
      + Math.floor(level / 5) * finite(model.every5, 1) + Math.floor(level / 10) * finite(model.every10, 1);
  }
  function skillPointForLevel(skill, level = skill?.activeLevel) {
    const lv = Math.max(0, Math.floor(finite(level)));
    if (!skill || !lv || skill.panelType === 'buff' || skill.panelType === 'passive') return 0;
    if (Array.isArray(skill.spCosts) && skill.spCosts.length) return finite(skill.spCosts[Math.min(lv, skill.spCosts.length) - 1]);
    return Math.max(0, finite(skill.spCostBase, 1)) + Math.max(0, lv - 1);
  }
  function skillPointCost(skills = []) { return skills.reduce((sum, skill) => sum + skillPointForLevel(skill), 0); }
  function minimumLevelForSkillPoints(points, model = {}, maxLevel = 9999) {
    for (let level = 1; level <= maxLevel; level += 1) if (skillPointBudget(level, model) >= finite(points)) return level;
    return null;
  }
  function buildRequirements(skills = [], progressionModel = {}) {
    const points = skillPointCost(skills);
    const spLevel = minimumLevelForSkillPoints(points, progressionModel.skillPoints || {});
    const buffCount = skills.filter(s => s.panelType === 'buff' && finite(s.activeLevel) > 0).length;
    const rule = progressionModel.buffs || {};
    const buffLevel = buffCount > finite(rule.pre60Limit, 2) ? finite(rule.thirdSlotLevel, 60) : 1;
    return { points, spLevel, buffCount, buffLevel, minimumLevel: Math.max(spLevel || 1, buffLevel) };
  }

  function primaryStats(allocated = {}, additive = {}, percentages = {}) {
    const raw = {}, final = {};
    ATTRIBUTES.forEach(key => {
      raw[key] = 1 + finite(allocated[key]) + finite(additive[key]);
      final[key] = raw[key] * pct(percentages[key]);
    });
    return { raw, final };
  }
  function attackScale(type, stats = {}) {
    return Object.entries(TYPE_SCALE[type] || {}).reduce((sum, [key, coefficient]) => sum + finite(stats[key]) * coefficient, 0);
  }
  function attackDamageVector(stats = {}, modifiers = {}) {
    const globalAttack = 15 + finite(modifiers.additiveGlobalAttack);
    const original = {}, attacks = {}, scales = {};
    DAMAGE_TYPES.forEach(type => {
      const typeAttack = globalAttack + finite(modifiers[`additive${cap(type)}Attack`]);
      scales[type] = attackScale(type, stats);
      original[type] = typeAttack * (30 + scales[type]) / 30 * pct(modifiers.globalDamagePercent) * pct(modifiers[`${type}DamagePercent`]);
      attacks[type] = original[type];
    });
    DAMAGE_TYPES.forEach(type => {
      const [source, key] = CONVERSIONS[type];
      attacks[type] += original[source] * finite(modifiers[key]) / 100;
    });
    return { globalAttack, scales, original, attacks };
  }

  function characterSheet(options = {}) {
    const level = clamp(Math.floor(finite(options.level, 1)), 1, 99);
    const passive = passiveBonuses(options.passiveLevels || {}, options.passiveRules || {});
    const primary = primaryStats(options.allocated || {}, options.primaryAdditive || {}, options.primaryPercent || {});
    const s = primary.final, m = options.modifiers || {}, damage = attackDamageVector(s, m);
    const maxHp = (50 + 2.5 * (level - 1) + finite(m.additiveMaxHP) + finite(passive.maxHp) + 2.5 * s.con) * pct(m.maxHPPercent);
    const maxMp = (10 + (level - 1) + finite(m.additiveMaxMP) + finite(passive.maxMp) + 1.2 * s.spr) * pct(m.maxMPPercent);
    const defense = (finite(m.additiveDefense) + finite(passive.defense) + s.con / 10) * pct(m.defensePercent);
    const critRate = (finite(m.additiveCritRate) + finite(passive.critChance) + 65 * Math.log10(s.luk / 32 + 1)) * pct(m.critRatePercent);
    const critDamage = (50 + finite(m.additiveCritDamage)) * pct(m.critDamagePercent);
    const elementChance = 15 + finite(m.additiveElementChance) + finite(passive.elementChance);
    const elementPotency = 50 + finite(m.additiveElementPotency) + finite(passive.elementPotency);
    const hpRegenTick = (s.con / 12) / (1 + s.con / 100) + 1 + (s.con / 10000) * maxHp + finite(passive.hpRegen) + finite(m.additiveHPRegenPerTick);
    const mpCore = 3 + ((s.spr * 2) / 8.5) / (1 + (s.spr / 4.5) / 100 + s.spr / 220);
    const mpRegenTick = mpCore + .03 * maxMp + finite(passive.mpRegen) + finite(m.additiveMPRegenPerTick);
    return {
      level, totalAP: level * 5, spentAP: ATTRIBUTES.reduce((sum, key) => sum + finite(options.allocated?.[key]), 0),
      primaryRaw: primary.raw, primary: s, passiveBonuses: passive,
      globalAttack: damage.globalAttack, attackScale: damage.scales, originalDamage: damage.original, damage: damage.attacks,
      maxHp, maxMp, shield: finite(m.additiveShield) + finite(passive.shield), defense,
      critRate, critDamage, expectedCritMultiplier: expectedCritMultiplier(critRate, critDamage),
      elementChance, elementPotency, damageReduction: finite(m.damageReduction) + finite(passive.damageReduction),
      hpRegenTick, hpRegenPerSecond: hpRegenTick / 1.5, mpRegenTick, mpRegenPerSecond: mpRegenTick / 1.5,
      hpOnHitChance: finite(m.hpOnHitChance) + finite(passive.hpOnHitChance), mpOnHitChance: finite(m.mpOnHitChance) + finite(passive.mpOnHitChance),
      accuracy: finite(m.accuracy), damageBalance: finite(m.damageBalance, 100), armorPenetration: finite(m.armorPenetration),
      defenseIgnore: finite(m.defenseIgnore), attackPierce: finite(m.attackPierce), flatDamageBonus: finite(m.flatDamageBonus), trueDamageBonus: finite(m.trueDamageBonus)
    };
  }
  function characterProgression(level, attributes = {}, passiveLevels = {}, model = {}, rules = {}) {
    const sheet = characterSheet({ level, allocated: attributes, passiveLevels, passiveRules: rules });
    return { maxHp: sheet.maxHp, maxMp: sheet.maxMp, shield: sheet.shield, defense: sheet.defense, hpRegen: sheet.hpRegenTick, mpRegen: sheet.mpRegenTick, critChance: sheet.critRate, elementChance: sheet.elementChance, elementPotency: sheet.elementPotency, damageReduction: sheet.damageReduction, hpOnHitChance: sheet.hpOnHitChance, mpOnHitChance: sheet.mpOnHitChance, passiveBonuses: sheet.passiveBonuses };
  }

  function totalScaleComponent(component, level) { return valueAt(component, level); }
  function scalingTotals(skill, level = skill?.activeLevel) { return Object.fromEntries(Object.entries(skill?.scalings || {}).map(([key, component]) => [key, valueAt(component, level)])); }
  function runtimeLevel(skill) { return Math.max(1, finite(skill?.activeLevel, 1) + finite(skill?.bonusLevel)); }
  function hitCount(skill) {
    if (!skill) return 1;
    const level = runtimeLevel(skill), attackCount = Math.max(1, finite(skill.attackCount, skill.hits || 1));
    const aps = finite(skill.attacksPerSecond), duration = Math.max(0, valueAt(skill.durationRuntime || { base: skill.duration }, level));
    if (skill.id === 'gravity_well') return attackCount * aps * duration + 1;
    if (PERIODIC_SKILLS.has(skill.id) && duration > 0) return attackCount * aps * duration;
    if (skill.id === 'dark_fire') return Math.max(1, aps);
    return Math.max(1, finite(skill.hits, attackCount));
  }
  function totalDamageMultiplier(skill, context = {}) {
    if (!skill) return 1;
    if (skill.id === 'true_shot') return 4;
    if (skill.id === 'cursed_throw') return context.isBoss ? 8.5 : 2.5;
    if (skill.id === 'burst_shield') return 1.5;
    if (skill.id === 'messenger') return 3.5;
    if (skill.id === 'medishot') return 4;
    if (['slash','magic_slash'].includes(skill.id)) return 1.1167;
    return hitCount(skill);
  }
  function expectedCritMultiplier(chance, bonusDamage = 50) { return 1 + clamp(chance, 0, 100) / 100 * Math.max(0, finite(bonusDamage, 50)) / 100; }

  function cooldownReductionFor(skill, combat = {}) {
    if (FIXED_COOLDOWN_SKILLS.has(skill?.id)) return 0;
    const categories = [...new Set(skill?.classes || [skill?.group].filter(Boolean))];
    return finite(combat.globalCooldownReduction ?? combat.globalAttackSpeed) + categories.reduce((sum, type) => sum + finite(combat[`${type}CooldownReduction`] ?? combat[`${type}AttackSpeed`]), 0);
  }
  function effectiveCooldown(skill, combat = {}) {
    let ms = finite(skill?.cooldownMs, finite(skill?.cooldown) * 1000);
    if (ms <= 0) return null;
    const level = runtimeLevel(skill);
    if (skill.id === 'divine_protection') ms = Math.max(1, ms - (level - 1) * 4000);
    const durationMs = Math.max(0, valueAt(skill.durationRuntimeMs || { base: finite(skill.duration) * 1000 }, level));
    if (skill.id === 'shadow_step') ms = Math.max(ms, durationMs + 2000);
    if (skill.id === 'force_of_will') ms = Math.max(ms, durationMs + 1000);
    return Math.round(ms / Math.max(.05, 1 + cooldownReductionFor(skill, combat) / 100)) / 1000;
  }
  function damageSpeedMultiplier(skill, combat = {}) {
    if (skill?.id !== 'cross_strike') return 1;
    return Math.max(.05, 1 + (finite(combat.meleeCooldownReduction ?? combat.meleeAttackSpeed) + finite(combat.faithCooldownReduction ?? combat.faithAttackSpeed)) / 100);
  }
  function damageFactorPerSecond(skill, combat = {}, context = {}) {
    if (skill?.id === 'dark_fire') return Math.max(0, finite(skill.attacksPerSecond, 2));
    const cd = effectiveCooldown(skill, combat);
    return cd === null ? null : totalDamageMultiplier(skill, context) / cd;
  }
  function specialPreDefenseMultiplier(skill, context, level) {
    let result = 1;
    if (['heavy_strike','soul_shot','arrow_rain','arrow_storm','holy_arrow','flare_arrow','holy_field','realm_piercing_arrow','true_shot'].includes(skill.id)) result *= .33 + clamp(context.chargePercent, 0, 100) / 100 * 2 / 3;
    if (skill.id === 'soul_shot') result *= 1 + .3 * clamp(context.distancePercent, 0, 100) / 100;
    if (skill.id === 'cross_strike' && context.isBoss) result *= 1.6;
    if (skill.id === 'realm_piercing_arrow' && context.isBoss) result *= 2;
    if (skill.id === 'dark_fire') result *= 1 + Math.min(5, Math.max(0, finite(context.crowdCount))) * .03;
    if (skill.id === 'empower') result *= 1.232875 + .0388125 * level;
    return result;
  }
  function flatDamageAllocation(skill, combat = {}) {
    const bonus = finite(combat.flatDamageBonus);
    if (!bonus || !skill) return 0;
    const level = runtimeLevel(skill);
    const targets = Math.max(1, Math.floor(valueAt(skill.mobCount || {base:1}, level))) + Math.max(0, finite(combat.attackPierce));
    const hits = Math.max(1, hitCount(skill));
    let flat = bonus / (targets * hits);
    const cooldown = Math.max(0, finite(skill.cooldownMs, finite(skill.cooldown) * 1000)) / 1000;
    if (cooldown > .001) flat *= 1 + cooldown / 6;
    const duration = Math.max(0, valueAt(skill.durationRuntime || {base:finite(skill.duration)}, level));
    if (PERIODIC_SKILLS.has(skill.id) && finite(skill.attacksPerSecond) > 0 && duration > 0) flat = flat / Math.max((finite(skill.attacksPerSecond) * duration) / 1.5, 1e-9) * 2;
    if (targets > 1) flat /= targets;
    return flat;
  }
  function damagePerHit(skill, attacks = {}, options = {}) {
    if (!skill || skill.nonDamage || finite(skill.activeLevel) <= 0) return 0;
    const level = runtimeLevel(skill), scaling = scalingTotals(skill, level);
    const scaled = Object.entries(scaling).reduce((sum, [stat, coefficient]) => sum + finite(attacks[stat]) * finite(coefficient) / (DAMAGE_TYPES.includes(stat) ? 100 : 1), 0);
    const base = finite(skill.basePower?.base) + Math.max(0, level - 1) * finite(skill.basePower?.perLevel);
    const flat = options.flatDamageAllocated === undefined ? flatDamageAllocation(skill, options.combatStats) : finite(options.flatDamageAllocated);
    let value = Math.trunc(base + flat + scaled);
    value *= damageSpeedMultiplier(skill, options.combatStats || {});
    value *= specialPreDefenseMultiplier(skill, options.context || {}, level);
    return Math.max(0, value * .94);
  }
  function hitChanceMultiplier(context = {}, combat = {}) {
    const effective = finite(context.playerLevel, 1) + finite(combat.accuracy), target = finite(context.targetLevel, effective);
    if (target <= effective + 10) return 1;
    if (target >= effective + 20) return 0;
    return 1 - ((target - effective - 10) / 10) ** 2;
  }
  function defenseMultiplier(context = {}, combat = {}) {
    const target = finite(context.targetDefense);
    const effective = target - finite(combat.armorPenetration) - 3 * finite(context.weakenedStacks) - target * clamp(combat.defenseIgnore, 0, 100) / 100;
    return { effective, multiplier: effective >= 0 ? 40 / (40 + Math.abs(effective)) : 1 + Math.abs(effective) / 40 };
  }
  function applyTargetPipeline(base, context = {}, combat = {}) {
    let value = finite(base) * hitChanceMultiplier(context, combat);
    if (context.elementLoaded) {
      const p=clamp(combat.elementChance,0,100)/100;
      let procHit=value*(1+.8*finite(combat.elementPotency)/100);
      const chargeLevel=Math.max(0,finite(combat.elementalChargeLevel));
      if(chargeLevel>0)procHit+=50+25*chargeLevel+procHit/Math.max(1,100-2*chargeLevel);
      value=(1-p)*value+p*procHit;
    }
    value *= 1 + .1 * Math.max(0, finite(context.frozenStacks));
    const defense = defenseMultiplier(context, combat);
    value = Math.max(1, Math.round((value - defense.effective / 3) * defense.multiplier));
    if (context.isBoss) value *= finite(context.bossMultiplier, 1);
    value += finite(combat.trueDamageBonus);
    return value * expectedCritMultiplier(combat.critRate ?? combat.critChance, combat.critDamage);
  }
  function multiTargetMultiplier(skill, combat = {}, context = {}) {
    const level=runtimeLevel(skill);
    const totalTargets=Math.max(1,Math.floor(valueAt(skill?.mobCount || {base:1},level)))+Math.max(0,finite(combat.attackPierce));
    const actual=Math.max(1,Math.floor(finite(context.actualTargets,1)));
    let aggregate=1;
    if(totalTargets>1){
      const r=.5,f=.25,norm=(1-r)/(1-r**totalTargets);
      aggregate=0;
      for(let i=0;i<Math.min(totalTargets,actual);i+=1)aggregate+=f+(1-f)*(totalTargets*r**i*norm);
    }
    if(context.isBoss)aggregate*=1+(totalTargets-1)/1.2;
    return aggregate;
  }
  function damagePerCast(skill, attacks, options = {}) { return applyTargetPipeline(damagePerHit(skill, attacks, options), options.context, options.combatStats) * totalDamageMultiplier(skill, options.context) * multiTargetMultiplier(skill, options.combatStats, options.context); }
  function skillDps(skill, attacks, combat = {}, context = {}) {
    const factor = damageFactorPerSecond(skill, combat, context);
    if (factor === null || skill?.nonDamage) return null;
    return applyTargetPipeline(damagePerHit(skill, attacks, { combatStats: combat, context }), context, combat) * factor * multiTargetMultiplier(skill,combat,context);
  }
  function skillMpCost(skill) { const level = runtimeLevel(skill); return finite(skill?.mpCost?.base) + (level - 1) * finite(skill?.mpCost?.perLevel); }
  function skillHealing(skill, sheet = {}, context = {}) {
    const level=runtimeLevel(skill),base=finite(skill?.basePower?.base)+Math.max(0,level-1)*finite(skill?.basePower?.perLevel);
    if(skill?.id==='revitalize')return base+Math.ceil(finite(sheet.maxHp)*(.01+.005*level)+finite(sheet.maxMp)*(.016+.008*level));
    if(skill?.id==='medishot'){
      const charge=.33+clamp(context.chargePercent,0,100)/100*2/3;
      const pulse=Math.max(1,Math.ceil((3+1.5*(level-1))*(1+.005*finite(sheet.elementPotency))*charge));
      return Math.floor(pulse*1.375)+6*Math.floor(pulse);
    }
    return 0;
  }
  function skillShield(skill, sheet = {}) {
    const level=runtimeLevel(skill);
    if(skill?.id==='whirlwind')return 25+5*(level-1)+.15*finite(sheet.primary?.int);
    if(skill?.id==='shield_slam')return Math.ceil(5+2*level+.08*finite(sheet.maxHp))*hitCount(skill);
    if(skill?.id==='magic_slash')return Math.round(1+.368421*(level-1))*hitCount(skill);
    return 0;
  }
  function rotationBuffMultiplier(skills = [], context = {}) {
    let multiplier = 1;
    const active = id => skills.find(skill => skill.id === id && finite(skill.activeLevel) > 0);
    const shadow = active('shadow_twin');
    if (shadow) multiplier *= 1 + Math.min(.39, .048 + .024 * runtimeLevel(shadow));
    const clarity = active('clarity');
    if (clarity && context.targetHasStatus) multiplier *= 1 + (8.4 + 1.68 * runtimeLevel(clarity)) / 100;
    const vanguard = active('vanguard');
    if (vanguard) multiplier *= 1.042 + .294 * (runtimeLevel(vanguard) - 1) / 19;
    return multiplier;
  }
  function rotationDps(skills, attacks, combat = {}, context = {}) {
    const buffMultiplier = rotationBuffMultiplier(skills, context);
    const rows = (skills || []).filter(s => finite(s.activeLevel) > 0 && !s.nonDamage && damageFactorPerSecond(s, combat, context) !== null).map(skill => {
      const perHit = applyTargetPipeline(damagePerHit(skill, attacks, { combatStats: combat, context }), context, combat);
      const count = hitCount(skill), factor = totalDamageMultiplier(skill, context), cooldown = effectiveCooldown(skill, combat), dps = (skillDps(skill, attacks, combat, context) || 0) * buffMultiplier;
      const mpCost = skill.id === 'onslaught' && skills.some(item => item.id === 'slash' && finite(item.activeLevel) > 0) ? 0 : skillMpCost(skill);
      const mpPerSecond = skill.id === 'dark_fire' ? 0 : mpCost / Math.max(cooldown || 1, .001);
      return { skill, perHit, damage: perHit * factor * multiTargetMultiplier(skill,combat,context), cooldown, factorPerSecond: damageFactorPerSecond(skill, combat, context), hitCount: count, damageFactor:factor, dps, contribution: dps, weighted: dps, mpCost, mpPerSecond, dpsPerMp: mpPerSecond > 0 ? dps / mpPerSecond : null };
    });
    const total = rows.reduce((sum, row) => sum + row.dps, 0);
    rows.forEach(row => { row.contributionShare = total > 0 ? row.dps / total : 0; });
    return { total, rows, mpPerSecond: rows.reduce((sum, row) => sum + row.mpPerSecond, 0) };
  }
  function rotationDpsByType(skills, attacks, combat = {}, context = {}) {
    const dps = Object.fromEntries(DAMAGE_TYPES.map(type => [type, 0]));
    const buffMultiplier = rotationBuffMultiplier(skills, context);
    (skills || []).forEach(skill => {
      if (finite(skill.activeLevel) <= 0 || skill.nonDamage) return;
      const scales = scalingTotals(skill, runtimeLevel(skill));
      const parts = Object.fromEntries(DAMAGE_TYPES.map(type => [type, finite(attacks[type]) * finite(scales[type]) / 100]));
      const sum = DAMAGE_TYPES.reduce((a, type) => a + parts[type], 0), total = (skillDps(skill, attacks, combat, context) || 0) * buffMultiplier;
      DAMAGE_TYPES.forEach(type => { dps[type] += sum > 0 ? total * parts[type] / sum : 0; });
    });
    const total = DAMAGE_TYPES.reduce((sum, type) => sum + dps[type], 0);
    return { total, dps, shares: Object.fromEntries(DAMAGE_TYPES.map(type => [type, total ? dps[type] / total : 0])) };
  }
  function weaponVector(archetype, ratios) {
    const power = finite(ratios[archetype.kind]), vector = Object.fromEntries(DAMAGE_TYPES.map(type => [type, 0]));
    (archetype.types || []).forEach(type => { vector[type] = power; }); return vector;
  }
  function attackDamageBreakdown(type, baseAttack, weaponAttack, attributes = {}) {
    const stats = primaryStats(attributes).final;
    const modifiers = { additiveGlobalAttack: finite(baseAttack, 15) - 15, [`additive${cap(type)}Attack`]: finite(weaponAttack) };
    const result = attackDamageVector(stats, modifiers);
    return { type, baseAttack: finite(baseAttack, 15), weaponAttack: finite(weaponAttack), rawAttack: finite(baseAttack, 15) + finite(weaponAttack), scalingTerm: result.scales[type] / 30, attackMultiplier: (30 + result.scales[type]) / 30, offset: 0, total: result.attacks[type] };
  }
  function attackDamageFromAttributes(type, base, weapon, attrs) { return attackDamageBreakdown(type, base, weapon, attrs).total; }
  function attackVectorFromAttributes(base = {}, weapon = {}, attrs = {}) { return Object.fromEntries(DAMAGE_TYPES.map(t => [t, attackDamageFromAttributes(t, base[t], weapon[t], attrs)])); }
  function attackVectorBreakdown(base = {}, weapon = {}, attrs = {}) { return Object.fromEntries(DAMAGE_TYPES.map(t => [t, attackDamageBreakdown(t, base[t], weapon[t], attrs)])); }
  function attributeScalingTerm(type, attrs = {}) { return attackScale(type, attrs) / 30; }
  function attributeImpactPerPoint(type, rawAttack, attribute) { return finite(rawAttack) * finite(TYPE_SCALE[type]?.[attribute]) / 30; }

  return { DAMAGE_TYPES, ATTRIBUTES, TYPE_SCALE, milestoneBonus, passiveBonuses, skillPointBudget, skillPointForLevel, skillPointCost,
    minimumLevelForSkillPoints, buildRequirements, primaryStats, attackScale, attackDamageVector, characterSheet, characterProgression,
    totalScaleComponent, scalingTotals, runtimeLevel, hitCount, totalDamageMultiplier, expectedCritMultiplier, effectiveCooldown,
    damageSpeedMultiplier, damageFactorPerSecond, flatDamageAllocation, damagePerHit, damagePerCast, skillDps, skillMpCost, skillHealing, skillShield, rotationBuffMultiplier, rotationDps, rotationDpsByType,
    hitChanceMultiplier, defenseMultiplier, applyTargetPipeline, multiTargetMultiplier, weaponVector, attackDamageBreakdown, attackDamageFromAttributes,
    attackVectorFromAttributes, attackVectorBreakdown, attributeScalingTerm, attributeImpactPerPoint };
});
