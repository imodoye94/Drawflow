#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceDir = path.join(root, 'src');

const allowedExistingAssignments = new Set([
  'number = parseInt(id)+1;',
  'numberPointPosition = 0;',
  'precanvasWitdhZoom = precanvasWitdhZoom || 0;',
  'precanvasHeightZoom = precanvasHeightZoom || 0;',
  'exist = true;',
  'position_add_array_point = search_point;',
  'target = target[keys[index]];',
  'nodeUpdates =  new Set(nodeUpdates.map(e => JSON.stringify(e)));',
  'nodeUpdates = Array.from(nodeUpdates).map(e => JSON.parse(e));',
  'nameModule = moduleName;'
]);

const bareAssignment = /^\s*([A-Za-z_$][\w$]*)\s*=\s*/;
const offenders = [];

for (const file of fs.readdirSync(sourceDir)) {
  if (!file.endsWith('.js')) continue;
  const relative = path.join('src', file);
  const lines = fs.readFileSync(path.join(sourceDir, file), 'utf8').split(/\r?\n/);

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) return;
    if (!bareAssignment.test(line)) return;
    if (trimmed.startsWith('const ') || trimmed.startsWith('let ') || trimmed.startsWith('var ')) return;
    if (allowedExistingAssignments.has(trimmed)) return;
    offenders.push(`${relative}:${i + 1} -> ${trimmed}`);
  });
}

if (offenders.length) {
  console.error('New undeclared assignment(s) detected. Use const/let/var instead:');
  offenders.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log('Undeclared assignment check passed.');
