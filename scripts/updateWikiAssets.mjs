import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const sourcePath = process.argv[2] ? path.resolve(ROOT, process.argv[2]) : null;
const sourceUrl = 'https://r.jina.ai/http://soulsremnant.wiki.gg/wiki/Map:Combat_Skill_Tree?action=raw';
const iconDir = path.join(ROOT, 'assets', 'skill-icons');
const treeDir = path.join(ROOT, 'assets', 'tree');
const mapOutput = path.join(ROOT, 'tree-map-data.js');
const assetBase = 'https://soulsremnant.wiki.gg/images/';

function slug(value) {
  return value
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\(skill\)/g, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function wikiUrl(filename) {
  return new URL(filename.replaceAll(' ', '_'), assetBase).href;
}

async function download(filename, destination) {
  const response = await fetch(wikiUrl(filename), {
    headers: { 'User-Agent': 'SoulRemnantBuildPlanner/1.0 (offline asset sync)', Connection: 'close' },
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`${response.status} ${filename}`);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) throw new Error(`Resposta não é imagem: ${filename}`);
  await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function loadMapSource() {
  if (sourcePath) return fs.readFile(sourcePath, 'utf8');
  const response = await fetch(sourceUrl, {
    headers: { 'User-Agent': 'SoulRemnantBuildPlanner/1.0 (offline asset sync)' },
    signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`Não foi possível obter o mapa: HTTP ${response.status}`);
  return response.text();
}

const raw = await loadMapSource();
const map = JSON.parse(raw.slice(raw.indexOf('{')));
await fs.writeFile(path.join(ROOT, 'skills.json'), `${JSON.stringify(map, null, '\t')}\n`, 'utf8');
const skillContext = { window: {} };
vm.runInNewContext(await fs.readFile(path.join(ROOT, 'skill-data.js'), 'utf8'), skillContext);
const skills = skillContext.window.SKILL_PLANNER_DATA.skills;
const skillBySlug = new Map(skills.map(skill => [slug(skill.name), skill]));
const markers = Object.entries(map.markers).flatMap(([group, entries]) => entries.map(marker => ({ ...marker, group })));
const markerBySlug = new Map(markers.map(marker => [slug(marker.name), marker]));

await fs.mkdir(iconDir, { recursive: true });
await fs.mkdir(treeDir, { recursive: true });

const iconTasks = new Map();
for (const marker of markers) {
  const localName = `${slug(marker.icon.replace(/\.png$/i, ''))}.png`;
  iconTasks.set(marker.icon, path.join(iconDir, localName));
}

const specialFiles = { smite: 'Smite_(Skill).png' };
const skillIcons = {};
for (const skill of skills) {
  const marker = markerBySlug.get(slug(skill.name));
  const filename = marker?.icon || specialFiles[skill.id] || `${skill.name}.png`;
  const localName = `${slug(filename.replace(/\.png$/i, ''))}.png`;
  iconTasks.set(filename, path.join(iconDir, localName));
  skillIcons[skill.id] = `assets/skill-icons/${localName}`;
}

const failures = [];
const entries = [...iconTasks.entries()];
let cursor = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (cursor < entries.length) {
    const [filename, destination] = entries[cursor++];
    try {
      await download(filename, destination);
      process.stdout.write(`✓ ${filename}\n`);
    } catch (error) {
      failures.push({ filename, error: error.message });
      process.stderr.write(`✗ ${filename}: ${error.message}\n`);
    }
  }
}));

await download(map.background.image, path.join(treeDir, map.background.image));

const width = map.crs.bottomRight[0];
const height = map.crs.bottomRight[1];
const nodes = markers.map(marker => {
  const matchedSkill = skillBySlug.get(slug(marker.name));
  return {
    id: marker.id,
    name: marker.name,
    group: marker.group,
    x: Number((marker.x / width * 100).toFixed(4)),
    y: Number((marker.y / height * 100).toFixed(4)),
    icon: `assets/skill-icons/${slug(marker.icon.replace(/\.png$/i, ''))}.png`,
    skillId: matchedSkill?.id || null
  };
});

const output = {
  source: 'https://soulsremnant.wiki.gg/wiki/Map:Combat_Skill_Tree',
  syncedAt: new Date().toISOString(),
  width,
  height,
  background: `assets/tree/${map.background.image}`,
  groups: map.groups,
  skillIcons,
  nodes
};

await fs.writeFile(mapOutput, `window.SKILL_TREE_MAP = ${JSON.stringify(output, null, 2)};\n`, 'utf8');
console.log(`\n${nodes.length} nós, ${iconTasks.size - failures.length} ícones baixados.`);
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
