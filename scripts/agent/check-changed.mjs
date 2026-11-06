// Vérifications statiques limitées à ce que l'agent a modifié, par rapport à
// la branche de base, pour les deux apps fédérées (storefront, adminpanel).
// Le dépôt n'est pas encore propre (≈27 erreurs ESLint dans storefront, ≈29
// dans adminpanel) : on ne bloque que sur les erreurs situées dans les lignes
// ajoutées ou modifiées (un fichier nouveau compte en entier).
//
//   - ESLint, avec la config de chaque app (ESLint 8 « eslintrc » pour
//     storefront, ESLint 9 « flat config » pour adminpanel) ;
//   - contrat de fédération (toujours vérifié, en entier) : chaque import
//     `storefrontApp/<Module>` de l'admin doit correspondre à une entrée de
//     `exposes` dans storefront/vite.config.js, le fichier exposé doit exister
//     et exporter ce que l'admin importe (export par défaut ou nommé).
//
// Avertissements (non bloquants) : fichiers modifiés hors des deux apps
// (blog/, racine…), package.json ou lockfile modifiés, `exposes` modifié
// (ordre de déploiement : storefront d'abord).
//
// Usage : node scripts/agent/check-changed.mjs [--check|--fix]   (défaut : --check)
// Env   : BASE_REF (défaut : origin/main)

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const mode = process.argv[2] ?? '--check';
const base = process.env.BASE_REF || 'origin/main';
const fix = mode === '--fix';
const APPS = ['storefront', 'adminpanel'];
const CODE = /\.(jsx?|mjs|cjs)$/;
const root = process.cwd();

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 << 20 });

const tracked = git('diff', '--name-only', '--diff-filter=ACMR', base, '--').split('\n');
const untracked = git('ls-files', '--others', '--exclude-standard').split('\n');
const changed = [...new Set([...tracked, ...untracked])].filter(Boolean).sort();

