import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/vitame/app-viewport.js',import.meta.url),'utf8');
const ctx=vm.createContext({});
vm.runInContext(source.slice(0,source.indexOf('// The desktop host')),ctx);
const section=(screen,active,previous)=>ctx.portfolioSection(screen,active,previous);
for(const name of ['home','dose','analysis','guide','shop','my'])assert.equal(section(name,name),name);
assert.equal(section('guide','analysis'),'guide');
for(const name of ['intro','onboarding','setup-complete','health-interests','login'])assert.equal(section(name,'home'),'onboarding');
for(const [route,parent] of [['archive','dose'],['shop-eye-berry','shop'],['cart','shop'],['profile','my'],['interest-settings','my'],['nutrients','analysis']])assert.equal(section(route),parent);
assert.equal(section('supplement-register',undefined,'dose'),'dose');
const sections=vm.runInContext('portfolioSections',ctx);
const tokens=readFileSync(new URL('../public/vitame/design-system.css',import.meta.url),'utf8');
for(const value of Object.values(sections))if(value.color){
  assert.ok(tokens.includes(`--vitame-color-accent-${value.color}-main:`));
  assert.ok(tokens.includes(`--vitame-color-accent-${value.color}-light:`));
}
assert.match(source,/prefers-reduced-motion/);
assert.ok(!source.includes('document.body.style.backgroundColor'));
assert.match(source,/background:#ededf0/);
assert.match(source,/\.desktop-intro-copy h1\{color:var\(--vitame-color-neutral-black\)/);
assert.ok(!source.includes('portfolio-color-panel'));
assert.ok(!source.includes('--portfolio-accent'));
assert.ok(!source.includes('mask:url'));
console.log('Portfolio: neutral background, black title/original logo and section copy mapping passed.');
assert.match(source,/let section='onboarding',copyVersion=0/);
const update=source.slice(source.indexOf('    async function updatePortfolio(){'),source.indexOf('    const frame=document.createElement'));
const body={dataset:{screen:'intro'}};
const startup=vm.createContext({portfolioSection:ctx.portfolioSection,section:'onboarding',
  frame:{contentDocument:{body,querySelector:()=>null},contentWindow:{location:{hash:'#intro'}}},
  getComputedStyle(){assert.fail('Initial onboarding must not restart the copy animation');}});
vm.runInContext(update,startup);
await startup.updatePortfolio();
body.dataset.screen='onboarding';
await startup.updatePortfolio();
console.log('Portfolio startup: intro and onboarding keep the initial copy visible without replaying transitions.');
