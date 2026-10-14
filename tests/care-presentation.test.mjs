import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../public/vitame/revision.js',import.meta.url),'utf8');
const finish=source.slice(source.indexOf('function endDoseGesture('),source.indexOf("document.addEventListener('pointerup',endDoseGesture)"));
for(const archived of [false,true]){
  for(const [distance,expected] of [[180,archived?'restore':'edit'],[-180,archived?'delete':'archive'],[20,null]]){
    const front={style:{}},edit={},remove={};
    const row={style:{},classList:{remove(){},toggle(){}},dataset:archived?{archivedId:'test'}:{rowId:'test'},querySelector:s=>s==='.dose-row-front'?front:s==='.dose-item-edit'?edit:remove};
    let action=null;
    const context=vm.createContext({doseGesture:{id:1,row,x:0,offset:0,active:true},doseBlockUntil:0,Date,Math,deleteArchivedNow(){action='delete'},restoreArchivedNow(){action='restore'},archiveDoseNow(){action='archive'},editRegisteredSupplement(){action='edit'}});
    vm.runInContext(finish,context);
    vm.runInContext(`endDoseGesture({pointerId:1,clientX:${distance},type:'pointerup'})`,context);
    assert.equal(action,expected);
    assert.equal(front.style.transform,'');
  }
}
const progress=source.slice(source.indexOf('let previousDoseRate'),source.indexOf('let doseUndoTimer'));
assert.doesNotMatch(progress,/textContent='0'|data-count-to/);
assert.match(progress,/previousDoseRate/);
assert.match(progress,/scaleX/);
console.log('Dose/archive swipe executes the matching action immediately; progress retains previous value.');
