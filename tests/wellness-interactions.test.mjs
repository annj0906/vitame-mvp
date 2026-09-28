import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const elements=new Map();
const context=vm.createContext({
  dateKey:(d=new Date(2026,8,28))=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
  analysis(){},nutrientPage(){},guide(){},render(){},route:()=> 'test',
  state:{interests:['눈 건강']},save(){},paths:{},icon:name=>`<svg data-icon="${name}"></svg>`,
  jellyArt:()=>'<div class="jelly-scene"><svg></svg><div></div></div>',esc:String,button:()=>'',note:()=>'',
  nutrients:[['비타민 A',35,'부족'],['오메가-3',112,'주의'],['칼슘',82,'적정']],products:[],
  window:{addEventListener(){}},document:{addEventListener(){},querySelector:s=>elements.get(s)},
  matchMedia:()=>({matches:true}),performance:{now:()=>0},cancelAnimationFrame(){},
});
vm.runInContext(fs.readFileSync(new URL('../public/vitame/analysis.js',import.meta.url),'utf8'),context);
const run=code=>vm.runInContext(code,context);
assert.equal(run("periodOffset('2024-02-29',1,'day')"),'2024-03-01');
assert.equal(run("periodOffset('2026-12-31',1,'month')"),'2027-01-01');
assert.equal(run("periodStart('2026-09-28','week')"),'2026-09-27');
assert.equal(run("periodOffset('2026-09-28',-1,'half')"),'2026-01-01');
assert.equal(run("periodOffset('2026-09-28',-1,'year')"),'2025-01-01');
assert.equal(run("periodScore('2026-09-29')"),null);
assert.match(run('nutritionCard(analysisGroups[0])'),/aria-expanded="false"/);
assert.match(run('nutritionCard(analysisGroups[0])'),/class="nutrition-panel-body" hidden/);
assert.equal((run('guideOrbit()').match(/data-guide-jump=/g)||[]).length,1);
assert.doesNotMatch(run('guideAvailable()'),/data-guide-add="eyes"/);
for(const selector of ['.guide-health-map','.guide-available','.guide-add-status'])elements.set(selector,{});
run("addGuide('energy');addGuide('energy')");
assert.equal(run("state.interests.filter(x=>x==='에너지').length"),1);
assert.equal((run('guideOrbit()').match(/data-guide-jump=/g)||[]).length,2);
assert.match(elements.get('.guide-add-status').textContent,/에너지/);
const section=run('refreshedGuideSection(wellnessGuides[0],0)');
assert.equal((section.match(/<details/g)||[]).length,4);
assert.doesNotMatch(section,/wellness-section-art|guide-back-top/);
assert.match(section,/주의로 표시된 예시/);
run("chartSelection='2026-09-28'");
assert.match(run('periodChart()'),/period-tooltip/);
assert.doesNotMatch(run('periodChart()'),/지난달|전월 대비/);
console.log('PASS: calendar boundaries, future periods, collapsed nutrients, interest additions, guide cards, selected-period tooltip');
