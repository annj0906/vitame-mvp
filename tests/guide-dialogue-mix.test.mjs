import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/vitame/analysis.js',import.meta.url),'utf8');
const dateKey=(d=new Date('2026-10-16T12:00:00'))=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const ctx=vm.createContext({window:{addEventListener(){}},route:()=> 'guide',dateKey,state:{supplements:[{id:'s1'}],records:{}},nutrients:[['비타민 A',35,'부족'],['칼슘',80,'적정'],['아연',80,'적정']]});
vm.runInContext('let guideCharacter=0;'+source.slice(source.indexOf('const guideCharacterKeys='),source.indexOf('const eyeGuideContent=')),ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('Object.values(guideCharacterMessages).flat().length'),30);
assert.equal(run('Object.values(guideExtraMessages).reduce((n,x)=>n+x.chat.length+x.tip.length,0)'),25);
assert.equal(run('guideDialogueFacts().recordedDose'),false);
assert.equal(run('guideDialogueFacts().steady'),false);
for(let i=0;i<5;i++){
  const counts={reaction:0,chat:0,tip:0};let previous='';
  for(let turn=0;turn<30;turn++){
    run(`guideCharacter=${i};delete guideVisitMessages[guideCharacterKeys[guideCharacter]]`);
    const category=run('guideDialogueMix[(guideDialogueCursor[guideCharacterKeys[guideCharacter]]||0)%10]');
    const text=run('guideCharacterMessage()');counts[category]++;
    assert.notEqual(text,previous,'no consecutive repeated message per character');
    assert.equal(run('guideCharacterMessage()'),text,'rerender does not advance dialogue');
    assert.doesNotMatch(text,/꾸준하시네요|복용 올클리어|다시 잘 챙기고|잘 챙겨지고/,'no unrecorded adherence praise');
    previous=text;
  }
  assert.deepEqual(counts,{reaction:15,chat:9,tip:6});
}
const snapshot=JSON.stringify(ctx.state);
for(let i=0;i<14;i++){const d=new Date('2026-10-16T12:00:00');d.setDate(d.getDate()-i);ctx.state.records[dateKey(d)]={s1:true};}
assert.equal(run('guideDialogueFacts().recordedDose'),true);
assert.equal(run('guideDialogueFacts().steady'),true);
assert.notEqual(JSON.stringify(ctx.state),snapshot);
assert.ok(source.includes('guideCharacter=0,guideVisit=0'),'refresh defaults to green');
console.log('Guide dialogue: original 30 + 25 additions, exact 50/30/20 mix, no repeats and real-record gates passed.');
