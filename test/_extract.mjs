/* Extracts the pure-logic <script id="arrow-lib"> block from index.html
 * and evaluates it under Node so tests can exercise the exact shipped code. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const htmlPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const m = html.match(/<script id="arrow-lib">([\s\S]*?)<\/script>/);
if (!m) throw new Error('index.html must contain <script id="arrow-lib"> block');
const mod = { exports: {} };
new Function('module', m[1])(mod);
export const lib = mod.exports;
