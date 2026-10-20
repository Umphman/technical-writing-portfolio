import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const failures = [];
let linkCount = 0;
let outputCount = 0;

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !['.git', 'node_modules', '.local'].includes(entry.name))
    .flatMap((entry) => {
      const full = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        failures.push(`Unexpected symbolic link: ${path.relative(root, full)}`);
        return [];
      }
      return entry.isDirectory() ? walk(full) : [full];
    });
}

function withoutFences(source) {
  return source.replace(/^```[^\n]*\r?\n[\s\S]*?^```\s*$/gm, '');
}

function anchors(source) {
  const found = new Map();
  return new Set([...withoutFences(source).matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => {
    const base = match[1].trim().toLowerCase().replace(/[`*]/g, '')
      .replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    const count = found.get(base) ?? 0;
    found.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  }));
}

const markdown = walk(root).filter((file) => file.endsWith('.md'));
for (const file of markdown) {
  const relative = path.relative(root, file);
  const source = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const prose = withoutFences(source);
  const fail = (message) => failures.push(`${relative}: ${message}`);
  if ((source.match(/^```/gm) ?? []).length % 2) fail('Unbalanced fenced code blocks');
  if ((prose.match(/^# /gm) ?? []).length !== 1) fail('Expected one document title');
  if (/[ \t]+$/m.test(source)) fail('Trailing whitespace');
  if (/\b(?:TODO|TBD|FIXME)\b/.test(source)) fail('Unresolved editing placeholder');
  if (/\]\((?:[A-Za-z]:[/\\]|file:)/.test(source)) fail('Machine-local link');

  for (const match of source.matchAll(/\bnpm run (?:--silent )?([a-z][\w:-]*)/g)) {
    // The OTel tutorial explicitly runs in the separate, patched public project.
    if (relative.replaceAll('\\', '/') === 'otel/README.md'
      && ['verify:signals', 'verify:context', 'verify:pipeline'].includes(match[1])) continue;
    if (!Object.hasOwn(pkg.scripts, match[1])) fail(`Unknown npm script: ${match[1]}`);
  }

  for (const match of prose.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = match[1];
    if (/^https:\/\//.test(target)) continue;
    if (/^[a-z]+:/i.test(target)) { fail(`Unsupported link scheme: ${target}`); continue; }
    const [rawPath, rawAnchor] = target.split('#');
    let linkPath;
    try { linkPath = decodeURIComponent(rawPath); }
    catch { fail(`Malformed link encoding: ${target}`); continue; }
    const resolved = linkPath ? path.resolve(path.dirname(file), linkPath) : file;
    const fromRoot = path.relative(root, resolved);
    if (fromRoot.startsWith('..') || path.isAbsolute(fromRoot)) {
      fail(`Link leaves the portfolio: ${target}`);
      continue;
    }
    linkCount++;
    if (!existsSync(resolved)) { fail(`Missing link target: ${target}`); continue; }
    if (rawAnchor && statSync(resolved).isFile() && resolved.endsWith('.md')) {
      if (!anchors(readFileSync(resolved, 'utf8')).has(decodeURIComponent(rawAnchor))) {
        fail(`Missing heading anchor: ${target}`);
      }
    }
  }
}

const demos = [
  ['demo:auth', 'samples/demo-dashboard-authentication.md', ['examples/auth/demo.mjs'], 0],
  ['demo:records', 'samples/troubleshooting-missing-records.md', ['examples/records/demo.mjs'], 0],
  ['check:records:before', 'samples/troubleshooting-missing-records.md', ['examples/records/check.mjs', '--mode=before'], 1],
  ['check:records:after', 'samples/troubleshooting-missing-records.md', ['examples/records/check.mjs', '--mode=after'], 0],
];
for (const [name, doc, args, expectedExit] of demos) {
  const source = readFileSync(path.join(root, doc), 'utf8').replace(/\r\n/g, '\n');
  const marker = `<!-- verified-output: ${name} -->`;
  const section = source.split(marker);
  if (section.length !== 2) {
    failures.push(`${doc}: Expected one ${marker}`);
    continue;
  }
  const block = section[1].match(/^\s*```text\n([\s\S]*?)\n```/);
  if (!block) { failures.push(`${doc}: Missing expected-output text block`); continue; }
  const result = spawnSync(process.execPath, args, {
    cwd: root, encoding: 'utf8', timeout: 15_000,
  });
  try {
    assert.ifError(result.error);
    assert.equal(result.status, expectedExit, `Expected exit ${expectedExit}. ${result.stderr}`);
    assert.equal(result.stdout.replace(/\r\n/g, '\n').trimEnd(), block[1].trimEnd());
    assert.equal(result.stderr, '');
    outputCount++;
  } catch (error) {
    failures.push(`${doc}: Demo output differs from the documented result: ${error.message}`);
  }
}
if (failures.length) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}
console.log(`Documentation checks passed: ${markdown.length} documents, ${linkCount} local links, ${outputCount} executable output comparisons.`);
