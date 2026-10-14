import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const handlers={},timers=[],status={textContent:''};
const scanner={classList:{add(){},remove(){}}},shutter={disabled:false},cancel={hidden:true};
let currentRoute='test',destination='',saves=0;
const state={supplements:[]};
const context=vm.createContext({
  state,route:()=>currentRoute,render(){},introTimer:0,clearTimeout(){},setTimeout:(fn,delay)=>{timers.push({fn,delay});},
  esc:String,icon:()=>'',toast(){},go:r=>{destination=r;},save:()=>saves++,uploadURL:'',draft:null,
  window:{addEventListener(){}},navigator:{},URL:{revokeObjectURL(){}},
  document:{body:{dataset:{}},hidden:false,addEventListener:(type,fn)=>{(handlers[type]??=[]).push(fn);},
    querySelector:selector=>({'[data-scan-status]':status,'.live-scanner':scanner,'[data-label-scan]':shutter,'[data-label-cancel]':cancel}[selector]??null)},
});
for(const name of ['scanner.js','registration.js'])vm.runInContext(fs.readFileSync(new URL('../public/vitame/'+name,import.meta.url),'utf8'),context);
const run=code=>vm.runInContext(code,context);
const supplied=JSON.parse(run('JSON.stringify(suppliedLabelRegistrationDraft())'));
assert.equal(supplied.name,'VITAME 데일리 멀티비타민 미네랄');
assert.equal(supplied.ingredients.length,17);
assert.deepEqual(supplied.ingredients.find(n=>n.name==='마그네슘'),{name:'마그네슘',amount:100,unit:'mg',percent:32});
assert.equal(supplied.ingredients.find(n=>n.name==='엽산').unit,'μg DFE');
assert.equal(supplied.labelInfo.totalContent,'60 g');
assert.equal(supplied.labelInfo.calories,240);
run("registrationQuery='VITAME'");
assert.equal((run('registrationResults()').match(/data-registration="select"/g)||[]).length,2);
run('registrationSelection=registrationProducts[1];useRegistrationProduct()');
assert.equal(run('registrationDraft.exampleNutrition'),true);
assert.equal(run('registrationDraft.ingredients.length'),2);
currentRoute='scan';run('scanSuppliedLabel()');
assert.equal(shutter.disabled,true);
assert.equal(destination,'');
timers.find(t=>t.delay===3200).fn();
assert.equal(destination,'supplement-register');
assert.equal(run('registrationTab'),'manual');
assert.equal(run('registrationDraft.ingredients.length'),17);
const submit={target:{id:'registration-settings',reportValidity:()=>true},preventDefault(){}};
for(const handler of handlers.submit)handler(submit);
assert.equal(destination,'home');
assert.equal(state.supplements.length,1);
assert.equal(state.supplements[0].ingredients.length,17);
assert.equal(saves,1);
console.log('Registration: supplied 17 ingredients/units/metadata, two results, explicit night example, scan handoff, saved schedule and home destination passed.');
