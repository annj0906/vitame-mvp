import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const setup=readFileSync(new URL('../public/vitame/setup.js',import.meta.url),'utf8');
const source=readFileSync(new URL('../public/vitame/my-pages.js',import.meta.url),'utf8');
let current='my',click,saved,delegated=0;
const app={innerHTML:''},status={textContent:''};
const state={name:'수진',interests:[],supplements:[{}],likes:[],records:{keep:true}};
const context=vm.createContext({state,route:()=>current,render:()=>delegated++,introTimer:0,clearTimeout,
  esc:String,initialCharacter:()=>'',nav:()=>'<nav>MY</nav>',$:()=>app,
  save:()=>{saved=JSON.stringify(state);},modal:()=>{},
  document:{body:{dataset:{}},addEventListener:(type,fn)=>{click=fn;},querySelector:()=>status}});
vm.runInContext(setup.slice(setup.indexOf('const initialHealthOptions'),setup.indexOf('const setupMessages')),context);
vm.runInContext(source,context);
const options=vm.runInContext('initialHealthOptions',context);
assert.match(app.innerHTML,/관심 건강<\/span><b>0/);
current='interest-settings';
for(const [,value] of options){
  const card={dataset:{myInterest:value},setAttribute:(name,value)=>{card[name]=value;}};
  click({target:{closest:selector=>selector==='[data-my-interest]'?card:null}});
  assert.equal(card['aria-pressed'],'true');
  assert.ok(JSON.parse(saved).interests.includes(value));
}
vm.runInContext('render()',context);
assert.equal((app.innerHTML.match(/aria-pressed="true"/g)||[]).length,10);
current='my';vm.runInContext('render()',context);
assert.match(app.innerHTML,/관심 건강<\/span><b>10/);
current='interest-settings';
for(const [,value] of options){
  const card={dataset:{myInterest:value},setAttribute:(name,value)=>{card[name]=value;}};
  click({target:{closest:selector=>selector==='[data-my-interest]'?card:null}});
  assert.equal(card['aria-pressed'],'false');
}
assert.deepEqual(JSON.parse(saved).interests,[]);
assert.deepEqual(state.records,{keep:true});
current='home';vm.runInContext('render()',context);assert.equal(delegated,1);
console.log('MY: ten selectable categories, persistence, actual counts, deselection and other-route delegation passed.');
