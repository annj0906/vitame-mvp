import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/vitame/welcome.js',import.meta.url),'utf8');
const start=source.indexOf("  const choice=e.target.closest('[data-setup-interest]');");
const end=source.indexOf("  if(e.target.closest('[data-skip-interests]'))",start);
assert.ok(start>=0&&end>start);
const legacyCheck={textContent:''};
const choice={dataset:{setupInterest:'눈'},classList:{toggle(name,value){this[name]=value;}},
  setAttribute(name,value){this[name]=value;},querySelector:()=>legacyCheck};
const context=vm.createContext({interestDraft:[],e:{target:{closest:()=>choice}},
  render(){assert.fail('Selection must not rebuild the screen');}});
vm.runInContext(`{${source.slice(start,end)}}`,context);
assert.equal(choice['aria-pressed'],'true');
assert.equal(choice.classList.selected,true);
assert.equal(legacyCheck.textContent,'✓');
assert.deepEqual(Array.from(context.interestDraft),['눈']);
vm.runInContext(`{${source.slice(start,end)}}`,context);
assert.equal(choice['aria-pressed'],'false');
assert.equal(choice.classList.selected,false);
assert.equal(legacyCheck.textContent,'');
assert.equal(context.interestDraft.length,0);
console.log('Interest selection updates in place synchronously without rebuilding check images.');
