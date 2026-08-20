(() => {
  'use strict';

  const DATA = window.SKILL_PLANNER_DATA;
  const TREE = window.SKILL_TREE_MAP || { nodes: [], skillIcons: {}, groups: {}, background: '' };
  const FORMULAS = window.PLANNER_FORMULAS;
  const STORAGE_KEY = 'souls_remnant_build_planner_v9';
  const LEGACY_STORAGE_KEYS = ['souls_remnant_build_planner_v8', 'souls_remnant_build_planner_v7', 'souls_remnant_build_planner_v6', 'souls_remnant_build_planner_v5'];
  const LOADOUT_COUNT = 5;
  const SLOT_LIMITS = { basic: 1, buff: 3 };
  const PANEL_LABELS = { basic: 'Basic Attack', buff: 'Buff', additional: 'Additional Skill', passive: 'Proficiency' };
  const TYPES = DATA.damageTypes;
  const TYPE_LABEL = DATA.damageLabels;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const byId = id => document.getElementById(id);
  const clone = x => JSON.parse(JSON.stringify(x));
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number.isFinite(Number(n)) ? Number(n) : lo));
  const fmt = (n, d = 1) => Number(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtSmart = (n, max = 2) => Number(n || 0).toLocaleString('pt-BR', { maximumFractionDigits: max });

  function blankDamage() { return { melee: 0, range: 0, magic: 0, faith: 0 }; }
  function defaultBaseAttack() { return { melee: 15, range: 15, magic: 15, faith: 15 }; }
  function blankAttributes() { return Object.fromEntries(DATA.attributeFields.map(x => [x.key, Number(x.value || 0)])); }
  function defaultCombatStats() {
    return {
      meleeCooldownReduction: 0, rangeCooldownReduction: 0, magicCooldownReduction: 0, faithCooldownReduction: 0, globalCooldownReduction: 0
    };
  }
  function defaultPrimaryBonus() { return Object.fromEntries(DATA.attributeFields.map(field => [field.key, 0])); }
  function defaultStatusModifiers() {
    return {
      additiveGlobalAttack:0, additiveMeleeAttack:0, additiveRangeAttack:0, additiveMagicAttack:0, additiveFaithAttack:0,
      globalDamagePercent:0, meleeDamagePercent:0, rangeDamagePercent:0, magicDamagePercent:0, faithDamagePercent:0,
      meleeToMagicPercent:0, rangeToFaithPercent:0, magicToMeleePercent:0, faithToRangePercent:0,
      additiveDefense:0, defensePercent:0, additiveCritRate:0, critRatePercent:0, additiveCritDamage:0, critDamagePercent:0,
      additiveElementChance:0, additiveElementPotency:0, additiveMaxHP:0, maxHPPercent:0, additiveMaxMP:0, maxMPPercent:0,
      additiveHPRegenPerTick:0, additiveMPRegenPerTick:0, additiveShield:0, damageReduction:0,
      accuracy:0, damageBalance:100, armorPenetration:0, defenseIgnore:0, attackPierce:0, flatDamageBonus:0, trueDamageBonus:0,
      hpOnHitChance:0, mpOnHitChance:0
    };
  }
  function defaultCombatContext() { return { targetLevel:1, targetDefense:0, actualTargets:1, chargePercent:100, distancePercent:100, crowdCount:1, weakenedStacks:0, frozenStacks:0, isBoss:false, targetHasStatus:false, elementLoaded:false, bossMultiplier:1 }; }
  function defaultLoadout(i) {
    return {
      name: `Loadout ${i + 1}`,
      characterLevel: 1,
      skills: clone(DATA.skills),
      attributes: blankAttributes(),
      primaryAdditive: defaultPrimaryBonus(),
      primaryPercent: defaultPrimaryBonus(),
      statusModifiers: defaultStatusModifiers(),
      combatContext: defaultCombatContext(),
      baseAttack: defaultBaseAttack(),
      weaponAttack: blankDamage(),
      combatStats: defaultCombatStats()
    };
  }
  function defaultState() {
    return {
      schemaVersion: 9,
      activeLoadout: 0,
      currentTab: 'tree',
      filter: 'all',
      search: '',
      selectedSkillId: 'upward_strike',
      selectedTreeNodeId: 'skill-21',
      loadouts: Array.from({ length: LOADOUT_COUNT }, (_, i) => defaultLoadout(i)),
      optimizer: {
        availablePoints: 0,
        minCon: 0,
        objectivePreset: 'dps',
        dpsWeight: 100,
        survivalWeight: 0,
        supportWeight: 0,
        baseStats: blankAttributes(),
        baseAttack: defaultBaseAttack(),
        model: clone(DATA.modelDefaults),
        weaponSinglePower: DATA.weaponRatios.single,
        weaponDualPower: DATA.weaponRatios.dual,
        weaponGlobalPower: DATA.weaponRatios.global
      },
      lastOptimization: null
    };
  }

  function mergeState(base, incoming) {
    if (!incoming || typeof incoming !== 'object') return base;
    const incomingSchema = Number(incoming.schemaVersion || 0);
    const preserveDataEdits = incomingSchema >= 9;
    base.activeLoadout = clamp(incoming.activeLoadout ?? base.activeLoadout, 0, LOADOUT_COUNT - 1);
    base.currentTab = incoming.currentTab === 'learned' ? 'skills' : incoming.currentTab || base.currentTab;
    base.filter = incoming.filter || base.filter;
    base.search = incoming.search ?? base.search;
    base.selectedSkillId = incoming.selectedSkillId || base.selectedSkillId;
    base.selectedTreeNodeId = incoming.selectedTreeNodeId || base.selectedTreeNodeId;
    if (incoming.optimizer) {
      base.optimizer = {
        ...base.optimizer,
        ...incoming.optimizer,
        baseStats: { ...base.optimizer.baseStats, ...(incoming.optimizer.baseStats || {}) },
        baseAttack: { ...base.optimizer.baseAttack, ...(incoming.optimizer.baseAttack || {}) },
        model: { ...base.optimizer.model, ...(incoming.optimizer.model || {}) }
      };
      if (incomingSchema < 6) {
        base.optimizer.model = clone(DATA.modelDefaults);
        base.optimizer.baseAttack = defaultBaseAttack();
        base.optimizer.weaponSinglePower = DATA.weaponRatios.single;
        base.optimizer.weaponDualPower = DATA.weaponRatios.dual;
        base.optimizer.weaponGlobalPower = DATA.weaponRatios.global;
      }
    }
    if (Array.isArray(incoming.loadouts)) {
      base.loadouts = base.loadouts.map((target, i) => {
        const src = incoming.loadouts[i];
        if (!src) return target;
        const srcSkillMap = new Map((src.skills || []).map(s => [s.id, s]));
        target.name = src.name || target.name;
        target.characterLevel = Math.floor(clamp(src.characterLevel ?? target.characterLevel, 1, 99));
        target.attributes = { ...target.attributes, ...(src.attributes || {}) };
        target.primaryAdditive = { ...target.primaryAdditive, ...(src.primaryAdditive || {}) };
        target.primaryPercent = { ...target.primaryPercent, ...(src.primaryPercent || {}) };
        target.statusModifiers = { ...target.statusModifiers, ...(src.statusModifiers || {}) };
        target.combatContext = { ...target.combatContext, ...(src.combatContext || {}) };
        const oldBaseWasUnset = incomingSchema < 6 && TYPES.every(type => Number(src.baseAttack?.[type] || 0) === 0);
        if (!oldBaseWasUnset) target.baseAttack = { ...target.baseAttack, ...(src.baseAttack || {}) };
        target.weaponAttack = { ...target.weaponAttack, ...(src.weaponAttack || {}) };
        target.combatStats = { ...target.combatStats, ...(incomingSchema >= 9 ? src.combatStats || {} : {}) };
        target.skills = target.skills.map(skill => {
          const saved = srcSkillMap.get(skill.id);
          if (!saved) return skill;
          return {
            ...skill,
            ...(preserveDataEdits ? {
              cooldown: saved.cooldown ?? skill.cooldown,
              cooldownMs: saved.cooldownMs ?? (saved.cooldown === null ? 0 : Number(saved.cooldown ?? skill.cooldown) * 1000),
              scalings: saved.scalings || skill.scalings
            } : {}),
            activeLevel: incomingSchema < 8 && skill.panelType === 'passive'
              ? skill.activeLevel
              : saved.activeLevel ?? skill.activeLevel
          };
        });
        return target;
      });
    }
    if (incomingSchema < 8) base.optimizer.model = clone(DATA.modelDefaults);
    base.schemaVersion = 9;
    return base;
  }

  function loadState() {
    const base = defaultState();
    try {
      const params = new URLSearchParams(location.hash.replace(/^#/, ''));
      if (params.get('build')) {
        const parsed = JSON.parse(decodeURIComponent(atob(params.get('build'))));
        return mergeState(base, parsed);
      }
    } catch (_) {}
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || LEGACY_STORAGE_KEYS.map(key => localStorage.getItem(key)).find(Boolean);
      return raw ? mergeState(base, JSON.parse(raw)) : base;
    } catch (_) { return base; }
  }

  let state = loadState();

  const R = {
    loadoutStrip: byId('loadoutStrip'), basicSlots: byId('basicSlots'), buffSlots: byId('buffSlots'), additionalSlots: byId('additionalSlots'),
    characterLevelInput: byId('characterLevelInput'), passiveLevelInputs: byId('passiveLevelInputs'), passiveBonusSummary: byId('passiveBonusSummary'),
    weaponAttackInputs: byId('weaponAttackInputs'), activeCount: byId('activeCount'), skillPointCount: byId('skillPointCount'), skillPointBudget: byId('skillPointBudget'), buildMinLevel: byId('buildMinLevel'), buildRuleWarning: byId('buildRuleWarning'), activeCountText: byId('activeCountText'),
    quickRotationDps: byId('quickRotationDps'), treeMapStatus: byId('treeMapStatus'),
    tabs: byId('tabs'), categoryFilters: byId('categoryFilters'), skillSearch: byId('skillSearch'), treeImage: byId('treeImage'), treeHighlight: byId('treeHighlight'), treeHotspots: byId('treeHotspots'), treeHoverCard: byId('treeHoverCard'),
    inspector: byId('skillInspector'), skillTableBody: byId('skillTableBody'), importFile: byId('importFile'),
    attackTotals: byId('attackTotals'), characterStatsGrid: byId('characterStatsGrid'), characterProgressionStats: byId('characterProgressionStats'), combatStatInputs: byId('combatStatInputs'), dpsSummary: byId('dpsSummary'), dpsTableBody: byId('dpsTableBody'),
    primaryAdditionalInputs: byId('primaryAdditionalInputs'), statusModifierInputs: byId('statusModifierInputs'), combatContextInputs: byId('combatContextInputs'), apSummary: byId('apSummary'), characterPrimarySummary: byId('characterPrimarySummary'), fullCharacterSheet: byId('fullCharacterSheet'),
    availablePoints: byId('availablePoints'), minCon: byId('minCon'), objectivePreset: byId('objectivePreset'), dpsWeight: byId('dpsWeight'), survivalWeight: byId('survivalWeight'), supportWeight: byId('supportWeight'),
    dpsWeightOut: byId('dpsWeightOut'), survivalWeightOut: byId('survivalWeightOut'), supportWeightOut: byId('supportWeightOut'),
    weaponSinglePower: byId('weaponSinglePower'), weaponDualPower: byId('weaponDualPower'), weaponGlobalPower: byId('weaponGlobalPower'), optimizerEmpty: byId('optimizerEmpty'), optimizerResults: byId('optimizerResults'),
    weaponRecommendation: byId('weaponRecommendation'), recommendedStats: byId('recommendedStats'), resultMetrics: byId('resultMetrics'), weaponRanking: byId('weaponRanking'), ratioBars: byId('ratioBars'), marginalTable: byId('marginalTable'), skillContribution: byId('skillContribution'),
    attributeFitSummary: byId('attributeFitSummary'), attributeFormulaGrid: byId('attributeFormulaGrid'), attributeImpactBody: byId('attributeImpactBody'), progressionFormulaGrid: byId('progressionFormulaGrid'), passiveRulesGrid: byId('passiveRulesGrid'), dataDamageInfluenceChart: byId('dataDamageInfluenceChart'), dpsDamageInfluenceChart: byId('dpsDamageInfluenceChart'),
    modelInputs: byId('modelInputs'), dataSkillList: byId('dataSkillList')
  };

  const currentLoadout = () => state.loadouts[state.activeLoadout];
  const getSkill = id => currentLoadout().skills.find(s => s.id === id);
  const activeSkills = () => currentLoadout().skills.filter(s => s.activeLevel > 0 && s.panelType !== 'passive');
  const COMBAT_STAT_FIELDS = [
    ['globalCooldownReduction','CDR global %'], ['meleeCooldownReduction','CDR Melee %'], ['rangeCooldownReduction','CDR Range %'], ['magicCooldownReduction','CDR Magic %'], ['faithCooldownReduction','CDR Faith %']
  ];
  const STATUS_MODIFIER_FIELDS = [
    ['additiveGlobalAttack','ATK global +'], ['globalDamagePercent','Dano global %'],
    ['additiveDefense','Defesa +'], ['defensePercent','Defesa %'], ['additiveCritRate','Crit Rate +'], ['critRatePercent','Crit Rate %'],
    ['additiveCritDamage','Crit Damage +'], ['critDamagePercent','Crit Damage %'], ['additiveElementChance','Chance elemental +'], ['additiveElementPotency','Potência elemental +'],
    ['additiveMaxHP','Max HP +'], ['maxHPPercent','Max HP %'], ['additiveMaxMP','Max MP +'], ['maxMPPercent','Max MP %'],
    ['additiveHPRegenPerTick','HP regen/tick +'], ['additiveMPRegenPerTick','MP regen/tick +'], ['additiveShield','Shield +'], ['damageReduction','Redução de dano %'],
    ['accuracy','Accuracy'], ['damageBalance','Damage Balance'], ['armorPenetration','Armor Pen'], ['defenseIgnore','DEF Ignore %'], ['attackPierce','Attack Pierce'],
    ['flatDamageBonus','Flat Damage'], ['trueDamageBonus','True Damage'], ['hpOnHitChance','HP on hit %'], ['mpOnHitChance','MP on hit %'],
    ['meleeDamagePercent','Melee DMG %'], ['rangeDamagePercent','Range DMG %'], ['magicDamagePercent','Magic DMG %'], ['faithDamagePercent','Faith DMG %'],
    ['meleeToMagicPercent','Melee → Magic %'], ['rangeToFaithPercent','Range → Faith %'], ['magicToMeleePercent','Magic → Melee %'], ['faithToRangePercent','Faith → Range %']
  ];
  const CONTEXT_FIELDS = [
    ['targetLevel','Nível do alvo','number'], ['targetDefense','Defesa do alvo','number'], ['actualTargets','Alvos atingidos','number'], ['chargePercent','Carga %','number'], ['distancePercent','Distância Soul Shot %','number'],
    ['crowdCount','Inimigos próximos','number'], ['weakenedStacks','Stacks Weakened','number'], ['frozenStacks','Stacks Frozen','number'], ['isBoss','Alvo é boss','checkbox'], ['targetHasStatus','Alvo com status','checkbox'], ['elementLoaded','Elemento equipado','checkbox']
  ];
  const MP_UPKEEP = {
    phasing:[1,.15], clarity:[2,.15], undying:[1,.15], focused_mind:[1,.15], arrow_infusion:[1,.15],
    elemental_charge:[2.8752,.4792], familiar:[1,.15], companion:[1,.15], divine_benevolence:[1,.15], divine_thorn:[1,.15]
  };

  function passiveLevels(loadout = currentLoadout()) {
    return Object.fromEntries(['melee','range','magic','faith'].map(type => [type, loadout.skills.find(skill => skill.id === type)?.activeLevel || 0]));
  }
  function sheetFor(loadout = currentLoadout(), allocated = loadout.attributes, weaponOverride = null) {
    const modifiers = { ...loadout.statusModifiers };
    const weapon = weaponOverride || loadout.weaponAttack;
    TYPES.forEach(type => { modifiers[`additive${type[0].toUpperCase()+type.slice(1)}Attack`] = Number(modifiers[`additive${type[0].toUpperCase()+type.slice(1)}Attack`] || 0) + Number(weapon[type] || 0); });
    return FORMULAS.characterSheet({ level:loadout.characterLevel, allocated, primaryAdditive:loadout.primaryAdditive, primaryPercent:loadout.primaryPercent, modifiers, passiveLevels:passiveLevels(loadout), passiveRules:DATA.passiveRules });
  }
  function progressionStats(attributes = currentLoadout().attributes, loadout = currentLoadout()) {
    const sheet = sheetFor(loadout, attributes);
    const mpRegenPenalty = loadout.skills.filter(skill => skill.activeLevel > 0 && MP_UPKEEP[skill.id])
      .reduce((sum, skill) => { const [base,per]=MP_UPKEEP[skill.id]; return sum+base+per*Math.max(0,skill.activeLevel-1); }, 0);
    return { maxHp:sheet.maxHp,maxMp:sheet.maxMp,shield:sheet.shield,defense:sheet.defense,hpRegen:sheet.hpRegenTick,mpRegenGross:sheet.mpRegenTick,mpRegenPenalty,mpRegen:sheet.mpRegenTick-mpRegenPenalty,critChance:sheet.critRate,critDamage:sheet.critDamage,elementChance:sheet.elementChance,elementPotency:sheet.elementPotency,damageReduction:sheet.damageReduction,hpOnHitChance:sheet.hpOnHitChance,mpOnHitChance:sheet.mpOnHitChance,passiveBonuses:sheet.passiveBonuses };
  }
  function effectiveCombatStats(attributes = currentLoadout().attributes) {
    const combat = currentLoadout().combatStats, sheet = sheetFor(currentLoadout(), attributes);
    return {
      ...combat,
      critRate:sheet.critRate,critChance:sheet.critRate,critDamage:sheet.critDamage,elementChance:sheet.elementChance,elementPotency:sheet.elementPotency,
      accuracy:sheet.accuracy,damageBalance:sheet.damageBalance,armorPenetration:sheet.armorPenetration,defenseIgnore:sheet.defenseIgnore,attackPierce:sheet.attackPierce,flatDamageBonus:sheet.flatDamageBonus,trueDamageBonus:sheet.trueDamageBonus,
      elementalChargeLevel:getSkill('elemental_charge')?.activeLevel||0
    };
  }

  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} }
  function toast(text) { const old=$('.toast'); if(old) old.remove(); const d=document.createElement('div'); d.className='toast'; d.textContent=text; document.body.appendChild(d); setTimeout(()=>d.remove(),2200); }
  function typeColor(type) { return `var(--${['melee','range','magic','faith','hybrid','utility'].includes(type) ? type : 'utility'})`; }
  const ATTRIBUTE_DAMAGE_TYPE = { str: 'melee', dex: 'range', int: 'magic', spr: 'faith' };
  function damageTypeHtml(type, text = TYPE_LABEL[type] || type) {
    return `<span class="damage-type type-${type}">${text}</span>`;
  }
  function attributeTypeHtml(attribute, text = attribute.toUpperCase()) {
    const type = ATTRIBUTE_DAMAGE_TYPE[attribute];
    return type ? `<span class="attribute-type type-${type}">${text}</span>` : text;
  }
  function skillIconHtml(skill, className = '') {
    const src = skill.icon || TREE.skillIcons?.[skill.id] || nodeForSkill(skill.id)?.icon;
    return src
      ? `<img class="${className}" src="${src}" alt="" draggable="false">`
      : '<span class="icon-fallback" aria-hidden="true">◆</span>';
  }
  function confidenceLabel(value) {
    return ({ confirmed: 'Confirmado', wiki: 'Wiki atual', community: 'Comunidade', estimated: 'Estimado' })[value] || 'Estimado';
  }
  function hitConfidenceLabel(value) {
    return ({ wiki: 'descrição', derived: 'derivado', assumption: '1 hit assumido', review: 'revisar in-game' })[value] || 'estimado';
  }

  function sanitizeSkill(skill) {
    skill.activeLevel = clamp(skill.activeLevel || 0, 0, skill.activeMax || 20);
    skill.scalings = skill.scalings || {};
  }

  function enforceSlotLimits() {
    const skills = currentLoadout().skills;
    Object.entries(SLOT_LIMITS).forEach(([panelType, limit]) => {
      let active = skills.filter(skill => skill.panelType === panelType && skill.activeLevel > 0);
      if (panelType === 'basic' && active.length > 1) {
        active = [...active].sort((a, b) => Number(b.id === 'slash') - Number(a.id === 'slash'));
      }
      active.slice(limit).forEach(skill => { skill.activeLevel = 0; });
    });
  }

  function setSkillActiveLevel(skill, value, notifyOnLimit = true) {
    const next = clamp(value, 0, skill.activeMax || 20);
    if (next > 0 && skill.panelType === 'basic') {
      currentLoadout().skills.forEach(other => {
        if (other.id !== skill.id && other.panelType === 'basic') other.activeLevel = 0;
      });
    } else if (next > 0 && skill.activeLevel <= 0 && Number.isFinite(SLOT_LIMITS[skill.panelType])) {
      const activeInPanel = currentLoadout().skills.filter(other => other.panelType === skill.panelType && other.activeLevel > 0).length;
      if (activeInPanel >= SLOT_LIMITS[skill.panelType]) {
        if (notifyOnLimit) toast(`${PANEL_LABELS[skill.panelType]}: todos os ${SLOT_LIMITS[skill.panelType]} slots já estão ocupados.`);
        return false;
      }
    }
    skill.activeLevel = next;
    return true;
  }

  function totalScaleComponent(component, level) {
    return FORMULAS.totalScaleComponent(component, level);
  }
  function scalingTotals(skill, level = skill.activeLevel) {
    return FORMULAS.scalingTotals(skill, level);
  }
  function scalingUnit(type) { return TYPES.includes(type) ? '%' : ''; }
  function scalingText(skill, level = skill.activeLevel, compact = false) {
    const totals = scalingTotals(skill, level);
    const entries = Object.entries(totals).filter(([,v]) => v !== 0);
    if (!entries.length) return 'Sem scaling documentado';
    return entries.map(([type,v]) => `${damageTypeHtml(type, compact ? TYPE_LABEL[type] : TYPE_LABEL[type] || type)}${compact ? ' ' : ': '}${fmt(v,1)}${scalingUnit(type)}`).join(compact ? ' · ' : ' | ');
  }
  function scalingFormulaText(skill) {
    const entries = Object.entries(skill.scalings || {});
    if (!entries.length) return 'Sem fórmula documentada nesta versão.';
    return entries.map(([type,c]) => `${damageTypeHtml(type)}: ${fmt(c.base,1)}${scalingUnit(type)} + ${fmt(c.perLevel,1)}${scalingUnit(type)}/Lv`).join(' | ');
  }

  function hitProfileText(skill) {
    if (skill.sustainedHitsPerSecond > 0) return `${fmtSmart(skill.sustainedHitsPerSecond)}/s · contínuo`;
    const hits = FORMULAS.hitCount(skill);
    const factor = FORMULAS.totalDamageMultiplier(skill);
    const hitLabel = `${fmtSmart(hits)} ${hits === 1 ? 'hit' : 'hits'}`;
    return Math.abs(factor - hits) > .0001 ? `${hitLabel} · dano ×${fmtSmart(factor)}` : hitLabel;
  }

  function hitProfileHtml(skill) {
    const flags = [skill.conditionalHits ? 'condicional' : '', hitConfidenceLabel(skill.hitConfidence)].filter(Boolean).join(' · ');
    return `<span class="hit-profile" title="${skill.hitNote || ''}"><strong>${hitProfileText(skill)}</strong><small>${flags}</small></span>`;
  }

  function attackTotals(baseAttack, weaponAttack, attributes = currentLoadout().attributes) {
    const sheet=sheetFor(currentLoadout(), attributes, weaponAttack || currentLoadout().weaponAttack);
    return {...sheet.damage,health:sheet.maxHp,mana:sheet.maxMp,...sheet.primary};
  }
  function rawDamagePerHit(skill, attacks) {
    const stats = effectiveCombatStats();
    const context = { ...currentLoadout().combatContext, playerLevel:currentLoadout().characterLevel };
    const raw = FORMULAS.damagePerHit(skill, attacks, { combatStats: stats, context });
    return FORMULAS.applyTargetPipeline(raw, context, stats);
  }
  function rawDamagePerCast(skill, attacks) {
    const stats=effectiveCombatStats(),context={...currentLoadout().combatContext,playerLevel:currentLoadout().characterLevel};
    return FORMULAS.damagePerCast(skill,attacks,{combatStats:stats,context});
  }
  function rawDps(skill, attacks) {
    const context={ ...currentLoadout().combatContext, playerLevel:currentLoadout().characterLevel };
    const base=FORMULAS.skillDps(skill, attacks, effectiveCombatStats(), context);
    return base===null?null:base*FORMULAS.rotationBuffMultiplier(activeSkills(),context);
  }

  function slotRuleDescription(skill) {
    if (skill.panelType === 'passive') return 'Progressão automática · não ocupa slot · máximo 99';
    if (skill.panelType === 'additional') return 'Sem limite de skills equipadas · consome SP';
    if (skill.panelType === 'buff') return '3 slots · o terceiro é liberado no nível 60 · não consome SP';
    return '1 slot disponível · consome SP';
  }
  function rotationDps(skills, attacks) {
    return FORMULAS.rotationDps(skills, attacks, effectiveCombatStats(), { ...currentLoadout().combatContext, playerLevel:currentLoadout().characterLevel });
  }
  function renderDamageInfluence(root, attacks = attackTotals()) {
    if(!root)return;
    const influence=FORMULAS.rotationDpsByType(activeSkills(),attacks,effectiveCombatStats(),{ ...currentLoadout().combatContext, playerLevel:currentLoadout().characterLevel });
    root.innerHTML=TYPES.map(type=>{
      const share=influence.shares[type]*100;
      return `<div class="damage-influence-item type-${type}"><div class="damage-ring" style="--share:${share};--ring-color:var(--${type})"><strong>${fmt(share,1)}%</strong></div><span>${damageTypeHtml(type)}</span><small>${fmt(influence.dps[type],1)} DPS</small></div>`;
    }).join('');
    root.classList.toggle('is-empty',influence.total<=0);
    root.setAttribute('aria-label',influence.total>0?`Influência no DPS: ${TYPES.map(type=>`${TYPE_LABEL[type]} ${fmt(influence.shares[type]*100,1)}%`).join(', ')}`:'Nenhuma skill ofensiva ativa com DPS calculável');
  }

  function renderLoadouts() {
    R.loadoutStrip.innerHTML='';
    state.loadouts.forEach((l,i)=>{
      const b=document.createElement('button'); b.className=`loadout-chip ${i===state.activeLoadout?'active':''}`; b.textContent=i+1; b.title=l.name;
      b.onclick=()=>{ state.activeLoadout=i; state.lastOptimization=null; renderAll(); };
      b.ondblclick=()=>{ const n=prompt('Nome do loadout',l.name); if(n){l.name=n.trim();renderLoadouts();save();} };
      R.loadoutStrip.appendChild(b);
    });
  }

  function slotHtml(skill) {
    return `<div class="slot-card"><div class="slot-icon" style="color:${typeColor(skill.category)}">${skillIconHtml(skill, 'skill-icon-image')}</div><div><div class="slot-name">${skill.name}</div><div class="slot-sub">${scalingText(skill,skill.activeLevel,true)}</div></div></div><div class="slot-level-badge">${skill.activeLevel}</div>`;
  }
  function fillSlots(root, skills, count) {
    root.innerHTML='';
    for(let i=0;i<count;i++){
      const s=skills[i]; const d=document.createElement('div'); d.className=`slot ${s?'filled':'empty'}`;
      if(s){d.innerHTML=slotHtml(s); d.title=`${s.name} · Active Lv ${s.activeLevel}`; d.onclick=()=>{state.selectedSkillId=s.id;state.selectedTreeNodeId=nodeForSkill(s.id)?.id||null;renderInspector();renderTreeBrowser();save();};}
      root.appendChild(d);
    }
  }
  function renderProgressionInputs() {
    const loadout = currentLoadout();
    if (R.characterLevelInput) R.characterLevelInput.value = loadout.characterLevel;
    if (!R.passiveLevelInputs) return;
    R.passiveLevelInputs.innerHTML = ['melee','range','magic','faith'].map(type => {
      const skill = loadout.skills.find(item => item.id === type);
      return `<label class="passive-level type-${type}"><span>${skillIconHtml(skill, 'skill-icon-image')}<strong>${TYPE_LABEL[type]}</strong></span><input data-passive-level="${type}" type="number" min="0" max="99" step="1" value="${skill?.activeLevel || 0}"></label>`;
    }).join('');
    const bonuses = progressionStats().passiveBonuses;
    const labels = { maxHp:'HP', defense:'DEF', hpRegen:'HP regen', critChance:'Crit', hpOnHitChance:'HP on hit', mpOnHitChance:'MP on hit', shield:'Shield', maxMp:'MP', mpRegen:'MP regen', elementPotency:'Potência elem.', damageReduction:'Redução', elementChance:'Chance elem.' };
    const percentKeys = new Set(['critChance','hpOnHitChance','mpOnHitChance','elementPotency','damageReduction','elementChance']);
    R.passiveBonusSummary.innerHTML = Object.entries(bonuses).filter(([, value]) => value).map(([key, value]) => `<span><strong>+${fmtSmart(value)}${percentKeys.has(key) ? '%' : ''}</strong> ${labels[key] || key}</span>`).join('');
  }
  function renderLeft() {
    const skills=currentLoadout().skills;
    renderProgressionInputs();
    fillSlots(R.basicSlots, skills.filter(s=>s.panelType==='basic'&&s.activeLevel>0).slice(0,1),1);
    fillSlots(R.buffSlots, skills.filter(s=>s.panelType==='buff'&&s.activeLevel>0).slice(0,3),3);
    const additional=skills.filter(s=>s.panelType==='additional'&&s.activeLevel>0);
    fillSlots(R.additionalSlots, additional, Math.max(1,additional.length));
    R.activeCount.textContent=activeSkills().length;
    const requirements=FORMULAS.buildRequirements(skills,DATA.progressionModel);
    const budget=FORMULAS.skillPointBudget(currentLoadout().characterLevel,DATA.progressionModel.skillPoints);
    R.skillPointCount.textContent=requirements.points;
    R.skillPointBudget.textContent=budget;
    R.buildMinLevel.textContent=requirements.minimumLevel;
    R.activeCountText.textContent=`${additional.length} equipadas · sem limite`;
    const warnings=[];
    if(requirements.buffCount>DATA.progressionModel.buffs.pre60Limit) warnings.push('3 buffs só podem ser usados a partir do nível 60.');
    if(currentLoadout().characterLevel<requirements.minimumLevel) warnings.push(`Este setup requer nível ${requirements.minimumLevel}; o personagem está no nível ${currentLoadout().characterLevel}.`);
    R.buildRuleWarning.textContent=warnings.join(' ');
    R.buildRuleWarning.classList.toggle('hidden',!warnings.length);
    if(R.weaponAttackInputs) renderDamageInputs(R.weaponAttackInputs,currentLoadout().weaponAttack,'weapon-left');
    if (R.quickRotationDps) R.quickRotationDps.textContent=fmt(rotationDps(activeSkills(), attackTotals()).total, 0);
  }

  function renderDamageInputs(root,obj,prefix) {
    if(!root)return;
    root.innerHTML='';
    TYPES.forEach(type=>{
      const l=document.createElement('label'); l.innerHTML=`${damageTypeHtml(type)}<input type="number" min="0" step="0.1" data-damage-prefix="${prefix}" data-damage-type="${type}" value="${obj[type]||0}">`; root.appendChild(l);
    });
  }

  function renderTabs(){ $$('.tab',R.tabs).forEach(t=>t.classList.toggle('active',t.dataset.tab===state.currentTab)); $$('.tab-page').forEach(p=>p.classList.toggle('active',p.dataset.page===state.currentTab)); }
  function renderFilters(){
    R.categoryFilters.innerHTML='';
    DATA.categories.forEach(c=>{const b=document.createElement('button');b.className=`filter-pill ${state.filter===c.key?'active':''}`;b.textContent=c.label;b.onclick=()=>{state.filter=c.key;renderFilters();renderTreeBrowser();save();};R.categoryFilters.appendChild(b);});
    R.skillSearch.value=state.search;
  }
  function nodeForSkill(skillId) {
    const skill = getSkill(skillId);
    return TREE.nodes.find(node => node.id === skill?.mapNodeId || node.skillId === skillId) || null;
  }
  function skillForNode(nodeId) {
    return currentLoadout().skills.find(skill => skill.mapNodeId === nodeId) || null;
  }
  function treeGroupLabel(group) { return TREE.groups?.[group]?.name || group; }
  function matchesTreeNode(node, skill) {
    const query = state.search.trim().toLowerCase();
    const categoryMatches = state.filter === 'all' || node.group === state.filter || skill?.category === state.filter || skill?.classes?.includes(state.filter);
    const textMatches = !query || node.name.toLowerCase().includes(query) || skill?.short?.toLowerCase().includes(query);
    return categoryMatches && textMatches;
  }
  function treeTooltipHtml(node, skill) {
    const icon = `<img class="tree-tooltip-icon" src="${node.icon}" alt="" draggable="false">`;
    if (!skill) return `<div class="tree-tooltip-head">${icon}<span><strong>${node.name}</strong><small>${treeGroupLabel(node.group)}</small></span></div><span>Skill presente na árvore atual da wiki.</span><span>O modelo matemático ainda não foi adicionado ao planner.</span>`;
    const attacks = attackTotals();
    const dps = rawDps(skill, attacks);
    const perHit = rawDamagePerHit(skill, attacks);
    const damage = rawDamagePerCast(skill, attacks);
    const cooldown = FORMULAS.effectiveCooldown(skill, effectiveCombatStats());
    const damageLine = skill.nonDamage
      ? 'Suporte / defensiva'
      : `Hit ${fmt(perHit,1)} · ${hitProfileText(skill)} · ${skill.sustainedHitsPerSecond > 0 ? 'toggle' : `uso ${fmt(damage,1)}`} · DPS ${fmt(dps,1)}`;
    return `<div class="tree-tooltip-head">${icon}<span><strong>${skill.name}</strong><small>${skill.classes.join(' + ')} · ${confidenceLabel(skill.confidence)}</small></span></div><span>Active ${skill.activeLevel}/${skill.activeMax}</span><span>${skill.activeLevel ? scalingText(skill, skill.activeLevel, true) : scalingFormulaText(skill)}</span><span>${damageLine}</span><span>${cooldown === null ? 'CD desconhecido' : `CD ${fmt(cooldown,2)}s`}</span>`;
  }
  function positionTreeHover(node, skill) {
    if (!R.treeHoverCard) return;
    R.treeHoverCard.innerHTML = treeTooltipHtml(node, skill);
    R.treeHoverCard.style.left = `${node.x}%`;
    R.treeHoverCard.style.top = `${node.y}%`;
    R.treeHoverCard.classList.toggle('edge-right', node.x > 72);
    R.treeHoverCard.classList.toggle('edge-bottom', node.y > 73);
    R.treeHoverCard.classList.remove('hidden');
  }
  function hideTreeHover() { R.treeHoverCard?.classList.add('hidden'); }
  function renderTreeBrowser(){
    if (!R.treeHotspots) return;
    if (R.treeImage && TREE.background) R.treeImage.src = TREE.background;
    R.treeHotspots.innerHTML='';
    const modeledCount = TREE.nodes.filter(node => skillForNode(node.id)).length;
    if (R.treeMapStatus) R.treeMapStatus.textContent = `${TREE.nodes.length} skills reais · ${modeledCount} preenchidas`;
    TREE.nodes.forEach(node => {
      const skill = skillForNode(node.id);
      if (skill) sanitizeSkill(skill);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `tree-hotspot ${skill ? 'modeled' : 'unmodeled'} tree-group-${node.group} ${node.id === state.selectedTreeNodeId ? 'selected' : ''}`;
      btn.style.left = `${node.x}%`;
      btn.style.top = `${node.y}%`;
      btn.dataset.nodeId = node.id;
      btn.setAttribute('aria-label', `${node.name} · ${treeGroupLabel(node.group)}`);
      if (!matchesTreeNode(node, skill)) btn.classList.add('filtered-out');
      btn.innerHTML = `<img class="tree-node-icon" src="${node.icon}" alt="" draggable="false">${skill?.activeLevel > 0 ? `<span class="tree-node-level">${skill.activeLevel}</span>` : ''}`;
      btn.addEventListener('mouseenter', () => positionTreeHover(node, skill));
      btn.addEventListener('mouseleave', hideTreeHover);
      btn.addEventListener('focus', () => positionTreeHover(node, skill));
      btn.addEventListener('blur', hideTreeHover);
      btn.addEventListener('click', e => {
        e.stopPropagation();
        state.selectedTreeNodeId = node.id;
        if (skill) {
          state.selectedSkillId = skill.id;
        } else {
          state.selectedSkillId = null;
        }
        renderInspector(); renderTreeBrowser(); renderTreeHighlight(); save();
      });
      R.treeHotspots.appendChild(btn);
    });
    renderTreeHighlight();
  }
  function renderTreeHighlight(){
    const node=TREE.nodes.find(item => item.id === state.selectedTreeNodeId) || nodeForSkill(state.selectedSkillId);
    if(!node){R.treeHighlight.classList.add('hidden');return;}
    R.treeHighlight.style.left=`${node.x}%`;R.treeHighlight.style.top=`${node.y}%`;R.treeHighlight.classList.remove('hidden');
  }

  function renderInspector(){
    const selectedNode = TREE.nodes.find(node => node.id === state.selectedTreeNodeId);
    const s=selectedNode ? skillForNode(selectedNode.id) : getSkill(state.selectedSkillId);
    if(!s && selectedNode){
      R.inspector.classList.remove('empty');
      R.inspector.innerHTML=`<div class="inspector-head"><div class="inspector-icon" style="color:${typeColor(selectedNode.group)}"><img class="skill-icon-image" src="${selectedNode.icon}" alt="" draggable="false"></div><div class="inspector-meta"><h2>${selectedNode.name}</h2><p>${treeGroupLabel(selectedNode.group)} · mapa atual da wiki</p><span class="confidence-tag">Navegação disponível</span></div></div><div class="inspector-box"><strong>Ainda sem cálculo</strong><div class="inspector-note">Esta skill já aparece na árvore real e pode ser localizada, filtrada e inspecionada. Seus níveis, scaling e cooldown ainda não foram adicionados ao modelo matemático do planner.</div></div>`;
      return;
    }
    if(!s){R.inspector.innerHTML='<div class="empty-state">Selecione uma skill.</div>';return;} sanitizeSkill(s);
    const attacks=attackTotals(); const perHit=rawDamagePerHit(s,attacks); const dmg=rawDamagePerCast(s,attacks); const dps=rawDps(s,attacks);
    const effectiveCd=FORMULAS.effectiveCooldown(s,effectiveCombatStats());
    const totals=scalingTotals(s);
    const currentBasePower=totalScaleComponent(s.basePower,s.activeLevel);
    const currentMpPenalty=totalScaleComponent(s.mpRegenPenalty,s.activeLevel);
    const currentSheet=sheetFor(),healing=FORMULAS.skillHealing(s,currentSheet,currentLoadout().combatContext),shieldGranted=FORMULAS.skillShield(s,currentSheet);
    const scalingRows=Object.entries(s.scalings||{}).map(([type,c])=>`<div class="scaling-detail-row type-${type}"><strong>${damageTypeHtml(type)}</strong><span>${fmt(c.base,1)} + ${fmt(c.perLevel,1)}/Lv</span><strong>${fmt(totals[type],1)}${scalingUnit(type)}</strong></div>`).join('')||'<div class="microcopy">Sem scaling documentado.</div>';
    R.inspector.innerHTML=`
      <div class="inspector-head"><div class="inspector-icon" style="color:${typeColor(s.category)}">${skillIconHtml(s, 'skill-icon-image')}</div><div class="inspector-meta"><h2>${s.name}</h2><p>${s.classes.join(' + ')} · ${s.skillKind} · ${s.sourceStatus}</p><span class="confidence-tag">${confidenceLabel(s.confidence)}</span></div></div>
      <div class="inspector-box">
        <div class="level-line"><strong>Active Lv ${s.activeLevel}</strong><span>máx ${s.activeMax}</span></div><div class="level-bar"><span style="width:${s.activeMax? s.activeLevel/s.activeMax*100:0}%"></span></div>
      </div>
      <div class="inspector-box">
        <strong>Scaling no nível ativo</strong><div class="scaling-detail">${scalingRows}</div>
      </div>
      <div class="inspector-box">
        <div class="inline-controls"><label>Active<input data-inspector="activeLevel" type="number" min="0" max="${s.activeMax}" value="${s.activeLevel}"></label></div>
        <div class="slot-rule"><span>Destino fixo</span><strong>${PANEL_LABELS[s.panelType]}</strong><small>${slotRuleDescription(s)}</small></div>
      </div>
      <div class="inspector-box"><strong>Estimativa atual</strong><div class="damage-readout"><div><span>Dano / hit</span><strong>${s.nonDamage?'Suporte':fmt(perHit,1)}</strong></div><div><span>${s.sustainedHitsPerSecond > 0 ? 'DPS contínuo' : 'Dano / uso'}</span><strong>${s.nonDamage?'—':s.sustainedHitsPerSecond > 0?fmt(dps,1):fmt(dmg,1)}</strong></div></div>${s.nonDamage?'':`<div class="level-line"><span>Ocorrências</span><strong>${hitProfileText(s)}</strong></div><div class="inspector-note hit-note">${s.hitNote} · ${hitConfidenceLabel(s.hitConfidence)}</div>`}${s.basePower?`<div class="level-line"><span>Power base / hit</span><strong>${fmt(currentBasePower,1)}</strong></div>`:''}${healing?`<div class="level-line"><span>Cura / uso</span><strong>${fmt(healing,1)}</strong></div>`:''}${shieldGranted?`<div class="level-line"><span>Shield / uso</span><strong>${fmt(shieldGranted,1)}</strong></div>`:''}${s.mpRegenPenalty?`<div class="level-line"><span>Redução de MP regen</span><strong>−${fmt(currentMpPenalty,2)}/tick</strong></div>`:''}<div class="level-line"><span>Cooldown base</span><strong>${s.cooldown?fmt(s.cooldown,2)+'s':'—'}</strong></div><div class="level-line"><span>Cooldown efetivo</span><strong>${effectiveCd===null?'Não confirmado':fmt(effectiveCd,2)+'s'}</strong></div><div class="microcopy">${s.damageSpeedCategories?.length ? `Attack Speed multiplica o dano: ${s.damageSpeedCategories.map(type=>damageTypeHtml(type)).join(' + ')} + Global.` : s.cooldownSpeedCategories?.length ? `CDR reduz o cooldown: ${s.cooldownSpeedCategories.map(type=>damageTypeHtml(type)).join(' + ')} + Global · ${confidenceLabel(s.cooldownSpeedConfidence)}` : 'CDR não reduz este cooldown.'}</div></div>
      <div class="inspector-box"><strong>Descrição</strong><div class="inspector-note">${s.description}</div></div>`;
    $$('[data-inspector]',R.inspector).forEach(input=>input.addEventListener('change',()=>{
      const key=input.dataset.inspector;
      if(key==='activeLevel') setSkillActiveLevel(s,Number(input.value));
      else s[key]=Number(input.value);
      sanitizeSkill(s);state.lastOptimization=null;renderAll();
    }));
  }

  function scalingPills(s){const totals=scalingTotals(s);const e=Object.entries(totals).filter(([,v])=>v!==0);return e.length?`<div class="scaling-pills">${e.map(([t,v])=>`<span class="scaling-pill type-${t}">${damageTypeHtml(t)} ${fmt(v,1)}${scalingUnit(t)}</span>`).join('')}</div>`:'<span class="microcopy">sem dados</span>';}
  function renderSkillTable(){
    R.skillTableBody.innerHTML='';
    currentLoadout().skills.forEach(s=>{sanitizeSkill(s);const tr=document.createElement('tr');tr.innerHTML=`<td><div class="table-skill"><span class="table-skill-icon">${skillIconHtml(s,'skill-icon-image')}</span><span><strong>${s.name}</strong><small>${s.skillKind}</small></span></div></td><td>${s.classes.join(' + ')}</td><td><span class="slot-type ${s.panelType}">${PANEL_LABELS[s.panelType]}</span></td><td><input data-row="activeLevel" data-skill="${s.id}" type="number" min="0" max="${s.activeMax}" value="${s.activeLevel}"></td><td><strong>${FORMULAS.skillPointForLevel(s)}</strong></td><td>${scalingPills(s)}</td>`;R.skillTableBody.appendChild(tr);});
    $$('[data-row]',R.skillTableBody).forEach(input=>input.addEventListener('change',()=>{
      const skill=getSkill(input.dataset.skill);
      setSkillActiveLevel(skill,Number(input.value));
      sanitizeSkill(skill);state.lastOptimization=null;renderAll();
    }));
  }

  function renderDps(preserveInputs=false){
    if(!preserveInputs){
      R.characterStatsGrid.innerHTML='';
      DATA.attributeFields.forEach(field=>{
        const label=document.createElement('label');
        label.innerHTML=`${attributeTypeHtml(field.key,field.label)}<input data-character-stat="${field.key}" type="number" min="0" step="1" value="${currentLoadout().attributes[field.key]||0}">`;
        R.characterStatsGrid.appendChild(label);
      });
      R.combatStatInputs.innerHTML='';
      COMBAT_STAT_FIELDS.forEach(([key,labelText])=>{
        const label=document.createElement('label');
        label.innerHTML=`${labelText}<input data-combat-stat="${key}" type="number" step="0.1" value="${currentLoadout().combatStats[key]??0}">`;
        R.combatStatInputs.appendChild(label);
      });
      R.primaryAdditionalInputs.innerHTML=DATA.attributeFields.map(field=>`<div class="status-matrix-row"><strong>${attributeTypeHtml(field.key,field.label)}</strong><label>Aditivo<input data-primary-additive="${field.key}" type="number" step="0.1" value="${currentLoadout().primaryAdditive[field.key]||0}"></label><label>Percentual %<input data-primary-percent="${field.key}" type="number" step="0.1" value="${currentLoadout().primaryPercent[field.key]||0}"></label></div>`).join('');
      R.statusModifierInputs.innerHTML=STATUS_MODIFIER_FIELDS.map(([key,label])=>`<label>${label}<input data-status-modifier="${key}" type="number" step="0.1" value="${currentLoadout().statusModifiers[key]??0}"></label>`).join('');
      R.combatContextInputs.innerHTML=CONTEXT_FIELDS.map(([key,label,type])=>`<label>${label}<input data-combat-context="${key}" type="${type}" ${type==='checkbox'?(currentLoadout().combatContext[key]?'checked':''):`step="0.1" value="${currentLoadout().combatContext[key]??0}"`}></label>`).join('');
    }
    const progression=progressionStats(), sheet=sheetFor();
    const derivedFields=[
      ['Max HP',progression.maxHp,''],['Max MP',progression.maxMp,''],['Shield',progression.shield,''],['Defense',progression.defense,''],
      ['HP regen / tick',progression.hpRegen,''],['MP regen / tick',progression.mpRegen,''],['Crit Rate',progression.critChance,'%'],['Redução de dano',progression.damageReduction,'%'],
      ['Elemental Chance',progression.elementChance,'%'],['Elemental Potency',progression.elementPotency,'%'],['HP on hit',progression.hpOnHitChance,'%'],['MP on hit',progression.mpOnHitChance,'%']
    ];
    R.characterProgressionStats.innerHTML=derivedFields.map(([label,value,unit])=>`<div><span>${label}</span><strong>${fmt(value,unit?1:0)}${unit}</strong></div>`).join('');
    if(progression.mpRegenPenalty>0) R.characterProgressionStats.innerHTML+=`<p class="derived-note">MP regen líquido: ${fmt(progression.mpRegenGross,1)} − ${fmt(progression.mpRegenPenalty,1)} dos buffs.</p>`;
    const attacks=attackTotals();
    R.attackTotals.innerHTML=TYPES.map(t=>{
      return `<div class="type-${t}"><span>${damageTypeHtml(t)} DMG</span><strong>${fmt(sheet.damage[t],1)}</strong><small>ATK × (30 + scaling ${fmt(sheet.attackScale[t],2)}) ÷ 30</small></div>`;
    }).join('');
    R.apSummary.innerHTML=`<span>AP: ${fmtSmart(sheet.spentAP)} / ${fmtSmart(sheet.totalAP)}</span><strong>${fmtSmart(sheet.totalAP-sheet.spentAP)} restantes</strong>`;
    R.characterPrimarySummary.innerHTML=`<h4>Atributos</h4><div class="character-sheet-grid">${DATA.attributeFields.map(field=>`<div><span>${attributeTypeHtml(field.key,field.label)}</span><strong>${fmt(sheet.primary[field.key],1)}</strong><small>${fmt(sheet.primaryRaw[field.key],1)} antes do %</small></div>`).join('')}</div>`;
    const complete=[['Accuracy',sheet.accuracy],['Damage Balance',sheet.damageBalance],['Crit Damage',sheet.critDamage,'%'],['Dano crítico esperado',(sheet.expectedCritMultiplier-1)*100,'%'],['Armor Pen',sheet.armorPenetration],['DEF Ignore',sheet.defenseIgnore,'%'],['Attack Pierce',sheet.attackPierce],['Flat Damage',sheet.flatDamageBonus],['True Damage',sheet.trueDamageBonus],['HP regen / s',sheet.hpRegenPerSecond],['MP regen / s',sheet.mpRegenPerSecond],['ATK global',sheet.globalAttack],['CDR global',currentLoadout().combatStats.globalCooldownReduction,'%'],['CDR Melee',currentLoadout().combatStats.meleeCooldownReduction,'%'],['CDR Range',currentLoadout().combatStats.rangeCooldownReduction,'%'],['CDR Magic',currentLoadout().combatStats.magicCooldownReduction,'%'],['CDR Faith',currentLoadout().combatStats.faithCooldownReduction,'%']];
    R.fullCharacterSheet.innerHTML=`<h4>Outros valores mapeados</h4><div class="character-sheet-grid">${complete.map(([label,value,unit=''])=>`<div><span>${label}</span><strong>${fmt(value,1)}${unit}</strong></div>`).join('')}</div>`;
    const rotation=rotationDps(activeSkills(),attacks);
    const maxDps=rotation.rows.reduce((m,r)=>Math.max(m,r.dps),0);
    const unknownCooldowns=activeSkills().filter(s=>!s.nonDamage&&!s.cooldown).length;
    const mpCostPerSecond=rotation.mpPerSecond+progression.mpRegenPenalty/1.5,mpRegenPerSecond=progression.mpRegenGross/1.5,mpDeficit=Math.max(0,mpCostPerSecond-mpRegenPerSecond),timeToEmpty=mpDeficit>0?sheet.maxMp/mpDeficit:Infinity;
    R.dpsSummary.innerHTML=`<div class="dps-metric"><span>DPS total disponível</span><strong>${fmt(rotation.total,1)}</strong></div><div class="dps-metric"><span>Skills usadas no cooldown</span><strong>${rotation.rows.length}</strong></div><div class="dps-metric"><span>Maior DPS individual</span><strong>${fmt(maxDps,1)}</strong></div><div class="dps-metric"><span>Consumo de MP / s</span><strong>${fmt(mpCostPerSecond,1)}</strong></div><div class="dps-metric"><span>Regen de MP / s</span><strong>${fmt(mpRegenPerSecond,1)}</strong></div><div class="dps-metric"><span>Tempo até zerar MP</span><strong>${Number.isFinite(timeToEmpty)?fmt(timeToEmpty,1)+'s':'∞'}</strong></div><div class="dps-metric"><span>Cooldown desconhecido</span><strong>${unknownCooldowns}</strong></div>`;
    renderDamageInfluence(R.dpsDamageInfluenceChart,attacks);
    if (R.quickRotationDps) R.quickRotationDps.textContent=fmt(rotation.total,0);
    R.dpsTableBody.innerHTML='';
    activeSkills().forEach(s=>{
      const perHit=rawDamagePerHit(s,attacks),dmg=rawDamagePerCast(s,attacks),dps=rawDps(s,attacks);const rot=rotation.rows.find(r=>r.skill.id===s.id);
      const effectiveCd=FORMULAS.effectiveCooldown(s,effectiveCombatStats());
      const damagePerUse=s.sustainedHitsPerSecond>0?'<span class="microcopy">contínuo</span>':fmt(dmg,1);
      const cooldownText=s.sustainedHitsPerSecond>0?`${fmt(effectiveCd,2)}s toggle`:effectiveCd===null?'não confirmado':fmt(effectiveCd,2)+'s';
      const tr=document.createElement('tr');tr.innerHTML=`<td><div class="table-skill"><span class="table-skill-icon">${skillIconHtml(s,'skill-icon-image')}</span><span><strong>${s.name}</strong>${s.nonDamage?'<small>suporte/defensiva</small>':''}</span></div></td><td>${s.activeLevel}</td><td>${scalingPills(s)}</td><td>${s.nonDamage?'—':hitProfileHtml(s)}</td><td>${s.nonDamage?'—':fmt(perHit,1)}</td><td>${s.nonDamage?'—':damagePerUse}</td><td>${cooldownText}</td><td>${dps===null?'—':fmt(dps,1)}</td><td>${rot?fmt(rot.mpPerSecond,2):'—'}</td><td>${rot?fmt(rot.contributionShare*100,1)+'%':'—'}</td>`;R.dpsTableBody.appendChild(tr);
    });
  }

  function renderOptimizerInputs(){
    const o=state.optimizer;R.availablePoints.value=o.availablePoints;R.minCon.value=o.minCon;R.objectivePreset.value=o.objectivePreset;R.dpsWeight.value=o.dpsWeight;R.survivalWeight.value=o.survivalWeight;R.supportWeight.value=o.supportWeight;R.dpsWeightOut.textContent=o.dpsWeight+'%';R.survivalWeightOut.textContent=o.survivalWeight+'%';R.supportWeightOut.textContent=o.supportWeight+'%';R.weaponSinglePower.value=o.weaponSinglePower;R.weaponDualPower.value=o.weaponDualPower;R.weaponGlobalPower.value=o.weaponGlobalPower;
  }
  function readOptimizer(){
    const o=state.optimizer;o.availablePoints=clamp(R.availablePoints.value,0,5000);o.minCon=clamp(R.minCon.value,0,999);o.objectivePreset=R.objectivePreset.value;o.dpsWeight=clamp(R.dpsWeight.value,0,100);o.survivalWeight=clamp(R.survivalWeight.value,0,100);o.supportWeight=clamp(R.supportWeight.value,0,100);o.weaponSinglePower=Number(R.weaponSinglePower.value||100);o.weaponDualPower=Number(R.weaponDualPower.value||75.4);o.weaponGlobalPower=Number(R.weaponGlobalPower.value||59.4);$$('[data-opt-stat]').forEach(i=>currentLoadout().attributes[i.dataset.optStat]=Number(i.value||0));o.baseStats={...currentLoadout().attributes};$$('[data-damage-prefix="optimizer-base"]').forEach(i=>currentLoadout().baseAttack[i.dataset.damageType]=Number(i.value||0));o.baseAttack={...currentLoadout().baseAttack};$$('[data-model]').forEach(i=>o.model[i.dataset.model]=Number(i.value||0));
  }
  function setPreset(p){state.optimizer.objectivePreset=p;if(p==='dps'){state.optimizer.dpsWeight=100;state.optimizer.survivalWeight=0;state.optimizer.supportWeight=0;}if(p==='balanced'){state.optimizer.dpsWeight=65;state.optimizer.survivalWeight=25;state.optimizer.supportWeight=10;}if(p==='survival'){state.optimizer.dpsWeight=20;state.optimizer.survivalWeight=70;state.optimizer.supportWeight=10;}renderOptimizerInputs();save();}

  function weaponVector(arch){return FORMULAS.weaponVector(arch,{single:state.optimizer.weaponSinglePower,dual:state.optimizer.weaponDualPower,global:state.optimizer.weaponGlobalPower});}
  function attacksFromAttrs(distributed,weapon){
    const b=currentLoadout().attributes;const a={str:(b.str||0)+(distributed.str||0),dex:(b.dex||0)+(distributed.dex||0),int:(b.int||0)+(distributed.int||0),spr:(b.spr||0)+(distributed.spr||0),con:(b.con||0)+(distributed.con||0),luk:(b.luk||0)+(distributed.luk||0)};
    const sheet=sheetFor(currentLoadout(),a,weapon);
    return { attrs:a, attacks:{...sheet.damage,health:sheet.maxHp,mana:sheet.maxMp,...sheet.primary} };
  }
  function optimizerCombatStats(attrs){const m=state.optimizer.model,combat=effectiveCombatStats(attrs);const critDamage=Number(combat.critDamage||0)>0?combat.critDamage:(m.critDamageMultiplier||1.5)*100;return{...combat,critDamage};}
  function evaluate(distributed,weapon){
    const {attrs,attacks}=attacksFromAttrs(distributed,weapon);const active=activeSkills();const rot=rotationDpsWithCrit(active,attacks,attrs);const support=active.filter(s=>s.nonDamage).reduce((sum,s)=>{const sc=scalingTotals(s);return sum+Object.values(sc).reduce((a,b)=>a+b,0);},0)*(state.optimizer.model.supportValueMultiplier||1);const m=state.optimizer.model;const progression=progressionStats(attrs);const effectivePool=(progression.maxHp+progression.shield)/Math.max(.01,1-progression.damageReduction/100);const survival=effectivePool*(m.survivalHpValue||0)+progression.defense*(m.survivalDefValue||0)+attrs.con*(m.conToSurvivalScore||0);const score=rot.total*(state.optimizer.dpsWeight/100)+survival*(state.optimizer.survivalWeight/100)+support*(state.optimizer.supportWeight/100);return{score,dps:rot.total,support,survival,attrs,attacks,rows:rot.rows,progression};
  }
  function rotationDpsWithCrit(skills,attacks,attrs){return FORMULAS.rotationDps(skills,attacks,optimizerCombatStats(attrs),{...currentLoadout().combatContext,playerLevel:currentLoadout().characterLevel});}
  function optimizeForWeapon(arch){const weapon=weaponVector(arch),dist={str:0,dex:0,int:0,spr:0,con:Math.min(state.optimizer.availablePoints,state.optimizer.minCon),luk:0};let remaining=Math.max(0,state.optimizer.availablePoints-dist.con);for(let n=0;n<remaining;n++){const base=evaluate(dist,weapon).score;let best='str',gain=-Infinity;for(const k of ['str','dex','int','spr','con','luk']){dist[k]++;const g=evaluate(dist,weapon).score-base;dist[k]--;if(g>gain){gain=g;best=k;}}dist[best]++;}return{arch,weapon,dist,eval:evaluate(dist,weapon)};}
  function optimize(){readOptimizer();const candidates=DATA.weaponArchetypes.map(optimizeForWeapon).sort((a,b)=>b.eval.score-a.eval.score);const best=candidates[0];if(!best){toast('Não foi possível otimizar.');return;}const marginal={};for(const k of ['str','dex','int','spr','con','luk']){const base=best.eval.score;best.dist[k]++;marginal[k]=evaluate(best.dist,best.weapon).score-base;best.dist[k]--;}
    const total=Object.values(best.dist).reduce((a,b)=>a+b,0)||1;state.lastOptimization={best,candidates,marginal,ratios:Object.fromEntries(Object.entries(best.dist).map(([k,v])=>[k,v/total]))};renderOptimizerResult();save();}
  function renderOptimizerResult(){
    const result=state.lastOptimization;
    if(!result){R.optimizerEmpty.classList.remove('hidden');R.optimizerResults.classList.add('hidden');return;}
    R.optimizerEmpty.classList.add('hidden');R.optimizerResults.classList.remove('hidden');
    const best=result.best;
    R.weaponRecommendation.innerHTML=`<span class="microcopy">Melhor arquétipo de arma (arma atual ignorada)</span><strong>${best.arch.name}</strong><div class="microcopy">Bônus de ATK testados: ${TYPES.map(type=>`${damageTypeHtml(type)} ${fmt(best.weapon[type],1)}`).join(' • ')}</div>`;
    R.recommendedStats.innerHTML=['str','dex','int','spr','con','luk'].map(key=>`<div class="rec-stat type-${ATTRIBUTE_DAMAGE_TYPE[key]||'utility'}"><span>${attributeTypeHtml(key)}</span><strong>${best.dist[key]}</strong></div>`).join('');
    R.resultMetrics.innerHTML=`<div class="metric-row"><span>DPS total estimado</span><strong>${fmt(best.eval.dps,1)}</strong></div><div class="metric-row"><span>Score objetivo</span><strong>${fmt(best.eval.score,1)}</strong></div><div class="metric-row"><span>Suporte</span><strong>${fmt(best.eval.support,1)}</strong></div><div class="metric-row"><span>Sobrevivência</span><strong>${fmt(best.eval.survival,1)}</strong></div>`;
    const bestScore=Math.max(...result.candidates.map(item=>item.eval.score),1);
    R.weaponRanking.innerHTML=result.candidates.map((item,index)=>`<div class="weapon-rank-row"><span>${index+1}. ${item.arch.name}</span><div class="bar-track"><div class="bar-fill" style="width:${item.eval.score/bestScore*100}%"></div></div><strong>${fmt(item.eval.dps,1)}</strong></div>`).join('');
    R.ratioBars.innerHTML=['str','dex','int','spr','con','luk'].map(key=>`<div class="ratio-row type-${ATTRIBUTE_DAMAGE_TYPE[key]||'utility'}"><span>${attributeTypeHtml(key)}</span><div class="bar-track"><div class="bar-fill" style="width:${result.ratios[key]*100}%"></div></div><strong>${fmt(result.ratios[key]*100,1)}%</strong></div>`).join('');
    const maxMarg=Math.max(...Object.values(result.marginal).map(Math.abs),.0001);
    R.marginalTable.innerHTML=Object.entries(result.marginal).map(([key,value])=>`<div class="marginal-row type-${ATTRIBUTE_DAMAGE_TYPE[key]||'utility'}"><span>${attributeTypeHtml(key)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(0,value)/maxMarg*100}%"></div></div><strong>+${fmt(value,2)}</strong></div>`).join('');
    const totalContribution=best.eval.rows.reduce((sum,row)=>sum+row.contribution,0)||1;
    R.skillContribution.innerHTML=[...best.eval.rows].sort((a,b)=>b.contribution-a.contribution).map(row=>`<div class="contrib-row"><span class="contrib-skill"><i>${skillIconHtml(row.skill,'skill-icon-image')}</i><span>${row.skill.name}</span></span><div class="bar-track"><div class="bar-fill" style="width:${row.contribution/totalContribution*100}%"></div></div><strong>${fmt(row.contribution/totalContribution*100,1)}%</strong></div>`).join('');
  }

  function renderAttributeDamageModel(){
    if(!R.attributeFormulaGrid)return;
    R.attributeFitSummary.textContent='Runtime atual';
    R.attributeFormulaGrid.innerHTML=TYPES.map(type=>{
      const terms=Object.entries(FORMULAS.TYPE_SCALE[type]).map(([attribute,coefficient])=>`${fmtSmart(coefficient)} × ${attributeTypeHtml(attribute)}`).join(' + ');
      return `<article class="attribute-formula type-${type}"><span>${damageTypeHtml(type)} DMG</span><code>ATK<sub>${type}</sub> × (30 + ${terms}) ÷ 30 × dano global% × dano ${type}%</code><small>ATK<sub>${type}</sub> = 15 + ATK global aditivo + ATK ${type} aditivo. Conversões usam os danos originais.</small></article>`;
    }).join('');
    const attributes=DATA.attributeFields.map(field=>field.key).filter(attribute=>TYPES.some(type=>FORMULAS.TYPE_SCALE[type]?.[attribute]));
    R.attributeImpactBody.innerHTML=attributes.map(attribute=>{
      const impacts=TYPES.flatMap(type=>{
        const coefficient=FORMULAS.TYPE_SCALE[type]?.[attribute];
        return coefficient?[{type,coefficient}]:[];
      });
      const affected=impacts.map(item=>damageTypeHtml(item.type)).join(' + ');
      const isolated=impacts.map(item=>`<div class="impact-equation type-${item.type}">${damageTypeHtml(item.type)}<code><span>ATK<sub>${item.type}</sub></span><b>×</b><span>${fmt(item.coefficient/30,5)}</span></code></div>`).join('');
      return `<tr><td><strong>${attributeTypeHtml(attribute)}</strong></td><td>${affected}</td><td>${isolated}</td></tr>`;
    }).join('');
    renderDamageInfluence(R.dataDamageInfluenceChart);
  }

  function renderProgressionModel(){
    if(!R.progressionFormulaGrid||!R.passiveRulesGrid)return;
    const sp=DATA.progressionModel.skillPoints;
    R.progressionFormulaGrid.innerHTML=`
      <article class="progression-formula"><span>Atributo final</span><code>(1 + pontos aplicados + aditivo) × (1 + percentual ÷ 100)</code><small>O valor intermediário permanece decimal; somente a exibição arredonda.</small></article>
      <article class="progression-formula"><span>Max HP</span><code>(50 + 2,5 × (nível − 1) + HP aditivo + 2,5 × ${attributeTypeHtml('con')}) × HP%</code><small>Inclui os marcos da passiva Melee como HP aditivo.</small></article>
      <article class="progression-formula"><span>Max MP</span><code>(10 + (nível − 1) + MP aditivo + 1,2 × ${attributeTypeHtml('spr')}) × MP%</code><small>Inclui os marcos da passiva Magic como MP aditivo.</small></article>
      <article class="progression-formula"><span>Defense</span><code>(Defesa aditiva + ${attributeTypeHtml('con')} ÷ 10) × Defesa%</code><small>O bônus da passiva Melee entra na parcela aditiva.</small></article>
      <article class="progression-formula"><span>Skill Points</span><code>${fmtSmart(sp.starting)} + (nível − 1) + ⌊nível/5⌋ + ⌊nível/10⌋</code><small>Skills comuns custam o nível ativo em SP; buffs e proficiências custam 0.</small></article>
      <article class="progression-formula wide"><span>Regen e crítico</span><code>HP/tick = (CON/12)/(1+CON/100)+1+(CON/10000)×HP · MP/tick = 3+((SPR×2)/8,5)/(1+(SPR/4,5)/100+SPR/220)+0,03×MP · Crit = 65×log10(LUK/32+1)</code><small>Um tick de regeneração dura 1,5 segundo. Aditivos, percentuais e passivas entram nos pontos indicados pelo compêndio.</small></article>`;
    R.passiveRulesGrid.innerHTML=['melee','range','magic','faith'].map(type=>{
      const rule=DATA.passiveRules[type];
      const bonuses=rule.bonuses.map(bonus=>`<li>+${fmtSmart(bonus.amount)}${bonus.unit||''} ${bonus.label} a cada ${bonus.every} níveis</li>`).join('');
      return `<article class="passive-rule type-${type}"><span>${damageTypeHtml(type)} Passive</span><strong>Máximo 99</strong><ul>${bonuses}</ul></article>`;
    }).join('');
  }

  function renderData(){
    renderAttributeDamageModel();
    renderProgressionModel();
    R.modelInputs.innerHTML='';Object.entries(state.optimizer.model).forEach(([k,v])=>{const l=document.createElement('label');l.innerHTML=`${k}<input data-model="${k}" type="number" step="0.001" value="${v}">`;R.modelInputs.appendChild(l);});
    R.dataSkillList.innerHTML='';currentLoadout().skills.forEach(s=>{const card=document.createElement('div');card.className='data-skill-card';const power=s.basePower?`${fmt(s.basePower.base,1)} + ${fmt(s.basePower.perLevel,1)}/Lv`:'0';card.innerHTML=`<div class="data-skill-head"><strong>${s.name}</strong><span class="microcopy">${s.sourceStatus}</span></div><div class="data-skill-grid"><label>Cooldown<input data-skill-edit="cooldown" data-skill-id="${s.id}" type="number" step="0.1" value="${s.cooldown??''}"></label>${TYPES.map(t=>`<label>${damageTypeHtml(t,'Base '+TYPE_LABEL[t])}<input data-scale-edit="base" data-scale-type="${t}" data-skill-id="${s.id}" type="number" step="0.1" value="${s.scalings?.[t]?.base??0}"></label><label>${damageTypeHtml(t,TYPE_LABEL[t]+' /Lv')}<input data-scale-edit="perLevel" data-scale-type="${t}" data-skill-id="${s.id}" type="number" step="0.1" value="${s.scalings?.[t]?.perLevel??0}"></label>`).join('')}</div><div class="hit-audit"><strong>${s.nonDamage?'Sem DPS direto':hitProfileText(s)}</strong><span>Power / hit: ${power}</span><small>${s.hitNote || ''} · ${s.hitSource || 'sem fonte'} · ${hitConfidenceLabel(s.hitConfidence)}</small></div><p class="microcopy">Scaling por hit: ${scalingFormulaText(s)}</p>`;R.dataSkillList.appendChild(card);});
    $$('[data-model]').forEach(i=>i.addEventListener('input',()=>{state.optimizer.model[i.dataset.model]=Number(i.value||0);save();}));
    $$('[data-skill-edit]').forEach(i=>i.addEventListener('input',()=>{const s=getSkill(i.dataset.skillId);s.cooldown=i.value===''?null:Number(i.value);s.cooldownMs=s.cooldown===null?0:s.cooldown*1000;save();renderDps();renderInspector();}));
    $$('[data-scale-edit]').forEach(i=>i.addEventListener('input',()=>{const s=getSkill(i.dataset.skillId),t=i.dataset.scaleType,k=i.dataset.scaleEdit;s.scalings[t]=s.scalings[t]||{base:0,perLevel:0};s.scalings[t][k]=Number(i.value||0);save();renderDps();renderInspector();renderSkillTable();renderTreeBrowser();}));
  }

  function exportBuild(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='souls-remnant-build.json';a.click();URL.revokeObjectURL(u);}
  function importBuild(file){const r=new FileReader();r.onload=()=>{try{state=mergeState(defaultState(),JSON.parse(r.result));state.lastOptimization=null;renderAll();toast('Build importada.');}catch(_){toast('JSON inválido.');}};r.readAsText(file);}
  function share(){try{const s=btoa(encodeURIComponent(JSON.stringify(state)));const u=`${location.href.split('#')[0]}#build=${s}`;navigator.clipboard.writeText(u).then(()=>toast('Link copiado.')).catch(()=>prompt('Copie o link:',u));}catch(_){toast('Não foi possível gerar o link.');}}

  function renderAll(skipSave=false){currentLoadout().skills.forEach(sanitizeSkill);enforceSlotLimits();renderLoadouts();renderLeft();renderTabs();renderFilters();renderTreeBrowser();renderInspector();renderSkillTable();renderDps();renderOptimizerInputs();renderOptimizerResult();renderData();if(!skipSave)save();}

  function onDamageInput(e){const i=e.target.closest('[data-damage-prefix]');if(!i)return;const t=i.dataset.damageType,p=i.dataset.damagePrefix,v=Number(i.value||0);if(p==='weapon-left'||p==='weapon-dps')currentLoadout().weaponAttack[t]=v;if(p==='base-dps'||p==='optimizer-base')currentLoadout().baseAttack[t]=v;save();renderDps(true);renderInspector();if(R.quickRotationDps)R.quickRotationDps.textContent=fmt(rotationDps(activeSkills(),attackTotals()).total,0);}

  R.tabs.addEventListener('click',e=>{const t=e.target.closest('.tab');if(!t)return;state.currentTab=t.dataset.tab;renderTabs();save();});
  R.skillSearch.addEventListener('input',()=>{state.search=R.skillSearch.value;renderTreeBrowser();save();});
  document.addEventListener('input',e=>{
    if(e.target.matches('[data-damage-prefix]'))onDamageInput(e);
    if(e.target.matches('[data-character-stat]')){currentLoadout().attributes[e.target.dataset.characterStat]=Number(e.target.value||0);state.optimizer.baseStats={...currentLoadout().attributes};state.lastOptimization=null;save();renderDps(true);renderInspector();}
    if(e.target.matches('[data-combat-stat]')){currentLoadout().combatStats[e.target.dataset.combatStat]=Number(e.target.value||0);save();renderDps(true);renderInspector();}
    if(e.target.matches('[data-primary-additive]')){currentLoadout().primaryAdditive[e.target.dataset.primaryAdditive]=Number(e.target.value||0);save();renderDps(true);renderInspector();}
    if(e.target.matches('[data-primary-percent]')){currentLoadout().primaryPercent[e.target.dataset.primaryPercent]=Number(e.target.value||0);save();renderDps(true);renderInspector();}
    if(e.target.matches('[data-status-modifier]')){currentLoadout().statusModifiers[e.target.dataset.statusModifier]=Number(e.target.value||0);save();renderDps(true);renderInspector();}
    if(e.target.matches('[data-combat-context][type="number"]')){currentLoadout().combatContext[e.target.dataset.combatContext]=Number(e.target.value||0);save();renderDps(true);renderInspector();}
  });
  document.addEventListener('change',e=>{
    if(e.target.matches('#characterLevelInput')){currentLoadout().characterLevel=Math.floor(clamp(e.target.value,1,99));state.lastOptimization=null;renderAll();}
    if(e.target.matches('[data-passive-level]')){const skill=getSkill(e.target.dataset.passiveLevel);if(skill){skill.activeLevel=clamp(e.target.value,0,99);state.lastOptimization=null;renderAll();}}
    if(e.target.matches('[data-combat-context][type="checkbox"]')){currentLoadout().combatContext[e.target.dataset.combatContext]=e.target.checked;save();renderDps(true);renderInspector();}
  });
  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-action]');if(!a)return;
    const act=a.dataset.action;
    if(act==='save'){save();toast('Salvo no navegador.');}
    if(act==='export')exportBuild();
    if(act==='import')R.importFile.click();
    if(act==='share')share();
    if(act==='reset-active'){currentLoadout().skills.forEach(s=>{if(s.panelType!=='passive')s.activeLevel=0;});state.lastOptimization=null;renderAll();}
    if(act==='reset-all'){if(confirm('Resetar o loadout atual?')){state.loadouts[state.activeLoadout]=defaultLoadout(state.activeLoadout);state.lastOptimization=null;renderAll();}}
    if(act==='optimize')optimize();
    if(act==='compare'){readOptimizer();const res=evaluate({str:0,dex:0,int:0,spr:0,con:0,luk:0},blankDamage());toast(`DPS base sem arma hipotética: ${fmt(res.dps,1)}`);}
    if(act==='reset-model'){state.optimizer.model=clone(DATA.modelDefaults);renderAll();}
    if(act==='show-all-tree'){state.filter='all';state.search='';renderFilters();renderTreeBrowser();save();}
  });
  R.importFile.addEventListener('change',()=>{const f=R.importFile.files?.[0];if(f)importBuild(f);R.importFile.value='';});
  R.objectivePreset.addEventListener('change',()=>setPreset(R.objectivePreset.value));
  [R.availablePoints,R.minCon,R.dpsWeight,R.survivalWeight,R.supportWeight,R.weaponSinglePower,R.weaponDualPower,R.weaponGlobalPower].forEach(i=>i.addEventListener('input',()=>{readOptimizer();R.dpsWeightOut.textContent=state.optimizer.dpsWeight+'%';R.survivalWeightOut.textContent=state.optimizer.survivalWeight+'%';R.supportWeightOut.textContent=state.optimizer.supportWeight+'%';save();}));
  renderAll();
})();
