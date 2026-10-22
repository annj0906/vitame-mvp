import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../public/vitame/intro.html',import.meta.url),'utf8');
const symbolCSS=source.slice(source.indexOf('#symbol {'),source.indexOf('}',source.indexOf('#symbol {')));
assert.match(symbolCSS,/transform: translateX\(-65vw\) rotate\(-540deg\)/);
const reset=source.slice(source.indexOf('function reset()'),source.indexOf('async function openCapsule()'));
assert.match(reset,/symbol.style.transform = "translateX\(-65vw\) rotate\(-540deg\)"/);
assert.match(source,/symbol.style.transform = 'translateX\(-24px\)'/,'static header logo remains visible');
console.log('Intro: pre-script and reset positions match the entrance frame; static logo override preserved.');