// Lignes modifiées par fichier ; `true` = fichier entier (nouveau ou non suivi).
function changedLines(file) {
  if (untracked.includes(file)) return true;
  let diff;
  try {
    diff = git('diff', '-U0', base, '--', file);
  } catch {
    return true;
  }
  if (/^new file mode/m.test(diff)) return true;
  const ranges = [];
  for (const m of diff.matchAll(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(m[1]);
    const count = m[2] === undefined ? 1 : Number(m[2]);
    if (count > 0) ranges.push([start, start + count - 1]);
  }
  return ranges;
}
const touches = (ranges, line) =>
  ranges === true || (Array.isArray(ranges) && ranges.some(([a, b]) => line >= a && line <= b));

let failed = false;
const warnings = [];

// — Avertissements de périmètre
for (const f of changed) {
  if (/(^|\/)(package\.json|pnpm-lock\.yaml|package-lock\.json)$/.test(f)) {
    warnings.push(`${f} modifié : pas de dépendance sans que la spec le demande.`);
  } else if (f.startsWith('blog/')) {
    warnings.push(`${f} : blog/ est hors du périmètre de l'agent (ni lint ni tests ici).`);
  } else if (f.startsWith('.github/')) {
    warnings.push(`${f} : .github/ ne doit pas être modifié (annulé avant le commit).`);
  }
}

// — ESLint, app par app, sur les lignes modifiées
for (const app of APPS) {
  const files = changed.filter((f) => f.startsWith(`${app}/`) && CODE.test(f) && existsSync(f));
  console.log(`\n— ESLint ${app} (lignes modifiées)`);
  if (!files.length) {
    console.log('Aucun fichier modifié.');
    continue;
  }
  for (const f of files) console.log(`  ${f}${changedLines(f) === true ? ' (nouveau)' : ''}`);
  const rel = files.map((f) => relative(app, f));
  const r = spawnSync('npx', ['eslint', '--format', 'json', ...(fix ? ['--fix'] : []), ...rel], {
    cwd: join(root, app),
    encoding: 'utf8',
    maxBuffer: 64 << 20,
  });
  let errors = 0;
  let ignored = 0;
  try {
    for (const res of JSON.parse(r.stdout)) {
      const file = relative(root, res.filePath);
      const ranges = changedLines(file);
      for (const msg of res.messages) {
        if (msg.severity < 2) continue;
        if (msg.line === undefined || touches(ranges, msg.line)) {
          errors++;
          console.log(`${file}:${msg.line ?? 0}:${msg.column ?? 0}  ${msg.message}  (${msg.ruleId ?? 'eslint'})`);
        } else {
          ignored++;
        }
      }
    }
  } catch {
    console.log(r.stdout, r.stderr);
    errors++;
  }
  if (errors) failed = true;
  console.log(
    errors ? `${errors} erreur(s)` : 'OK',
    ignored ? `(${ignored} erreur(s) préexistante(s) hors des lignes modifiées, ignorées)` : '',
  );
}

// — Contrat de fédération storefront → adminpanel
console.log('\n— Contrat de fédération (storefrontApp/*)');
const viteConfig = readFileSync('storefront/vite.config.js', 'utf8');
const exposesBlock = viteConfig.match(/exposes\s*:\s*\{([\s\S]*?)\}/)?.[1] ?? '';
const exposes = new Map(
  [...exposesBlock.matchAll(/['"]\.\/([\w-]+)['"]\s*:\s*['"]\.\/([^'"]+)['"]/g)].map((m) => [m[1], m[2]]),
);
if (!exposes.size) {
  console.log('Bloc `exposes` introuvable dans storefront/vite.config.js');
  failed = true;
}

function resolveExposed(path) {
  const candidates = ['', '.js', '.jsx', '/index.js', '/index.jsx'].map((ext) => join('storefront', path + ext));
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : CODE.test(d.name) ? [join(dir, d.name)] : [],
  );
}

let contractErrors = 0;
const sources = new Map();
for (const file of walk('adminpanel/src')) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/import\s+([^;'"]*?)\s+from\s+['"]storefrontApp\/([\w-]+)['"]/g)) {
    const [, clause, mod] = m;
    const line = text.slice(0, m.index).split('\n').length;
    const where = `${file}:${line}`;
    if (!exposes.has(mod)) {
      contractErrors++;
      console.log(`${where}  storefrontApp/${mod} n'est pas dans \`exposes\` (storefront/vite.config.js)`);
      continue;
    }
    const target = resolveExposed(exposes.get(mod));
    if (!target) {
      contractErrors++;
      console.log(`${where}  ./${exposes.get(mod)} (exposé sous ./${mod}) introuvable dans storefront/`);
      continue;
    }
    if (!sources.has(target)) sources.set(target, readFileSync(target, 'utf8'));
    const src = sources.get(target);
    if (/export\s+\*\s+from/.test(src)) continue; // ré-exports : non vérifiable simplement
    const defaultName = clause.match(/^\s*([A-Za-z_$][\w$]*)/)?.[1];
    if (defaultName && !/export\s+default\b|export\s*\{[^}]*\bas\s+default\b/.test(src)) {
      contractErrors++;
      console.log(`${where}  import par défaut de storefrontApp/${mod}, mais ${target} n'a pas d'export par défaut`);
    }
    const named = clause.match(/\{([^}]*)\}/)?.[1];
    for (const spec of named ? named.split(',') : []) {
      const name = spec.trim().split(/\s+as\s+/)[0];
      if (!name) continue;
      const declared = new RegExp(`export\\s+(?:async\\s+)?(?:const|let|var|function\\*?|class)\\s+${name}\\b`);
      const listed = [...src.matchAll(/export\s*\{([^}]*)\}/g)].some((e) =>
        e[1].split(',').some((s) => s.trim().split(/\s+as\s+/).pop() === name),
      );
      if (!declared.test(src) && !listed) {
        contractErrors++;
        console.log(`${where}  \`${name}\` importé depuis storefrontApp/${mod}, mais non exporté par ${target}`);
      }
    }
  }
}
if (contractErrors) failed = true;
console.log(contractErrors ? `${contractErrors} erreur(s)` : `OK (${exposes.size} modules exposés)`);

if (changed.includes('storefront/vite.config.js')) {
  let before = '';
  try {
    before = git('show', `${base}:storefront/vite.config.js`).match(/exposes\s*:\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  } catch {}
  if (before.replace(/\s/g, '') !== exposesBlock.replace(/\s/g, '')) {
    warnings.push(
      '`exposes` du storefront modifié : à déployer avant l\'admin (le remote de prod est chargé à chaud).',
    );
  }
}

if (warnings.length) {
  console.log('\n— Avertissements');
  for (const w of warnings) console.log(`⚠️  ${w}`);
}
process.exit(failed ? 1 : 0);
