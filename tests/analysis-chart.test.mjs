import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const file='public/vitame/analysis.js';
const source=fs.readFileSync(file,'utf8');
const dateKey=(d=new Date('2026-10-13T12:00:00'))=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const ctx=vm.createContext({dateKey});
vm.runInContext("const chartPeriods=[['day','1일'],['week','1주'],['month','1개월'],['half','6개월'],['year','1년']];let chartPeriod='week',chartAnchor=dateKey(),chartSelection=null;"+source.slice(source.indexOf('function chartUnit('),source.indexOf('analysis=function(){',source.indexOf('function periodStart('))),ctx);
const run=s=>vm.runInContext(s,ctx);
run("chartPeriod='week'");
const daily=Array.from({length:14},(_,i)=>run(`periodScore('2026-09-${String(i+1).padStart(2,'0')}')`));
assert.ok(daily.every(score=>score>=10&&score<=96));
assert.ok(Math.max(...daily)-Math.min(...daily)>50,'weekly example scores have visible variation');
assert.equal(run("periodScore('2026-09-01')"),daily[0],'example dates remain stable');
for(const kind of ['month','half','year']){
  run(`chartPeriod='${kind}'`);
  let hash=0;for(const c of kind+'2025-01-01')hash=(hash*31+c.charCodeAt(0))>>>0;
  assert.equal(run("periodScore('2025-01-01')"),57+hash%29);
}
for(const period of ['week','month','half','year']){
  run(`chartPeriod='${period}';chartSelection=null;`);
  const html=run('periodChart()');
  assert.equal((html.match(/data-period-bar=/g)||[]).length,7);
  assert.equal((html.match(/<button class="month-bar[^>]* disabled/g)||[]).length,period==='week'?4:3);
  assert.doesNotMatch(html,/data-period-step=/);
  assert.doesNotMatch(html,/period-tooltip/,'tooltip appears only after selection');
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
assert.equal(run("periodLabel('2026-06-07',true)"),'6월 1주');
assert.equal(run("periodLabel('2026-06-14')"),'6월 2주');
assert.equal(run("analysisScoreDate('2026-10-11')"),'10월 2주');
assert.equal(run("periodLabel('2026-09-27',true)"),'9월 4주');
assert.equal(run("periodLabel('2026-10-04',true)"),'10월 1주');
run("chartPeriod='half'");assert.equal(run("periodOffset('2026-12-01',1)"),'2027-01-01');
assert.equal(run("periodScore('2027-01-01')"),null);
assert.notEqual(run('analysisScoreMessage(59)'),run('analysisScoreMessage(80)'));
const messages=Array.from({length:10},(_,i)=>run(`analysisScoreMessage(${i*10})`));
assert.equal(new Set(messages).size,10,'each ten-point band has its own message');
assert.equal(run('analysisScoreMessage(69)'),run('analysisScoreMessage(60)'));
assert.equal(run('analysisScoreMessage(100)'),run('analysisScoreMessage(90)'));
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
run('updateAnalysisScore.animateNext=true;updateAnalysisScore()');
assert.equal(barAnimations,2,'period navigation replays bar fill');
run('updateAnalysisScore()');
assert.equal(barAnimations,2,'navigation replay flag is consumed once');
assert.match(fs.readFileSync('public/vitame/care.css','utf8'),/\.period-reference-line\{position:absolute;z-index:2;/);
console.log('Score/date selection sync, count-up completion, entrance-only bars and reference stacking passed (mock DOM).');
