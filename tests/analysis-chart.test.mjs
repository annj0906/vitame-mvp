import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
const file='public/vitame/analysis.js';
const source=fs.readFileSync(file,'utf8');
const previous=execFileSync('git',['show',`HEAD:${file}`],{encoding:'utf8'});
const calculations=s=>s.slice(s.indexOf('function periodStart('),s.indexOf('function periodChart(')).replaceAll('\r\n','\n');
const scoreCalculation=s=>s.slice(s.indexOf('function periodScore('),s.indexOf('function periodChart(')).replaceAll('\r\n','\n');
assert.equal(scoreCalculation(source),scoreCalculation(previous),'score calculation unchanged');
const dateKey=(d=new Date('2026-10-13T12:00:00'))=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const ctx=vm.createContext({dateKey});
vm.runInContext("const chartPeriods=[['day','1일'],['week','1주'],['month','1개월'],['half','6개월'],['year','1년']];let chartPeriod='week',chartAnchor=dateKey(),chartSelection=null;"+source.slice(source.indexOf('function chartUnit('),source.indexOf('analysis=function(){',source.indexOf('function periodStart('))),ctx);
const run=s=>vm.runInContext(s,ctx);
for(const period of ['week','month','half','year']){
  run(`chartPeriod='${period}';chartSelection=null;`);
  const html=run('periodChart()');
  assert.equal((html.match(/data-period-bar=/g)||[]).length,7);
  assert.equal((html.match(/ disabled/g)||[]).length,3);
  run('chartSelection=periodOffset(chartAnchor,-1)');
  const selected=run('periodChart()');
  assert.equal((selected.match(/class="month-bar current/g)||[]).length,1);
  assert.match(selected,/period-tooltip/);
  assert.ok(selected.includes(`${run('periodScore(chartSelection)')}<span>점</span>`));
  assert.ok(selected.includes(`--reference-top:${150*(1-run('periodScore(chartSelection)')/100)}px`));
  assert.doesNotMatch(selected,/연속 복용|\+6%/);
}
run("chartPeriod='week'");assert.equal(run("periodOffset('2026-10-13',1)"),'2026-10-14');
assert.equal(run("periodLabel('2026-10-14',true)"),'수');
run("chartPeriod='month'");assert.equal(run("periodOffset('2026-12-01',1)"),'2026-12-06');
run("chartPeriod='half'");assert.equal(run("periodOffset('2026-12-01',1)"),'2027-01-01');
assert.equal(run("periodScore('2027-01-01')"),null);
assert.notEqual(run('analysisScoreMessage(59)'),run('analysisScoreMessage(80)'));
assert.match(source,/chartPeriods\.filter\(\(\[id\]\)=>id!=='day'\)/);
assert.ok(source.includes("selector:'.period-chart .month-bars'"),'only bars enter the swipe wrapper');
console.log('Analysis chart: unchanged calculations, four periods, future dates, selection, tooltip data and score messages passed.');
let queuedFrame,barAnimations=0;
const number={textContent:'',isConnected:true,setAttribute(){}};
const heading={innerHTML:'',setAttribute(){},querySelector(){return number;}};
const label={textContent:''},description={innerHTML:''};
Object.assign(ctx,{
  cancelAnimationFrame(){queuedFrame=null;},
  requestAnimationFrame(callback){queuedFrame=callback;return 1;},
  performance:{now:()=>0},matchMedia:()=>({matches:false}),
  document:{
    querySelector:selector=>({'.analysis-month-score':heading,'.analysis-score-label':label,'.analysis-month-description':description}[selector]),
    querySelectorAll:()=>[{animate(){barAnimations++;}}]
  }
});
run("chartPeriod='half';chartSelection='2026-06-01';updateAnalysisScore(true)");
assert.equal(label.textContent,'2026년 6월');
assert.equal(number.textContent,'0');
queuedFrame(650);
assert.equal(number.textContent,String(run('periodScore(chartSelection)')));
assert.equal(barAnimations,1);
run("chartSelection='2026-07-01';updateAnalysisScore()");
assert.equal(label.textContent,'2026년 7월');
queuedFrame(650);
assert.equal(number.textContent,String(run('periodScore(chartSelection)')));
assert.equal(barAnimations,1,'selection does not replay bar entrance');
run('updateAnalysisScore()');
assert.equal(queuedFrame,null,'same selection does not replay score animation');
assert.match(fs.readFileSync('public/vitame/care.css','utf8'),/\.period-reference-line\{position:absolute;z-index:2;/);
console.log('Score/date selection sync, count-up completion, entrance-only bars and reference stacking passed (mock DOM).');
