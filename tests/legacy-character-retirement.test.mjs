import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=name=>readFileSync(new URL('../public/vitame/'+name,import.meta.url),'utf8');
const app=read('app.js'),welcome=read('welcome.js'),analysis=read('analysis.js');
const ctx=vm.createContext({});
vm.runInContext(app.slice(app.indexOf('const character='),app.indexOf('const products=')),ctx);
assert.equal(vm.runInContext('character()',ctx),'');
assert.equal(vm.runInContext('character(true)',ctx),'');
vm.runInContext(welcome.slice(welcome.indexOf('function jellyArt('),welcome.indexOf('const onboardingBeforeJelly=')),ctx);
assert.equal(ctx.jellyArt(0),'','no prototype flash before approved assets load');
ctx.initialCharacter=key=>`<span data-character-key="${key}"></span>`;
vm.runInContext(analysis.slice(analysis.indexOf('function wellnessArt('),analysis.indexOf('function analysisTabs(')),ctx);
for(let i=0;i<5;i++){
  assert.match(ctx.jellyArt(i),/data-character-key=/);
  assert.match(ctx.wellnessArt(i),/data-character-key=/);
  assert.doesNotMatch(ctx.jellyArt(i)+ctx.wellnessArt(i),/jelly-body|<svg|blob/);
}
assert.doesNotMatch(welcome,/jelly-gradient|jelly-grain|jelly-clip/);
console.log('Legacy mascot retired; all fallback character renderers use approved five-character assets.');
