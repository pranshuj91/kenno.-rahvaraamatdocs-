/**
 * serve-handler expects require('minimatch') to be callable.
 * minimatch >=9 exports a named { minimatch } function instead.
 */
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  'serve-handler',
  'src',
  'index.js'
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const source = fs.readFileSync(target, 'utf8');
const needle = "const minimatch = require('minimatch');";
const replacement =
  "const {minimatch} = require('minimatch');";

if (source.includes(needle)) {
  fs.writeFileSync(target, source.replace(needle, replacement), 'utf8');
  console.log('Patched serve-handler for minimatch v10+ API');
} else if (source.includes(replacement)) {
  console.log('serve-handler already patched for minimatch v10+ API');
} else {
  console.warn('serve-handler minimatch import not found; skipped patch');
}
