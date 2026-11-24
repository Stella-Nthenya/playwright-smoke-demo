// Guards against false passes: the demo's deliberately broken account must turn the suite red.
import { spawnSync } from 'node:child_process';
const r = spawnSync('npx', ['playwright', 'test', 'tests/shop.spec.ts', '--project=chromium', '--reporter=json'],
  { env: { ...process.env, SHOPPER: 'problem_user' }, encoding: 'utf8', maxBuffer: 1 << 26 });
const { stats, suites, errors } = JSON.parse(r.stdout);
if (errors?.length) { console.error(errors); process.exit(2); }
for (const s of suites) for (const t of s.specs) console.log(t.ok ? 'pass' : 'FAIL', t.title);
console.log(`\n${stats.unexpected} test(s) caught the broken build; ${stats.expected} passed.`);
process.exit(stats.unexpected > 0 ? 0 : 1);
