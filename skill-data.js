window.SKILL_PLANNER_DATA = {
  categories: [
    { key: 'all', label: 'Todas' },
    { key: 'melee', label: 'Melee' },
    { key: 'range', label: 'Range' },
    { key: 'magic', label: 'Magic' },
    { key: 'faith', label: 'Faith' },
    { key: 'hybrid', label: 'Híbridas' },
    { key: 'utility', label: 'Utilidade' }
  ],
  damageTypes: ['melee', 'range', 'magic', 'faith'],
  damageLabels: { melee: 'Melee', range: 'Range', magic: 'Magic', faith: 'Faith', health: 'Max HP', mana: 'Max MP', str: 'STR', dex: 'DEX', int: 'INT', spr: 'SPR', con: 'CON', luk: 'LUK' },
  attributeFields: [
    { key: 'str', label: 'STR', value: 0 },
    { key: 'dex', label: 'DEX', value: 0 },
    { key: 'int', label: 'INT', value: 0 },
    { key: 'spr', label: 'SPR', value: 0 },
    { key: 'con', label: 'CON atual', value: 0 },
    { key: 'luk', label: 'LUK', value: 0 }
  ],
  modelDefaults: {
    conToHp: 8,
    conToDef: 1.4,
    conToSurvivalScore: 1.2,
    lukToCritChance: 0,
    baseCritChance: 0,
    critDamageMultiplier: 1.5,
    survivalHpValue: 0.04,
    survivalDefValue: 0.12,
    supportValueMultiplier: 1
  },
  attributeDamageModel: {
    source: 'Coleta in-game: 0–200 pontos, sem arma e com +30 Global ATK',
    rawAttackSamples: [15, 45],
    pointRange: [0, 200],
    fitR2: { min: 0.9976, max: 1 },
    baseline: {
      melee: { multiplier: 1.133333, offset: -1 },
      range: { multiplier: 1.133333, offset: -1 },
      magic: { multiplier: 1.1, offset: -0.5 },
      faith: { multiplier: 1.133333, offset: -1 }
    },
    impacts: {
      melee: { str: 0.03727, spr: 0.00931 },
      range: { dex: 0.03762, spr: 0.00752 },
      magic: { int: 0.03687, spr: 0.01668 },
      faith: { str: 0.00944, spr: 0.03762 }
    }
  },
  weaponRatios: {
    single: 50.5,
    dual: 38.1,
    global: 30,
    evidence: {
      stone: { single: 12.5, dual: 9, global: 7 },
      copper: { single: 17.5, dual: 13, global: 10.5 },
      quartz: { single: 22.5, dual: 18, global: 14 }
    }
  },
  weaponArchetypes: [
    { id: 'single-melee', name: 'Sword / Single Melee', kind: 'single', types: ['melee'] },
    { id: 'single-range', name: 'Kunai / Single Range', kind: 'single', types: ['range'] },
    { id: 'single-magic', name: 'Magic Wand / Single Magic', kind: 'single', types: ['magic'] },
    { id: 'single-faith', name: 'Cross / Single Faith', kind: 'single', types: ['faith'] },
    { id: 'dual-melee-range', name: 'Javelin / Melee + Range', kind: 'dual', types: ['melee','range'] },
    { id: 'dual-melee-magic', name: 'Spellblade / Melee + Magic', kind: 'dual', types: ['melee','magic'] },
    { id: 'dual-melee-faith', name: 'Shield / Melee + Faith', kind: 'dual', types: ['melee','faith'] },
    { id: 'dual-range-magic', name: 'Bow / Range + Magic', kind: 'dual', types: ['range','magic'] },
    { id: 'dual-range-faith', name: 'Holy Arrow / Range + Faith', kind: 'dual', types: ['range','faith'] },
    { id: 'dual-magic-faith', name: 'Focus / Magic + Faith', kind: 'dual', types: ['magic','faith'] },
    { id: 'global', name: 'Orb / Global', kind: 'global', types: ['melee','range','magic','faith'] }
  ],
  skills: [
  {
    "id": "bloodlust",
    "mapNodeId": "skill-76",
    "name": "Bloodlust",
    "short": "B",
    "icon": "assets/skill-icons/bloodlust.png",
    "category": "utility",
    "group": "melee",
    "classes": [
      "melee",
      "magic"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 40.1,
    "duration": 40,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Embrace pain: every 5 damage you take adds a stack worth +1.34% global damage and +1 HP regen per tick, up to 5(+2.5/lv) stacks, but you take 35% more damage while it lasts. Multiplies with your other buff bonuses. Nearby party members gain 25% of your current damage bonus.",
    "unlock": "Melee at level 27",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "blue_moon",
    "mapNodeId": "skill-101",
    "name": "Blue Moon",
    "short": "BM",
    "icon": "assets/skill-icons/blue-moon.png",
    "category": "utility",
    "group": "melee",
    "classes": [
      "melee",
      "magic"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 50,
    "duration": 5,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Howl at the blue moon: you shrug off 90% of incoming damage, party members within range a quarter of that, and everyone gains 80 Speed for 5(+0.37/lv) seconds. Attack speed does not reduce this cooldown.",
    "unlock": "Magic at level 25, Melee (Skill #58) at level 25",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "crescent_slash",
    "mapNodeId": "skill-56",
    "name": "Crescent Slash",
    "short": "CS",
    "icon": "assets/skill-icons/crescent-slash.png",
    "category": "hybrid",
    "group": "melee",
    "classes": [
      "melee",
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 3.9,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 24,
      "perLevel": 12.5
    },
    "mpRegenPenalty": null,
    "description": "Throw your sword arc forward as a travelling crescent of energy that cuts through the enemies in its path.",
    "unlock": "Magic at level 8, Melee (Skill #58) at level 8",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 270.4,
        "perLevel": 137.28
      },
      "magic": {
        "base": 150,
        "perLevel": 110.75
      }
    },
    "damageTypes": [
      "melee",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "crimson_moon",
    "mapNodeId": "skill-96",
    "name": "Crimson Moon",
    "short": "CM",
    "icon": "assets/skill-icons/crimson-moon.png",
    "category": "hybrid",
    "group": "melee",
    "classes": [
      "melee",
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 16,
    "duration": 1.25,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 15,
    "damageMultiplier": 15,
    "hitNote": "15 crescents descritos.",
    "basePower": {
      "base": 10,
      "perLevel": 5
    },
    "mpRegenPenalty": null,
    "description": "Leap beneath a crimson moon and hang in the air, raining 15 homing crescents across the pack in a single second.",
    "unlock": "Magic at level 25, Melee (Skill #58) at level 25",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 160,
        "perLevel": 80
      },
      "magic": {
        "base": 160,
        "perLevel": 80
      }
    },
    "damageTypes": [
      "melee",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "flash_strike",
    "mapNodeId": "skill-85",
    "name": "Flash Strike",
    "short": "FS",
    "icon": "assets/skill-icons/flash-strike.png",
    "category": "hybrid",
    "group": "melee",
    "classes": [
      "melee",
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 8,
    "duration": 0,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 7,
    "damageMultiplier": 7,
    "hitNote": "7 golpes descritos.",
    "basePower": {
      "base": 10,
      "perLevel": 5
    },
    "mpRegenPenalty": null,
    "description": "Send out a mirage of yourself to blur between nearby enemies, striking 7 times in a flash of blades. You never move an inch and stay free to fight, completely invulnerable until the mirage fades.",
    "unlock": "Magic at level 20, Melee (Skill #58) at level 15",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 110,
        "perLevel": 62
      },
      "magic": {
        "base": 110,
        "perLevel": 62
      }
    },
    "damageTypes": [
      "melee",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "grapple_strike",
    "mapNodeId": "skill-35",
    "name": "Grapple Strike",
    "short": "GS",
    "icon": "assets/skill-icons/grapple-strike.png",
    "category": "hybrid",
    "group": "melee",
    "classes": [
      "melee"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 3.9,
    "duration": 3,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 35,
      "perLevel": 18
    },
    "mpRegenPenalty": null,
    "description": "Fling your hook at an enemy and yank yourself to it, stunning it on impact and riding it until you press jump to kick off.",
    "unlock": "Melee at level 20",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 268.2056,
        "perLevel": 151.216
      },
      "faith": {
        "base": 50.5835,
        "perLevel": 71.6635
      },
      "range": {
        "base": 50.5835,
        "perLevel": 77.5625
      }
    },
    "damageTypes": [
      "melee",
      "faith",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "heavy_strike",
    "mapNodeId": "skill-1",
    "name": "Heavy Strike",
    "short": "HS",
    "icon": "assets/skill-icons/heavy-strike.png",
    "category": "hybrid",
    "group": "melee",
    "classes": [
      "melee"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 5,
    "activeMax": 20,
    "cooldown": 2.6,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 28,
      "perLevel": 14
    },
    "mpRegenPenalty": null,
    "description": "Bring your weapon down in one heavy overhead swing that sends enemies flying with about three times the knockback of a normal attack. Hold the button to keep swinging.",
    "unlock": "Melee at level 4",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 208,
        "perLevel": 123.6
      },
      "faith": {
        "base": 117.85,
        "perLevel": 56.5
      }
    },
    "damageTypes": [
      "melee",
      "faith"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "lunar_step",
    "mapNodeId": "skill-84",
    "name": "Lunar Step",
    "short": "LS",
    "icon": "assets/skill-icons/lunar-step.png",
    "category": "hybrid",
    "group": "melee",
    "classes": [
      "melee",
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 4.5,
    "duration": 0,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 5,
    "damageMultiplier": 5,
    "hitNote": "5 golpes descritos.",
    "basePower": {
      "base": 18,
      "perLevel": 8
    },
    "mpRegenPenalty": null,
    "description": "Step through the moonlight to the farthest enemy ahead and land 5 rapid strikes, stepping onward to a new target if the first one dies.",
    "unlock": "Magic at level 15, Melee (Skill #58) at level 15",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 100,
        "perLevel": 45
      },
      "magic": {
        "base": 100,
        "perLevel": 45
      }
    },
    "damageTypes": [
      "melee",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "magic_slash",
    "mapNodeId": "skill-83",
    "name": "Magic Slash",
    "short": "MS",
    "icon": "assets/skill-icons/magic-slash.png",
    "category": "hybrid",
    "group": "melee",
    "classes": [
      "melee"
    ],
    "panelType": "basic",
    "slotSource": "skills.json",
    "skillKind": "Basic Attack",
    "sourceSkillKind": "Basic Attack",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 0.6,
    "duration": 0,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1.1167,
    "hitNote": "1 golpe por cooldown; média da cadeia (1x + 1x + 1,35x) / 3.",
    "basePower": {
      "base": 5.5,
      "perLevel": 3.5
    },
    "mpRegenPenalty": null,
    "description": "A basic attack: a magic-infused three-swing chain that throws a piercing crescent wave; the third swing lands for x1.35 damage and every hit grants a little Shield.",
    "unlock": "Magic at level 5, Melee (Skill #58) at level 5",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 60,
        "perLevel": 29.4
      },
      "magic": {
        "base": 60,
        "perLevel": 29.4
      }
    },
    "damageTypes": [
      "melee",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "melee",
    "mapNodeId": "skill-58",
    "name": "Melee",
    "short": "M",
    "icon": "assets/skill-icons/melee-passive.png",
    "category": "utility",
    "group": "melee",
    "classes": [
      "melee"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Proficiency (passive)",
    "sourceSkillKind": "Proficiency (passive)",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 0.001,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Your Melee proficiency. It levels on its own as you deal Melee damage, gates which Melee skills you can learn, and lifts your Melee damage as it grows. Caps at 99.",
    "unlock": "Character level 1",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "onslaught",
    "mapNodeId": "skill-50",
    "name": "Onslaught",
    "short": "O",
    "icon": "assets/skill-icons/onslaught.png",
    "category": "hybrid",
    "group": "melee",
    "classes": [
      "range",
      "melee"
    ],
    "panelType": "additional",
    "slotSource": "correção do jogo",
    "skillKind": "Active",
    "sourceSkillKind": "Basic Attack",
    "activeLevel": 5,
    "activeMax": 20,
    "cooldown": 1.2,
    "duration": 0.7,
    "attacksPerSecond": 14,
    "hits": 9.8,
    "damageMultiplier": 9.8,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "cadência × duração",
    "hitConfidence": "derived",
    "hitNote": "14/s × 0.7s = 9.8 ocorrências esperadas.",
    "basePower": {
      "base": 2,
      "perLevel": 1
    },
    "mpRegenPenalty": null,
    "description": "Explode into a flurry, striking the nearest enemy about 14 times a second for the duration. Free to cast while Slash is your basic attack.",
    "unlock": "Magic at level 5, Melee (Skill #58) at level 35",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 14.092,
        "perLevel": 5.3664
      },
      "faith": {
        "base": 8.857,
        "perLevel": 2.39
      },
      "magic": {
        "base": 8.0155,
        "perLevel": 2.39
      },
      "range": {
        "base": 8.857,
        "perLevel": 2.39
      }
    },
    "damageTypes": [
      "melee",
      "faith",
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "shield_slam",
    "mapNodeId": "skill-48",
    "name": "Shield Slam",
    "short": "SS",
    "icon": "assets/skill-icons/shield-slam.png",
    "category": "hybrid",
    "group": "melee",
    "classes": [
      "melee",
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 3.9,
    "duration": 0.5,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 60,
      "perLevel": 30
    },
    "mpRegenPenalty": null,
    "description": "Charge shield-first at the nearest enemy, invulnerable on the way, sending it flying with the hardest knockback in the game. Every slam grants 7(+2/lv) Shield plus 8% of your max HP, even past your Shield cap.",
    "unlock": "Faith at level 12, Melee (Skill #58) at level 16",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 303.108,
        "perLevel": 152.152
      },
      "faith": {
        "base": 243.2,
        "perLevel": 137.95
      },
      "magic": {
        "base": 8.432,
        "perLevel": 85.135
      }
    },
    "damageTypes": [
      "melee",
      "faith",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "slash",
    "mapNodeId": "skill-40",
    "name": "Slash",
    "short": "S",
    "icon": "assets/skill-icons/slash.png",
    "category": "melee",
    "group": "melee",
    "classes": [
      "melee"
    ],
    "panelType": "basic",
    "slotSource": "skills.json",
    "skillKind": "Basic Attack",
    "sourceSkillKind": "Basic Attack",
    "activeLevel": 5,
    "activeMax": 20,
    "cooldown": 0.45,
    "duration": 0,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1.1167,
    "hitNote": "1 golpe por cooldown; média da cadeia (1x + 1x + 1,35x) / 3.",
    "basePower": {
      "base": 8,
      "perLevel": 5
    },
    "mpRegenPenalty": null,
    "description": "The default basic attack: a fast three-swing chain whose third swing lands for x1.35 damage.",
    "unlock": "Melee at level 1",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 52,
        "perLevel": 23.4
      }
    },
    "damageTypes": [
      "melee"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "taunt",
    "mapNodeId": "skill-3",
    "name": "Taunt",
    "short": "T",
    "icon": "assets/skill-icons/taunt.png",
    "category": "utility",
    "group": "melee",
    "classes": [
      "melee",
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 5,
    "activeMax": 20,
    "cooldown": 45,
    "duration": 6,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 1,
      "perLevel": 0.5
    },
    "mpRegenPenalty": null,
    "description": "Roar and force nearby monsters to attack you, then keep roaring automatically every 3 seconds for 90 seconds. Every monster hit stacks Berserk: +2 Speed, +2.5 Defense and +1.35% global damage per stack, up to 3(+1/lv) stacks. The damage multiplies with your other buff bonuses.",
    "unlock": "Melee at level 11",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "health": {
        "base": 0.0298,
        "perLevel": 0
      }
    },
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "undying",
    "mapNodeId": "skill-100",
    "name": "Undying",
    "short": "U",
    "icon": "assets/skill-icons/undying.png",
    "category": "utility",
    "group": "melee",
    "classes": [
      "melee"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": {
      "base": 1,
      "perLevel": 0.15
    },
    "description": "Toggle. Refuse to fall: 20(+3.68/lv)% of the damage you take does not land at once, instead bleeding out of you over 4 seconds. Killing an enemy cleanses 25% of your remaining bleed, and every hit on a boss cleanses 2%. Lowers your MP regen by 1(+0.15/lv) per tick. Healing past full health mends the bleed by the excess.",
    "unlock": "Melee at level 32",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "upward_strike",
    "mapNodeId": "skill-21",
    "name": "Upward Strike",
    "short": "US",
    "icon": "assets/skill-icons/upward-strike.png",
    "category": "melee",
    "group": "melee",
    "classes": [
      "melee"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 3,
    "activeMax": 20,
    "cooldown": 2.6,
    "duration": 1.2,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 55,
      "perLevel": 27.5
    },
    "mpRegenPenalty": null,
    "description": "Swing skyward, launching non-boss enemies straight up and stunning them for the duration. Nothing resists the launch; bosses ignore it.",
    "unlock": "Melee at level 25",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 50.29,
        "perLevel": 25.79
      }
    },
    "damageTypes": [
      "melee"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "whirlwind",
    "mapNodeId": "skill-55",
    "name": "Whirlwind",
    "short": "W",
    "icon": "assets/skill-icons/whirlwind.png",
    "category": "hybrid",
    "group": "melee",
    "classes": [
      "melee",
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 9,
    "duration": 3.05,
    "attacksPerSecond": 2,
    "hits": 6.1,
    "damageMultiplier": 6.1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "cadência × duração",
    "hitConfidence": "derived",
    "hitNote": "2/s × 3.05s = 6.1 ocorrências esperadas.",
    "basePower": {
      "base": 20,
      "perLevel": 10
    },
    "mpRegenPenalty": null,
    "description": "Spin up a whirlwind you can walk with. Every hit drags enemies into your face instead of scattering them, and casting grants +18 Speed, +5 Jump and 25(+5/lv)(+0.15 per INT) Shield.",
    "unlock": "Magic at level 12, Melee (Skill #58) at level 28",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 80,
        "perLevel": 39
      },
      "faith": {
        "base": 41.964,
        "perLevel": 18
      },
      "magic": {
        "base": 80,
        "perLevel": 39
      }
    },
    "damageTypes": [
      "melee",
      "faith",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "melee"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "arrow_infusion",
    "mapNodeId": "skill-94",
    "name": "Arrow Infusion",
    "short": "AI",
    "icon": "assets/skill-icons/arrow-infusion.png",
    "category": "utility",
    "group": "range",
    "classes": [
      "range",
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": {
      "base": 1,
      "perLevel": 0.15
    },
    "description": "Toggle. Your projectile hits weaken monsters, cutting their damage and shredding their armor, while all of your Crit Rate becomes Elemental Chance and all of your Crit Damage becomes Elemental Potency. Lowers your MP regen by 1(+0.15/lv) per tick. Trains from your projectile hits while it is on.",
    "unlock": "Range at level 12, Faith (Skill #61) at level 12",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "arrow_rain",
    "mapNodeId": "skill-34",
    "name": "Arrow Rain",
    "short": "AR",
    "icon": "assets/skill-icons/arrow-rain.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "faith",
      "range"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 4.5,
    "duration": 0,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 5,
    "damageMultiplier": 5,
    "hitNote": "5 flechas descritas.",
    "basePower": {
      "base": 8.10000038146973,
      "perLevel": 4
    },
    "mpRegenPenalty": null,
    "description": "Loose a volley of five magic arrows that curve toward monsters ahead. Tap for a third of the damage, full draw for all of it.",
    "unlock": "Magic at level 8, Range (Skill #59) at level 8",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 8.5,
        "perLevel": 21.25
      },
      "magic": {
        "base": 8.5,
        "perLevel": 21.25
      },
      "range": {
        "base": 64,
        "perLevel": 32
      }
    },
    "damageTypes": [
      "faith",
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "arrow_storm",
    "mapNodeId": "skill-44",
    "name": "Arrow Storm",
    "short": "AS",
    "icon": "assets/skill-icons/arrow-rain.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range",
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 6,
    "duration": 1,
    "attacksPerSecond": 4,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 8,
    "damageMultiplier": 8,
    "hitNote": "8 flechas descritas; a descrição prevalece sobre 4 ataques/s × 1s.",
    "basePower": {
      "base": 17,
      "perLevel": 8.5
    },
    "mpRegenPenalty": null,
    "description": "Release a standing barrage of eight arrows that curve toward monsters ahead. Your draw at release sets the power of the whole barrage, from a third on a tap to full.",
    "unlock": "Magic at level 18, Range (Skill #59) at level 18",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 8.5,
        "perLevel": 20.4
      },
      "range": {
        "base": 58,
        "perLevel": 29
      }
    },
    "damageTypes": [
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "bullseye",
    "mapNodeId": "skill-73",
    "name": "Bullseye",
    "short": "B",
    "icon": "assets/skill-icons/bullseye.png",
    "category": "utility",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 10,
    "duration": 60,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 7,
      "perLevel": 2
    },
    "mpRegenPenalty": null,
    "description": "Steady your aim, adding 9(+2/lv) Crit Rate plus a bonus from your LUK and DEX. Nearby party members gain half of the crit rate bonus while it lasts.",
    "unlock": "Range at level 15",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "luk": {
        "base": 0.2,
        "perLevel": 0
      },
      "dex": {
        "base": 0.5,
        "perLevel": 0
      }
    },
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "clarity",
    "mapNodeId": "skill-95",
    "name": "Clarity",
    "short": "C",
    "icon": "assets/skill-icons/clarity.png",
    "category": "utility",
    "group": "range",
    "classes": [
      "range",
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": {
      "base": 2,
      "perLevel": 0.15
    },
    "description": "Toggle. Monsters suffering from any status effect take x1.1008(+1.68%/lv) damage from you. Lowers your MP regen by 2(+0.15/lv) per tick. Trains from hits on monsters suffering a status effect.",
    "unlock": "Range at level 28, Faith (Skill #61) at level 28",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "companion",
    "mapNodeId": "skill-104",
    "name": "Companion",
    "short": "C",
    "icon": "assets/skill-icons/companion.png",
    "category": "utility",
    "group": "range",
    "classes": [
      "magic",
      "range"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": {
      "base": 1,
      "perLevel": 0.15
    },
    "description": "Toggle. A hawk companion flies at your side: your attacks have a 6(+1.74/lv)% chance to strike again at full strength (shadow clones never trigger it), and you and nearby party members gain 1(+0.32/lv) Accuracy and 1(+0.37/lv) Damage Balance. Lowers your MP regen by 1(+0.15/lv) per tick.",
    "unlock": "Magic at level 29, Range (Skill #59) at level 29",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "cursed_throw",
    "mapNodeId": "skill-45",
    "name": "Cursed Throw",
    "short": "CT",
    "icon": "assets/skill-icons/cursed-throw.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 3,
    "duration": 15,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": true,
    "sustainedHitsPerSecond": 0,
    "hits": 4,
    "damageMultiplier": 2.5,
    "hitNote": "1 impacto + até 3 ativações de 0,5x; bônus contra boss não incluído.",
    "basePower": {
      "base": 11.5,
      "perLevel": 6
    },
    "mpRegenPenalty": null,
    "description": "Throw a cursed kunai that chains between monsters, cursing each one. Whenever anyone hits a cursed enemy, every enemy you cursed takes 50% of a Cursed Throw hit (5x on bosses), up to 3 times. Death spreads the curse.",
    "unlock": "Range at level 4",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 31.8,
        "perLevel": 25
      },
      "range": {
        "base": 90,
        "perLevel": 45
      }
    },
    "damageTypes": [
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "dash",
    "mapNodeId": "skill-69",
    "name": "Dash",
    "short": "D",
    "icon": "assets/skill-icons/dash.png",
    "category": "range",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1.5,
    "duration": 0.5,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Dash in the direction you hold, untouchable for the whole dash, phasing through terrain when safe ground waits on the far side. Release early to stop short.",
    "unlock": "Range at level 8",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "dash_strike",
    "mapNodeId": "skill-9",
    "name": "Dash Strike",
    "short": "DS",
    "icon": "assets/skill-icons/dash-strike.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "melee",
      "range"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 2.6,
    "duration": 0.45,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 18,
      "perLevel": 9
    },
    "mpRegenPenalty": null,
    "description": "Burst forward, damaging enemies you pass through, invulnerable for the whole dash. Release early to cut the dash short.",
    "unlock": "Melee at level 8",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 190,
        "perLevel": 94.2
      },
      "range": {
        "base": 73.57,
        "perLevel": 67.8
      }
    },
    "damageTypes": [
      "melee",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "feather_jump",
    "mapNodeId": "skill-74",
    "name": "Feather Jump",
    "short": "FJ",
    "icon": "assets/skill-icons/feather-jump.png",
    "category": "utility",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 8,
    "duration": 6.5,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Launch upward and drift down slowly, gaining 7(+2.31/lv)% global damage while Airborne. Multiplies with your other buff bonuses.",
    "unlock": "Magic at level 15, Range (Skill #59) at level 15",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "flare_arrow",
    "mapNodeId": "skill-92",
    "name": "Flare Arrow",
    "short": "FA",
    "icon": "assets/skill-icons/flare-arrow.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range",
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 6,
    "duration": 0,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 3,
    "damageMultiplier": 3,
    "hitNote": "Impacto + 2 explosões.",
    "basePower": {
      "base": 30,
      "perLevel": 15
    },
    "mpRegenPenalty": null,
    "description": "Charge an arrow of holy flame that detonates on impact, then walks two more explosions across the pack. Tap for a third of the damage, full draw for all of it.",
    "unlock": "Range at level 8, Faith (Skill #61) at level 8",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 60,
        "perLevel": 35
      },
      "range": {
        "base": 110,
        "perLevel": 50
      }
    },
    "damageTypes": [
      "faith",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "force_of_will",
    "mapNodeId": "skill-75",
    "name": "Force of Will",
    "short": "FOW",
    "icon": "assets/skill-icons/force-of-will.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "faith",
      "melee"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 9,
    "duration": 5,
    "attacksPerSecond": 2,
    "hits": 10,
    "damageMultiplier": 10,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "cadência × duração",
    "hitConfidence": "derived",
    "hitNote": "2/s × 5s = 10 ocorrências esperadas.",
    "basePower": {
      "base": 7,
      "perLevel": 5
    },
    "mpRegenPenalty": null,
    "description": "Channel a hunger that drags the four furthest enemies around you toward you twice a second, damaging them as it pulls. You stay free to move; bosses are untouched. Your will hardens you for 15(+2.368/lv) Defense while it lasts.",
    "unlock": "Faith at level 22, Melee (Skill #58) at level 16",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 10.2,
        "perLevel": 5.525
      },
      "faith": {
        "base": 4.25,
        "perLevel": 5.525
      }
    },
    "damageTypes": [
      "melee",
      "faith"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "heaven_arrow",
    "mapNodeId": "skill-72",
    "name": "Heaven Arrow",
    "short": "HA",
    "icon": "assets/skill-icons/heaven-arrow.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 9.5,
    "duration": 5,
    "attacksPerSecond": 5,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 25,
    "damageMultiplier": 25,
    "hitNote": "25 flechas descritas.",
    "basePower": {
      "base": 21,
      "perLevel": 10.5
    },
    "mpRegenPenalty": null,
    "description": "Summon a halo above your head that fires 25 homing arrows at nearby monsters while you keep fighting, dodging, or running.",
    "unlock": "Range at level 28",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 8.5,
        "perLevel": 8.5
      },
      "magic": {
        "base": 8.5,
        "perLevel": 8.5
      },
      "range": {
        "base": 30,
        "perLevel": 12
      }
    },
    "damageTypes": [
      "faith",
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "holy_arrow",
    "mapNodeId": "skill-91",
    "name": "Holy Arrow",
    "short": "HA",
    "icon": "assets/skill-icons/holy-arrow.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range",
      "faith"
    ],
    "panelType": "basic",
    "slotSource": "skills.json",
    "skillKind": "Basic Attack",
    "sourceSkillKind": "Basic Attack",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1.4,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 12,
      "perLevel": 6.5
    },
    "mpRegenPenalty": null,
    "description": "A basic attack: charge a blessed arrow that homes onto a monster and chains to the next with every hit. Tap for a third of the damage, full draw for all of it.",
    "unlock": "Range at level 5, Faith (Skill #61) at level 5",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 75,
        "perLevel": 45
      },
      "range": {
        "base": 75,
        "perLevel": 45
      }
    },
    "damageTypes": [
      "faith",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "holy_field",
    "mapNodeId": "skill-93",
    "name": "Holy Field",
    "short": "HF",
    "icon": "assets/skill-icons/holy-field.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range",
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 12,
    "duration": 5,
    "attacksPerSecond": 1,
    "hits": 5,
    "damageMultiplier": 5,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "cadência × duração",
    "hitConfidence": "derived",
    "hitNote": "1/s × 5s = 5 ocorrências esperadas.",
    "basePower": {
      "base": 16,
      "perLevel": 8
    },
    "mpRegenPenalty": null,
    "description": "Charge and loose an arrow of light that erupts into a radiant field, searing everything inside once a second and slowing enemies by 40% while they stand in it. Tap for a third of the damage, full draw for all of it.",
    "unlock": "Range at level 18, Faith (Skill #61) at level 23",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 150,
        "perLevel": 75
      },
      "range": {
        "base": 150,
        "perLevel": 75
      }
    },
    "damageTypes": [
      "faith",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "messenger",
    "mapNodeId": "skill-98",
    "name": "Messenger",
    "short": "M",
    "icon": "assets/skill-icons/messenger.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range",
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 8,
    "duration": 30,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "review",
    "conditionalHits": true,
    "sustainedHitsPerSecond": 0,
    "hits": 10,
    "damageMultiplier": 10,
    "hitNote": "Até 10 procs de true damage; pressupõe que o aliado consuma todos.",
    "basePower": {
      "base": 8,
      "perLevel": 4
    },
    "mpRegenPenalty": null,
    "description": "Send a blessed arrow to your chosen party member, shielding them for 15(+5/lv) plus 3(+0.5/lv)% of your Range and Faith damage for 4 seconds, and lacing their next 10 hits with true damage drawn from your power. Casting it with no ally to receive it shields you for a quarter as much. The experience returns to you.",
    "unlock": "Range at level 25, Faith (Skill #61) at level 25",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 180,
        "perLevel": 90
      },
      "range": {
        "base": 180,
        "perLevel": 90
      }
    },
    "damageTypes": [
      "faith",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "nimble",
    "mapNodeId": "skill-108",
    "name": "Nimble",
    "short": "N",
    "icon": "assets/skill-icons/nimble.png",
    "category": "utility",
    "group": "range",
    "classes": [
      "range",
      "magic"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Passive Stance",
    "sourceSkillKind": "Passive Stance",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Passive stance. Stay unhit for 12(-0.26/lv)s to prime a perfect dodge: while primed your Range and Magic damage rise 3.48(+1.08/lv)% (multiplying with your other buff bonuses), and the dodge negates the next hit, granting 1.5s of invisibility and a 3s Ambush. Nearby party members gain 15% Dodge Chance.",
    "unlock": "Magic at level 23, Range (Skill #59) at level 23",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "ninja_throw",
    "mapNodeId": "skill-2",
    "name": "Ninja Throw",
    "short": "NT",
    "icon": "assets/skill-icons/ninja-throw.png",
    "category": "range",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "basic",
    "slotSource": "skills.json",
    "skillKind": "Basic Attack",
    "sourceSkillKind": "Basic Attack",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 0.4,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 16,
      "perLevel": 8
    },
    "mpRegenPenalty": null,
    "description": "A basic attack: hurl a throwing knife with barely any knockback, perfect for kiting.",
    "unlock": "Range at level 1",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "range": {
        "base": 38.88,
        "perLevel": 19.656
      }
    },
    "damageTypes": [
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "phasing",
    "mapNodeId": "skill-86",
    "name": "Phasing",
    "short": "P",
    "icon": "assets/skill-icons/phasing.png",
    "category": "utility",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": {
      "base": 1,
      "perLevel": 0.15
    },
    "description": "Toggle. Leave after-images behind as you move, gaining 18(+2.21/lv) Speed and global damage that grows with how fast you are, up to 8.1(+1.94/lv)%. Your Dodge Chance grows the same way, up to 10(+1.316/lv)% at full speed. Lowers your MP regen by 1(+0.15/lv) per tick. Multiplies with your other buff bonuses. Trains as you travel with it on, faster the faster you move, and only over ground you have not crossed recently. Nearby party members gain half of the Speed while you have it on.",
    "unlock": "Magic at level 22, Melee (Skill #58) at level 22",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "range",
    "mapNodeId": "skill-59",
    "name": "Range",
    "short": "R",
    "icon": "assets/skill-icons/range-passive.png",
    "category": "utility",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Proficiency (passive)",
    "sourceSkillKind": "Proficiency (passive)",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 0.001,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Your Range proficiency. It levels on its own as you deal Range damage, gates which Range skills you can learn, and lifts your Range damage as it grows. Caps at 99.",
    "unlock": "Character level 1",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "realm_piercing_arrow",
    "mapNodeId": "skill-77",
    "name": "Realm Piercing Arrow",
    "short": "RPA",
    "icon": "assets/skill-icons/realm-piercing-arrow.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 12,
    "duration": 0,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "hitNote": "1 projétil; quantidade de alvos atravessados e bônus de 2x contra boss não incluídos.",
    "basePower": {
      "base": 25,
      "perLevel": 12.5
    },
    "mpRegenPenalty": null,
    "description": "Charge a massive arrow that tears through terrain and monsters alike until it leaves the map, dealing double damage to bosses. Tap for a third of the damage, full draw for all of it.",
    "unlock": "Range at level 33",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 700,
        "perLevel": 350
      },
      "range": {
        "base": 700,
        "perLevel": 350
      }
    },
    "damageTypes": [
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "seirei",
    "mapNodeId": "skill-71",
    "name": "Seirei",
    "short": "S",
    "icon": "assets/skill-icons/seirei.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 2.2,
    "duration": 0,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 2,
    "damageMultiplier": 2,
    "hitNote": "2 facas descritas.",
    "basePower": {
      "base": 25,
      "perLevel": 15
    },
    "mpRegenPenalty": null,
    "description": "Throw two spirit-charged knives that always trigger your element's effect on hit, no chance roll needed.",
    "unlock": "Range at level 22",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 36.72,
        "perLevel": 18.36
      },
      "magic": {
        "base": 36.72,
        "perLevel": 18.36
      },
      "range": {
        "base": 54,
        "perLevel": 27
      }
    },
    "damageTypes": [
      "faith",
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "shadow_step",
    "mapNodeId": "skill-49",
    "name": "Shadow Step",
    "short": "SS",
    "icon": "assets/skill-icons/shadow-step.png",
    "category": "utility",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 12,
    "duration": 2.5,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Turn invisible, evading every attack, with 38(+2/lv) Speed and 7.1(+0.375/lv) Jump while hidden. When you reappear, Ambush grants 6.48(+3.402/lv)% global damage. Multiplies with your other buff bonuses.",
    "unlock": "Range at level 12",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "shadow_twin",
    "mapNodeId": "skill-46",
    "name": "Shadow Twin",
    "short": "ST",
    "icon": "assets/skill-icons/shadow-twin.png",
    "category": "utility",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 4,
    "duration": 15,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Toggle. A shadow repeats every skill you cast for 7.2(+2.4/lv)% of your damage, and if a blow would kill you the twin dies in your place, leaving you at 1 HP.",
    "unlock": "Range at level 30",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "siphon",
    "mapNodeId": "skill-70",
    "name": "Siphon",
    "short": "S",
    "icon": "assets/skill-icons/siphon.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 3.2,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 60,
      "perLevel": 30
    },
    "mpRegenPenalty": null,
    "description": "Throw a siphoning knife that tears life and mana out of its target and returns them to you as drifting wisps, restoring 1.5(+1.5/lv) HP plus 5% of your max HP, and 0.5(+0.5/lv) MP plus 3% of your max MP.",
    "unlock": "Range at level 8",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 119.34,
        "perLevel": 59.67
      },
      "range": {
        "base": 162,
        "perLevel": 81
      }
    },
    "damageTypes": [
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "soul_shot",
    "mapNodeId": "skill-33",
    "name": "Soul Shot",
    "short": "SS",
    "icon": "assets/skill-icons/soul-shot.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "basic",
    "slotSource": "correção do jogo",
    "skillKind": "Basic Attack",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1.2,
    "duration": 0,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "hitNote": "1 projétil; perfurar até 2 alvos e o bônus de distância de até 1,3x não multiplicam o DPS-base.",
    "basePower": {
      "base": 16,
      "perLevel": 8.5
    },
    "mpRegenPenalty": null,
    "description": "Draw back and loose a heavy bolt that punches through up to two enemies, hitting harder the farther it flies, up to x1.3. Tap for a third of the damage, full draw for all of it.",
    "unlock": "Magic at level 5, Range (Skill #59) at level 5",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 8.5,
        "perLevel": 28
      },
      "range": {
        "base": 90,
        "perLevel": 45
      }
    },
    "damageTypes": [
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "triple_throw",
    "mapNodeId": "skill-18",
    "name": "Triple Throw",
    "short": "TT",
    "icon": "assets/skill-icons/triple-throw.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1.2,
    "duration": 0,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 3,
    "damageMultiplier": 3,
    "hitNote": "3 facas descritas.",
    "basePower": {
      "base": 13,
      "perLevel": 7
    },
    "mpRegenPenalty": null,
    "description": "Snap out three throwing knives in a tight fan, each landing as its own hit with its own crit and element roll.",
    "unlock": "Range at level 20",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 15,
        "perLevel": 11
      },
      "range": {
        "base": 35,
        "perLevel": 15.5
      }
    },
    "damageTypes": [
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "true_shot",
    "mapNodeId": "skill-43",
    "name": "True Shot",
    "short": "TS",
    "icon": "assets/skill-icons/true-shot.png",
    "category": "hybrid",
    "group": "range",
    "classes": [
      "range",
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 5,
    "duration": 15,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": true,
    "sustainedHitsPerSecond": 0,
    "hits": 2,
    "damageMultiplier": 4,
    "hitNote": "Impacto de 1x + detonação de 3x; pressupõe que a bomba seja preenchida.",
    "basePower": {
      "base": 8,
      "perLevel": 4
    },
    "mpRegenPenalty": null,
    "description": "Charge and release to mark the target with an exposed bomb that feeds on all damage it takes. When full it detonates for 300% of your hit, and if the target dies the blast jumps to the nearest monster. Tap for a third of the damage, full draw for all of it.",
    "unlock": "Magic at level 11, Range (Skill #59) at level 11",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 67.5,
        "perLevel": 34
      },
      "range": {
        "base": 116,
        "perLevel": 52
      }
    },
    "damageTypes": [
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "range"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "arcane_surge",
    "mapNodeId": "skill-54",
    "name": "Arcane Surge",
    "short": "AS",
    "icon": "assets/skill-icons/arcane-surge.png",
    "category": "hybrid",
    "group": "magic",
    "classes": [
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 7.5,
    "duration": 5.5,
    "attacksPerSecond": 2.5,
    "hits": 13.75,
    "damageMultiplier": 13.75,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "cadência × duração",
    "hitConfidence": "derived",
    "hitNote": "2.5/s × 5.5s = 13.75 ocorrências esperadas.",
    "basePower": {
      "base": 7,
      "perLevel": 4
    },
    "mpRegenPenalty": null,
    "description": "Roll a hunting ball of raw magic that rumbles forward, homing onto enemies and battering everything it touches every 0.4 seconds.",
    "unlock": "Magic at level 20",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 11.1078,
        "perLevel": 12
      },
      "magic": {
        "base": 55.628,
        "perLevel": 23
      }
    },
    "damageTypes": [
      "faith",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "blink",
    "mapNodeId": "skill-42",
    "name": "Blink",
    "short": "B",
    "icon": "assets/skill-icons/blink.png",
    "category": "magic",
    "group": "magic",
    "classes": [
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Teleport a short distance in the direction you hold, even straight up or down, phasing clean through walls.",
    "unlock": "Magic at level 9",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "blood_sacrifice",
    "mapNodeId": "skill-62",
    "name": "Blood Sacrifice",
    "short": "BS",
    "icon": "assets/skill-icons/blood-sacrifice.png",
    "category": "utility",
    "group": "magic",
    "classes": [
      "melee",
      "magic"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1.5,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 10,
      "perLevel": 4
    },
    "mpRegenPenalty": null,
    "description": "Toggle. Skill costs you cannot afford with MP are paid in HP instead, damage you take converts to MP, every MP cost you pay rebounds as Shield, and 30% of your max HP becomes max Shield. Your Melee and Magic damage rise 3.48(+1.08/lv)%, multiplying with your other buff bonuses. The 2 closest party members nearby also gain half of the MP you convert and half of the Shield rebound. Nearby party members also gain half of that Shield capacity.",
    "unlock": "Magic at level 12, Melee (Skill #58) at level 8",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "empower",
    "mapNodeId": "skill-63",
    "name": "Empower",
    "short": "E",
    "icon": "assets/skill-icons/empower.png",
    "category": "utility",
    "group": "magic",
    "classes": [
      "melee",
      "magic"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 4,
    "duration": 3,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Bind Empower to another skill to permanently boost it: x1.272(+0.039/lv) damage and 1.25x size.",
    "unlock": "Magic at level 25",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "familiar",
    "mapNodeId": "skill-103",
    "name": "Familiar",
    "short": "F",
    "icon": "assets/skill-icons/familiar.png",
    "category": "utility",
    "group": "magic",
    "classes": [
      "magic"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 11,
      "perLevel": 5
    },
    "mpRegenPenalty": {
      "base": 1,
      "perLevel": 0.15
    },
    "description": "Toggle. Summon up to two familiars (chosen when you activate the skill): Turtle grants Shield and Defense, Cat grants Speed and attack speed, Rabbit gathers nearby drops and finds more soul crystals, Bat bites enemies and steals their life and mana, Snake spits poison clouds. Familiars grow with the skill's level. Lowers your MP regen by 1(+0.15/lv) per tick.",
    "unlock": "Magic at level 26",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 105.36,
        "perLevel": 42
      }
    },
    "damageTypes": [
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "flame_barrage",
    "mapNodeId": "skill-19",
    "name": "Flame Barrage",
    "short": "FB",
    "icon": "assets/skill-icons/flame-barrage.png",
    "category": "hybrid",
    "group": "magic",
    "classes": [
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 6,
    "duration": 1.05,
    "attacksPerSecond": 7,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 7,
    "damageMultiplier": 7,
    "hitNote": "7 fireballs descritas; a descrição prevalece sobre 7/s × 1,05s.",
    "basePower": {
      "base": 13,
      "perLevel": 6.5
    },
    "mpRegenPenalty": null,
    "description": "Hold a jet of fire that spits out 7 fireballs while you steer the stream up and down. Each fireball hits as its own strike with heavy knockback.",
    "unlock": "Magic at level 15",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 10.098,
        "perLevel": 22.2058
      },
      "magic": {
        "base": 66.024,
        "perLevel": 33.512
      }
    },
    "damageTypes": [
      "faith",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "focused_mind",
    "mapNodeId": "skill-102",
    "name": "Focused Mind",
    "short": "FM",
    "icon": "assets/skill-icons/focused-mind.png",
    "category": "utility",
    "group": "magic",
    "classes": [
      "magic"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": {
      "base": 1,
      "perLevel": 0.15
    },
    "description": "Toggle. Sharpen your mind to a single edge: your highest damage stat rises 15(+2.368/lv)%, and your other damage stats fall 10(+1.05/lv)%. Nearby party members gain 4.8(+0.22/lv)% to their own highest damage stat. Lowers your MP regen by 1(+0.15/lv) per tick.",
    "unlock": "Magic at level 21",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "gravity_well",
    "mapNodeId": "skill-6",
    "name": "Gravity Well",
    "short": "GW",
    "icon": "assets/skill-icons/gravity-well.png",
    "category": "magic",
    "group": "magic",
    "classes": [
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 10.5,
    "duration": 5,
    "attacksPerSecond": 3,
    "hits": 15,
    "damageMultiplier": 15,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "cadência × duração",
    "hitConfidence": "derived",
    "hitNote": "3/s × 5s = 15 ocorrências esperadas.",
    "basePower": {
      "base": 7,
      "perLevel": 3.5
    },
    "mpRegenPenalty": null,
    "description": "Pin a gravity well onto the enemy you strike, dragging everything nearby toward its center and crushing whatever reaches the core 3 times a second. Bosses are too heavy to drag.",
    "unlock": "Magic at level 35",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 43.76,
        "perLevel": 21.6424
      }
    },
    "damageTypes": [
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "gust",
    "mapNodeId": "skill-51",
    "name": "Gust",
    "short": "G",
    "icon": "assets/skill-icons/gust.png",
    "category": "hybrid",
    "group": "magic",
    "classes": [
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 4.5,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 20,
      "perLevel": 10
    },
    "mpRegenPenalty": null,
    "description": "Blast a sheet of wind that shoves everything in front of you with the hardest knockback in the game. Perfect for clearing a lane or pushing a pack off a ledge.",
    "unlock": "Magic at level 4",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 90.098,
        "perLevel": 100
      },
      "magic": {
        "base": 300,
        "perLevel": 145
      }
    },
    "damageTypes": [
      "faith",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "magic",
    "mapNodeId": "skill-60",
    "name": "Magic",
    "short": "M",
    "icon": "assets/skill-icons/magic-passive.png",
    "category": "utility",
    "group": "magic",
    "classes": [
      "magic"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Proficiency (passive)",
    "sourceSkillKind": "Proficiency (passive)",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 0.001,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Your Magic proficiency. It levels on its own as you deal Magic damage, gates which Magic skills you can learn, and lifts your Magic damage as it grows. Caps at 99.",
    "unlock": "Character level 1",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "magic_burst",
    "mapNodeId": "skill-41",
    "name": "Magic Burst",
    "short": "MB",
    "icon": "assets/skill-icons/magic-burst.png",
    "category": "magic",
    "group": "magic",
    "classes": [
      "magic"
    ],
    "panelType": "basic",
    "slotSource": "skills.json",
    "skillKind": "Basic Attack",
    "sourceSkillKind": "Basic Attack",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 11,
      "perLevel": 5
    },
    "mpRegenPenalty": null,
    "description": "A basic attack: loose a cone of raw magic that detonates on its targets nearest-first, rolling outward through the group.",
    "unlock": "Magic at level 1",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 105.36,
        "perLevel": 42
      }
    },
    "damageTypes": [
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "mana_shield",
    "mapNodeId": "skill-28",
    "name": "Mana Shield",
    "short": "MS",
    "icon": "assets/skill-icons/mana-shield.png",
    "category": "utility",
    "group": "magic",
    "classes": [
      "faith",
      "magic"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0.400000005960464,
      "perLevel": 0.0500000007450581
    },
    "mpRegenPenalty": null,
    "description": "Toggle. Damage that would reach your HP is halved and billed to your MP instead. Also grants 6(+3.5/lv)(+0.25 per INT) Shield, 1.8(+0.3/lv) MP regen per tick, and 3.48(+1.08/lv)% Magic and Faith damage. The damage bonus multiplies with your other buff bonuses. Nearby party members gain the full Shield bonus while you have it on.",
    "unlock": "Magic at level 10",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "int": {
        "base": 1.188,
        "perLevel": 0.1188
      }
    },
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "soul_bomb",
    "mapNodeId": "skill-57",
    "name": "Soul Bomb",
    "short": "SB",
    "icon": "assets/skill-icons/soul-bomb.png",
    "category": "hybrid",
    "group": "magic",
    "classes": [
      "melee",
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 3,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 30,
      "perLevel": 15
    },
    "mpRegenPenalty": null,
    "description": "Lob a soul-charged orb that detonates when a monster comes near, catching everything in the blast. Throw it into a clump.",
    "unlock": "Magic at level 8",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 40,
        "perLevel": 65
      },
      "magic": {
        "base": 200,
        "perLevel": 100
      }
    },
    "damageTypes": [
      "faith",
      "magic"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "star_fall",
    "mapNodeId": "skill-53",
    "name": "Star Fall",
    "short": "SF",
    "icon": "assets/skill-icons/star-fall.png",
    "category": "hybrid",
    "group": "magic",
    "classes": [
      "magic"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 7.5,
    "duration": 5,
    "attacksPerSecond": 3,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 15,
    "damageMultiplier": 15,
    "hitNote": "15 estrelas descritas.",
    "basePower": {
      "base": 16,
      "perLevel": 8
    },
    "mpRegenPenalty": null,
    "description": "Hang a starfield over the nearest monster that rains 15 homing stars, each landing as its own strike.",
    "unlock": "Magic at level 30",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "magic": {
        "base": 60.16,
        "perLevel": 31.5
      },
      "range": {
        "base": 29.2842,
        "perLevel": 16.6421
      }
    },
    "damageTypes": [
      "magic",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "magic"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "armor_link",
    "mapNodeId": "skill-27",
    "name": "Armor Link",
    "short": "AL",
    "icon": "assets/skill-icons/armor-link.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 2,
    "duration": 600,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Pick a party member on your map: they take 35% less damage and you take that damage for them, rising to 45% at 100 CON, while half of every heal you receive flows to them too. The link never expires and follows them between maps, though it only works while you're together.",
    "unlock": "Faith at level 12",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "burst_shield",
    "mapNodeId": "skill-29",
    "name": "Burst Shield",
    "short": "BS",
    "icon": "assets/skill-icons/burst-shield.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 5,
    "duration": 2.5,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": true,
    "sustainedHitsPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 5,
    "hitNote": "1 reflexão de 5x; pressupõe que o escudo receba um golpe.",
    "basePower": {
      "base": 12,
      "perLevel": 6
    },
    "mpRegenPenalty": null,
    "description": "Shield yourself and nearby party members for a moment: the next hit is cut by 30(+2.5/lv)% and the damage prevented is hurled back at the attacker five-fold, splashing nearby monsters.",
    "unlock": "Faith at level 4",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 12.1743,
        "perLevel": 26.3
      },
      "faith": {
        "base": 100.2587,
        "perLevel": 32.75
      }
    },
    "damageTypes": [
      "melee",
      "faith"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "cross_strike",
    "mapNodeId": "skill-89",
    "name": "Cross Strike",
    "short": "CS",
    "icon": "assets/skill-icons/cross-strike.png",
    "category": "hybrid",
    "group": "faith",
    "classes": [
      "melee",
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 9,
    "duration": 1,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "hitNote": "1 impacto; bônus de 1,6x contra boss não incluído.",
    "basePower": {
      "base": 55,
      "perLevel": 26
    },
    "mpRegenPenalty": null,
    "description": "Slam a blazing cross into the ground, stunning everything it hits, bosses included, and dealing x1.6 damage to bosses. Your melee and faith attack speed multiply its damage instead of shortening its cooldown.",
    "unlock": "Faith at level 20, Melee (Skill #58) at level 25",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 300,
        "perLevel": 165
      },
      "faith": {
        "base": 300,
        "perLevel": 165
      }
    },
    "damageTypes": [
      "melee",
      "faith"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [
      "melee",
      "faith"
    ],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "dark_fire",
    "mapNodeId": "skill-82",
    "name": "Dark Fire",
    "short": "DF",
    "icon": "assets/skill-icons/dark-fire.png",
    "category": "hybrid",
    "group": "faith",
    "classes": [
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 5,
    "duration": 0,
    "attacksPerSecond": 2,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 2,
    "hits": 1,
    "damageMultiplier": 1,
    "hitNote": "Toggle contínuo: 2 ticks por segundo enquanto estiver ligado.",
    "basePower": {
      "base": 7.5,
      "perLevel": 3.5
    },
    "mpRegenPenalty": null,
    "description": "Wreathe yourself in dark flame that scorches the nearest enemies twice a second, gaining +3% damage per enemy in the circle (up to +15%). It burns 5% of your max HP and 7% of your max Shield every second, but can never kill you; while Undying is lit the health burn bleeds out over 4 seconds like any other hit. Stays lit until you use the skill again, which you can only do once its cooldown is ready; putting it out starts the cooldown too. While it is lit, your Shield does not recover on its own and your HP regen no longer speeds up while resting.",
    "unlock": "Faith at level 35",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 34,
        "perLevel": 21
      },
      "faith": {
        "base": 57,
        "perLevel": 28
      },
      "health": {
        "base": 0.2,
        "perLevel": 0.095
      }
    },
    "damageTypes": [
      "melee",
      "faith"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "dedication",
    "mapNodeId": "skill-106",
    "name": "Dedication",
    "short": "D",
    "icon": "assets/skill-icons/dedication.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Passive Stance",
    "sourceSkillKind": "Passive Stance",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Passive stance. Your devotion magnifies your care: everything you heal or shield is 25(+5/lv)% stronger.",
    "unlock": "Faith at level 29",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "divine_benevolence",
    "mapNodeId": "skill-105",
    "name": "Divine Benevolence",
    "short": "DB",
    "icon": "assets/skill-icons/divine-benevolence.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "melee",
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Passive Stance",
    "sourceSkillKind": "Passive Stance",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": {
      "base": 1,
      "perLevel": 0.15
    },
    "description": "Passive stance. Suffering becomes succor: when you take damage, party members within range are healed for 7(+0.95/lv)% of the blow before your defenses soften it. Lowers your MP regen by 1(+0.15/lv) per tick.",
    "unlock": "Faith at level 22, Melee (Skill #58) at level 22",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "divine_blessing",
    "mapNodeId": "skill-64",
    "name": "Divine Blessing",
    "short": "DB",
    "icon": "assets/skill-icons/divine-blessing.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "range"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 5,
    "duration": 60,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Bless yourself with 2.5(+1.75/lv)% EXP, 1.5(+1.5/lv)% Skill EXP and 2.369(+0.79/lv)% Faith damage. Nearby party members share the EXP and Skill EXP bonuses at half strength. The Faith damage multiplies with your other buff bonuses.",
    "unlock": "Faith at level 11",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "divine_protection",
    "mapNodeId": "skill-47",
    "name": "Divine Protection",
    "short": "DP",
    "icon": "assets/skill-icons/divine-protection.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "range"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 120,
    "duration": 20,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Ward yourself and nearby party members: the first killing blow each of you takes is cancelled, leaving 13.11(+5.24/lv)% of max HP instead.",
    "unlock": "Faith at level 25",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "health": {
        "base": 0.1311,
        "perLevel": 0.0524
      }
    },
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "divine_thorn",
    "mapNodeId": "skill-107",
    "name": "Divine Thorn",
    "short": "DT",
    "icon": "assets/skill-icons/divine-thorn.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "melee",
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Passive Stance",
    "sourceSkillKind": "Passive Stance",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 5,
      "perLevel": 3
    },
    "mpRegenPenalty": {
      "base": 1,
      "perLevel": 0.15
    },
    "description": "Passive stance. Thorns of light answer every wound: your attacker and up to 2 other nearby monsters take 50(+25/lv)% of the blow before your defenses soften it, plus 4(+2/lv)% of your max HP. The thorns can crit, carry your element, and answer even the blood price of your own dark flames. Lowers your MP regen by 1(+0.15/lv) per tick.",
    "unlock": "Faith at level 17, Melee (Skill #58) at level 17",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "health": {
        "base": 0.6,
        "perLevel": 0.3
      }
    },
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "elemental_charge",
    "mapNodeId": "skill-22",
    "name": "Elemental Charge",
    "short": "EC",
    "icon": "assets/skill-icons/elemental-charge.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": {
      "base": 2.88,
      "perLevel": 0.48
    },
    "description": "Toggle. Arms your weapon's element, adding 10(+3/lv)% Elemental Effect Chance, and every proc deals bonus elemental damage that grows with the hit. Lowers your MP regen by 2.88(+0.48/lv) per tick while active. Nearby party members gain half of the elemental chance while you have it on.",
    "unlock": "Faith at level 28",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "spr": {
        "base": 1.311,
        "perLevel": 0
      }
    },
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "faith",
    "mapNodeId": "skill-61",
    "name": "Faith",
    "short": "F",
    "icon": "assets/skill-icons/faith-passive.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Proficiency (passive)",
    "sourceSkillKind": "Proficiency (passive)",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 0.001,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Your Faith proficiency. It levels on its own as you deal Faith damage, gates which Faith skills you can learn, and lifts your Faith damage as it grows. Caps at 99.",
    "unlock": "Character level 1",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "life_line",
    "mapNodeId": "skill-109",
    "name": "Life Line",
    "short": "LL",
    "icon": "assets/skill-icons/life-line.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "faith",
      "range"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 5,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Bind your fate to a chosen party member: each of you gains 3(+0.63/lv)% of the other's damage stats and 5(+1.05/lv)% of their Defense and Max HP. If your partner would die, they are saved at 15% HP and you take half your Max HP instead, breaking the link. The bond cannot coexist with Armor Link.",
    "unlock": "Faith at level 25, Range (Skill #59) at level 25",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "medishot",
    "mapNodeId": "skill-30",
    "name": "Medishot",
    "short": "M",
    "icon": "assets/skill-icons/medishot.png",
    "category": "hybrid",
    "group": "faith",
    "classes": [
      "range",
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 7.5,
    "duration": 6,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 35,
      "perLevel": 17.5
    },
    "mpRegenPenalty": null,
    "description": "Fire a healing shot that seeks your most wounded party member, bursting into a heal for nearby allies, damage to nearby monsters, and a mending field that follows them, pulsing every second for 6 seconds. Each pulse heals 3(+1.5/lv), raised 5% for every 10% Elemental Effect Potency you have, so a full field is 18(+9/lv). The burst heals 1.4 times a pulse, or 2.5 times when it lands on you. Charge it for up to three times the healing.",
    "unlock": "Faith at level 16, Range (Skill #59) at level 12",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 160,
        "perLevel": 75
      },
      "range": {
        "base": 160,
        "perLevel": 75
      }
    },
    "damageTypes": [
      "faith",
      "range"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "nova",
    "mapNodeId": "skill-5",
    "name": "Nova",
    "short": "N",
    "icon": "assets/skill-icons/nova.png",
    "category": "faith",
    "group": "faith",
    "classes": [
      "faith"
    ],
    "panelType": "basic",
    "slotSource": "skills.json",
    "skillKind": "Basic Attack",
    "sourceSkillKind": "Basic Attack",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1.7,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 19,
      "perLevel": 9.5
    },
    "mpRegenPenalty": null,
    "description": "A basic attack: release a pulse of spirit that hits everything in a circle around you, even enemies at your back.",
    "unlock": "Faith at level 1",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "faith": {
        "base": 160,
        "perLevel": 80
      }
    },
    "damageTypes": [
      "faith"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "perseverance",
    "mapNodeId": "skill-90",
    "name": "Perseverance",
    "short": "P",
    "icon": "assets/skill-icons/perseverance.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "melee",
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 30,
    "duration": 12,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Swell with resolve: grow 1.5x in size, gain 8.6(+0.6/lv)% Max HP (healing for the gain) and 6(+1.1/lv) Defense, plus Melee and Faith damage that rises the healthier you are, up to 16.08(+1.68/lv)%. Multiplies with your other buff bonuses. Trains from the damage you deal while it is up. Nearby party members gain half the Max HP you gained and a quarter of your damage bonus.",
    "unlock": "Faith at level 28, Melee (Skill #58) at level 28",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "punishment",
    "mapNodeId": "skill-97",
    "name": "Punishment",
    "short": "P",
    "icon": "assets/skill-icons/punishment.png",
    "category": "hybrid",
    "group": "faith",
    "classes": [
      "melee",
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 3.5,
    "duration": 1.5,
    "attacksPerSecond": 0,
    "hitSource": "descrição",
    "hitConfidence": "wiki",
    "conditionalHits": false,
    "sustainedHitsPerSecond": 0,
    "hits": 3,
    "damageMultiplier": 3,
    "hitNote": "Impacto inicial + 2 erupções.",
    "basePower": {
      "base": 12,
      "perLevel": 6
    },
    "mpRegenPenalty": null,
    "description": "Drive your weapon into the ground, launching and stunning non-boss enemies, then erupt twice more at the impact point.",
    "unlock": "Faith at level 8, Melee (Skill #58) at level 8",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 50,
        "perLevel": 25
      },
      "faith": {
        "base": 50,
        "perLevel": 25
      }
    },
    "damageTypes": [
      "melee",
      "faith"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "revitalize",
    "mapNodeId": "skill-4",
    "name": "Revitalize",
    "short": "R",
    "icon": "assets/skill-icons/revitalize.png",
    "category": "hybrid",
    "group": "faith",
    "classes": [
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 4,
    "activeMax": 20,
    "cooldown": 8.5,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 50,
      "perLevel": 25
    },
    "mpRegenPenalty": null,
    "description": "Pulse a wave of restoring light, healing yourself and the most wounded nearby players for this skill's power plus 1.5% (+0.5%/lv) of your max HP and 2.4% (+0.8%/lv) of your max MP, while searing enemies caught in the pulse.",
    "unlock": "Faith at level 10",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "mana": {
        "base": 0.0241,
        "perLevel": 0.0121
      },
      "melee": {
        "base": 112.1743,
        "perLevel": 121.8257
      },
      "faith": {
        "base": 559.3605,
        "perLevel": 260.8165
      },
      "health": {
        "base": 0.0151,
        "perLevel": 0.0075
      }
    },
    "damageTypes": [
      "melee",
      "faith"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "shield_bash",
    "mapNodeId": "skill-87",
    "name": "Shield Bash",
    "short": "SB",
    "icon": "assets/skill-icons/shield-bash.png",
    "category": "hybrid",
    "group": "faith",
    "classes": [
      "melee",
      "faith"
    ],
    "panelType": "basic",
    "slotSource": "skills.json",
    "skillKind": "Basic Attack",
    "sourceSkillKind": "Basic Attack",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1.4,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 8,
      "perLevel": 4
    },
    "mpRegenPenalty": null,
    "description": "A basic attack: rock back, then lunge shield-first, bulldozing enemies out of your way into a pile. Bosses bounce you off instead.",
    "unlock": "Faith at level 5, Melee (Skill #58) at level 5",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 100,
        "perLevel": 50
      },
      "faith": {
        "base": 100,
        "perLevel": 50
      }
    },
    "damageTypes": [
      "melee",
      "faith"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "smite",
    "mapNodeId": "skill-52",
    "name": "Smite",
    "short": "S",
    "icon": "assets/skill-icons/smite.png",
    "category": "hybrid",
    "group": "faith",
    "classes": [
      "faith"
    ],
    "panelType": "additional",
    "slotSource": "skills.json",
    "skillKind": "Active",
    "sourceSkillKind": "Active",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 12,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 42,
      "perLevel": 21
    },
    "mpRegenPenalty": null,
    "description": "Call your wrath down on the nearest enemies, striking through walls and floors with no line of sight needed.",
    "unlock": "Faith at level 30",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {
      "melee": {
        "base": 235,
        "perLevel": 251.1343
      },
      "faith": {
        "base": 635,
        "perLevel": 441.1343
      }
    },
    "damageTypes": [
      "melee",
      "faith"
    ],
    "nonDamage": false,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  },
  {
    "id": "vanguard",
    "mapNodeId": "skill-88",
    "name": "Vanguard",
    "short": "V",
    "icon": "assets/skill-icons/vanguard.png",
    "category": "utility",
    "group": "faith",
    "classes": [
      "faith"
    ],
    "panelType": "buff",
    "slotSource": "skills.json",
    "skillKind": "Buff / Toggle",
    "sourceSkillKind": "Buff / Toggle",
    "activeLevel": 0,
    "activeMax": 20,
    "cooldown": 1,
    "duration": 0,
    "attacksPerSecond": 0,
    "hits": 1,
    "damageMultiplier": 1,
    "sustainedHitsPerSecond": 0,
    "conditionalHits": false,
    "hitSource": "padrão de 1 hit",
    "hitConfidence": "assumption",
    "hitNote": "A descrição não informa múltiplos acertos; considerado 1 hit.",
    "basePower": {
      "base": 0,
      "perLevel": 0
    },
    "mpRegenPenalty": null,
    "description": "Toggle. Project a protective bubble: party members inside take 21.25(+1.25/lv)% less damage (you absorb it for them), everything caught inside raises your Defense, and monsters in the bubble take x1.042(+1.55%/lv) damage from you. Trains from damage you deal to monsters inside the bubble, and from damage you absorb for allies.",
    "unlock": "Faith at level 8, Melee (Skill #58) at level 12",
    "sourceStatus": "skills.json · wiki.gg",
    "confidence": "wiki",
    "scalings": {},
    "damageTypes": [],
    "nonDamage": true,
    "cooldownSpeedCategories": [
      "faith"
    ],
    "cooldownSpeedConfidence": "wiki",
    "acceptsGlobalAttackSpeed": true,
    "damageSpeedCategories": [],
    "acceptsGlobalDamageSpeed": true
  }
]
};
