import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../public/vitame/revision.js',import.meta.url),'utf8');
const finish=source.slice(source.indexOf('function endDoseGesture('),source.indexOf("document.addEventListener('pointerup',endDoseGesture)"));
for(const archived of [false,true]){
  for(const [distance,expected] of [[180,64],[-180,-64],[20,0]]){
    const front={style:{}},edit={},remove={};
    const row={style:{},classList:{remove(){},toggle(){}},dataset:archived?{archivedId:'test'}:{rowId:'test'},querySelector:s=>s==='.dose-row-front'?front:s==='.dose-item-edit'?edit:remove};
    const context=vm.createContext({doseGesture:{id:1,row,x:0,offset:0,active:true},doseBlockUntil:0,Date,Math});
    vm.runInContext(finish,context);
    vm.runInContext(`endDoseGesture({pointerId:1,clientX:${distance},type:'pointerup'})`,context);
    assert.equal(row.dataset.swipeOffset,expected);
    assert.equal(front.style.transform,`translateX(${expected}px)`);
    assert.equal(edit.tabIndex,expected>0?0:-1);
    assert.equal(remove.tabIndex,expected<0?0:-1);
  }
}
const progress=source.slice(source.indexOf('let previousDoseRate'),source.indexOf('let doseUndoTimer'));
assert.doesNotMatch(progress,/textContent='0'|data-count-to/);
assert.match(progress,/previousDoseRate/);
assert.match(progress,/scaleX/);
console.log('Dose/archive swipe clamps at 64px without executing actions; progress retains previous value.');
