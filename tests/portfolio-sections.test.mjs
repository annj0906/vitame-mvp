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
assert.match(source,/\.desktop-intro-copy h1\{color:var\(--portfolio-accent/);
assert.ok(!source.includes('portfolio-color-panel'));
assert.match(source,/desktop-intro-logo\{height:52px;background:var\(--portfolio-accent\)/);
assert.match(source,/info.color\?`var\(--vitame-color-accent-\$\{info.color\}-main\)`/);
console.log('Portfolio: fixed neutral background, matching title/logo accents including analysis, neutral onboarding passed.');
