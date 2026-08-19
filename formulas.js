(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PLANNER_FORMULAS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DAMAGE_TYPES = ['melee', 'range', 'magic', 'faith'];

  function finite(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, finite(value, min)));
  }

  function totalScaleComponent(component, level) {
    if (!component || finite(level) <= 0) return 0;
    return finite(component.base) + finite(component.perLevel) * Math.max(0, finite(level) - 1);
  }

  function scalingTotals(skill, level = skill && skill.activeLevel) {
    const totals = {};
    Object.entries((skill && skill.scalings) || {}).forEach(([type, component]) => {
      totals[type] = totalScaleComponent(component, level);
    });
    return totals;
  }

  function hitCount(skill) {
    return Math.max(1, finite(skill && skill.hits, 1));
  }

  function totalDamageMultiplier(skill) {
    const configured = Number(skill && skill.damageMultiplier);
    return Math.max(0, Number.isFinite(configured) ? configured : hitCount(skill));
  }

  function attributeImpactPerPoint(type, rawAttack, attribute, model = {}) {
    const attack = Math.max(0, finite(rawAttack));
    return attack * finite(model.impacts && model.impacts[type] && model.impacts[type][attribute]);
  }

  function attributeScalingTerm(type, attributes = {}, model = {}) {
    return Object.entries(model.impacts && model.impacts[type] || {}).reduce((sum, [attribute, coefficient]) => {
      return sum + finite(coefficient) * Math.max(0, finite(attributes[attribute]));
    }, 0);
  }

  function attackDamageBreakdown(type, baseAttack, weaponAttack, attributes = {}, model = {}) {
    const base = Math.max(0, finite(baseAttack));
    const weapon = Math.max(0, finite(weaponAttack));
    const baseline = model.baseline && model.baseline[type] || {};
    const baselineMultiplier = finite(baseline.multiplier, 1);
    const scalingTerm = attributeScalingTerm(type, attributes, model);
    const damageWithoutWeaponRaw = base * (baselineMultiplier + scalingTerm) + finite(baseline.offset);
    const damageWithoutWeapon = base > 0 ? Math.max(0, damageWithoutWeaponRaw) : 0;
    const weaponMultiplier = baselineMultiplier + scalingTerm;
    const weaponTerm = weapon * weaponMultiplier;
    const total = base + weapon > 0 ? Math.max(0, damageWithoutWeaponRaw + weaponTerm) : 0;
    return {
      type,
      baseAttack: base,
      weaponAttack: weapon,
      scalingTerm,
      damageWithoutWeapon,
      weaponMultiplier,
      weaponTerm,
      weaponContribution: total - damageWithoutWeapon,
      total
    };
  }

  function attackDamageFromAttributes(type, baseAttack, weaponAttack, attributes = {}, model = {}) {
    return attackDamageBreakdown(type, baseAttack, weaponAttack, attributes, model).total;
  }

  function attackVectorFromAttributes(baseAttack = {}, weaponAttack = {}, attributes = {}, model = {}) {
    return Object.fromEntries(DAMAGE_TYPES.map(type => [
      type,
      attackDamageFromAttributes(type, baseAttack[type], weaponAttack[type], attributes, model)
    ]));
  }

  function attackVectorBreakdown(baseAttack = {}, weaponAttack = {}, attributes = {}, model = {}) {
    return Object.fromEntries(DAMAGE_TYPES.map(type => [
      type,
      attackDamageBreakdown(type, baseAttack[type], weaponAttack[type], attributes, model)
    ]));
  }

  function damagePerHit(skill, attacks, options = {}) {
    if (!skill || skill.nonDamage || finite(skill.activeLevel) <= 0) return 0;
    const scales = scalingTotals(skill, skill.activeLevel);
    const types = options.damageTypes || DAMAGE_TYPES;
    const scalingDamage = types.reduce((sum, type) => {
      return sum + finite(attacks && attacks[type]) * finite(scales[type]) / 100;
    }, 0);
    const basePower = totalScaleComponent(skill.basePower, skill.activeLevel);
    const bonusMultiplier = 1 + Math.max(0, finite(options.bonusDamage)) / 100;
    const speedMultiplier = damageSpeedMultiplier(skill, options.combatStats || {});
    return (basePower + scalingDamage) * bonusMultiplier * speedMultiplier;
  }

  function damagePerCast(skill, attacks, options = {}) {
    return damagePerHit(skill, attacks, options) * totalDamageMultiplier(skill);
  }

  function expectedCritMultiplier(critChance, critDamage) {
    const chance = clamp(critChance, 0, 100) / 100;
    const multiplier = Math.max(1, finite(critDamage, 150) / 100);
    return 1 + chance * (multiplier - 1);
  }

  function effectiveCooldown(skill, combatStats = {}) {
    const base = finite(skill && skill.cooldown);
    if (base <= 0) return null;
    const categories = [...new Set((skill && skill.cooldownSpeedCategories) || (skill && skill.cooldownSpeedCategory ? [skill.cooldownSpeedCategory] : []))];
    if (!categories.length) return base;
    const categorySpeed = categories.reduce((sum, category) => sum + finite(combatStats[`${category}AttackSpeed`]), 0);
    const globalSpeed = skill.acceptsGlobalAttackSpeed === false ? 0 : finite(combatStats.globalAttackSpeed);
    return base / Math.max(.05, 1 + (categorySpeed + globalSpeed) / 100);
  }

  function damageSpeedMultiplier(skill, combatStats = {}) {
    const categories = [...new Set((skill && skill.damageSpeedCategories) || [])];
    if (!categories.length) return 1;
    const categorySpeed = categories.reduce((sum, category) => sum + finite(combatStats[`${category}AttackSpeed`]), 0);
    const globalSpeed = skill.acceptsGlobalDamageSpeed === false ? 0 : finite(combatStats.globalAttackSpeed);
    return Math.max(.05, 1 + (categorySpeed + globalSpeed) / 100);
  }

  function damageFactorPerSecond(skill, combatStats = {}) {
    const sustainedRate = Math.max(0, finite(skill && skill.sustainedHitsPerSecond));
    if (sustainedRate > 0) return sustainedRate * totalDamageMultiplier(skill);
    const cooldown = effectiveCooldown(skill, combatStats);
    return cooldown === null ? null : totalDamageMultiplier(skill) / cooldown;
  }

  function skillDps(skill, attacks, combatStats = {}) {
    const factorPerSecond = damageFactorPerSecond(skill, combatStats);
    if (factorPerSecond === null || skill.nonDamage) return null;
    const perHit = damagePerHit(skill, attacks, {
      bonusDamage: combatStats.bonusDamage,
      damageTypes: DAMAGE_TYPES,
      combatStats
    });
    const withCrit = perHit * expectedCritMultiplier(combatStats.critChance, combatStats.critDamage);
    return withCrit * factorPerSecond;
  }

  function rotationDps(skills, attacks, combatStats = {}) {
    const eligible = (skills || []).filter(skill => {
      return finite(skill.activeLevel) > 0 && !skill.nonDamage && damageFactorPerSecond(skill, combatStats) !== null;
    });
    if (!eligible.length) return { total: 0, rows: [] };
    const rows = eligible.map(skill => {
      const perHit = damagePerHit(skill, attacks, { bonusDamage: combatStats.bonusDamage, combatStats });
      const critMultiplier = expectedCritMultiplier(combatStats.critChance, combatStats.critDamage);
      const damage = perHit * totalDamageMultiplier(skill) * critMultiplier;
      const cooldown = effectiveCooldown(skill, combatStats);
      const factorPerSecond = damageFactorPerSecond(skill, combatStats);
      const dps = factorPerSecond === null ? 0 : perHit * critMultiplier * factorPerSecond;
      return { skill, perHit: perHit * critMultiplier, damage, cooldown, factorPerSecond, dps, contribution: dps, weighted: dps };
    });
    const total = rows.reduce((sum, row) => sum + row.contribution, 0);
    rows.forEach(row => { row.contributionShare = total > 0 ? row.contribution / total : 0; });
    return { total, rows };
  }

  function rotationDpsByType(skills, attacks, combatStats = {}) {
    const dps = Object.fromEntries(DAMAGE_TYPES.map(type => [type, 0]));
    (skills || []).forEach(skill => {
      const factorPerSecond = damageFactorPerSecond(skill, combatStats);
      if (finite(skill && skill.activeLevel) <= 0 || skill.nonDamage || factorPerSecond === null) return;
      const scales = scalingTotals(skill, skill.activeLevel);
      const byType = Object.fromEntries(DAMAGE_TYPES.map(type => [
        type,
        finite(attacks && attacks[type]) * finite(scales[type]) / 100
      ]));
      const scalingDamage = DAMAGE_TYPES.reduce((sum, type) => sum + byType[type], 0);
      const basePower = totalScaleComponent(skill.basePower, skill.activeLevel);
      const skillDamageTypes = DAMAGE_TYPES.filter(type => Object.hasOwn(scales, type));
      const sharedMultiplier = (1 + Math.max(0, finite(combatStats.bonusDamage)) / 100)
        * expectedCritMultiplier(combatStats.critChance, combatStats.critDamage)
        * damageSpeedMultiplier(skill, combatStats)
        * factorPerSecond;
      DAMAGE_TYPES.forEach(type => {
        const flatShare = scalingDamage > 0
          ? byType[type] / scalingDamage
          : skillDamageTypes.includes(type) && skillDamageTypes.length
            ? 1 / skillDamageTypes.length
            : 0;
        dps[type] += (byType[type] + basePower * flatShare) * sharedMultiplier;
      });
    });
    const total = DAMAGE_TYPES.reduce((sum, type) => sum + dps[type], 0);
    const shares = Object.fromEntries(DAMAGE_TYPES.map(type => [type, total > 0 ? dps[type] / total : 0]));
    return { total, dps, shares };
  }

  function weaponVector(archetype, ratios) {
    const power = archetype.kind === 'single'
      ? finite(ratios.single)
      : archetype.kind === 'dual'
        ? finite(ratios.dual)
        : finite(ratios.global);
    const vector = Object.fromEntries(DAMAGE_TYPES.map(type => [type, 0]));
    (archetype.types || []).forEach(type => { vector[type] = power; });
    return vector;
  }

  return {
    DAMAGE_TYPES,
    totalScaleComponent,
    scalingTotals,
    hitCount,
    totalDamageMultiplier,
    attributeImpactPerPoint,
    attributeScalingTerm,
    attackDamageBreakdown,
    attackDamageFromAttributes,
    attackVectorFromAttributes,
    attackVectorBreakdown,
    damagePerHit,
    damagePerCast,
    expectedCritMultiplier,
    effectiveCooldown,
    damageSpeedMultiplier,
    damageFactorPerSecond,
    skillDps,
    rotationDps,
    rotationDpsByType,
    weaponVector
  };
});
