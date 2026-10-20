import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const testFiles = ['auth', 'records'].flatMap((name) =>
  readdirSync(new URL(`../examples/${name}/`, import.meta.url))
    .filter((file) => file.endsWith('.test.mjs'))
    .sort()
    .map((file) => `examples/${name}/${file}`),
);
for (const args of [
  ['--test', ...testFiles],
  ['scripts/check-docs.mjs'],
]) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('Portfolio verification passed.');
