import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/vitame/home-calendar.js',import.meta.url),'utf8');
const snippet=source.slice(source.indexOf('function returnCalendarToToday('),source.indexOf("document.addEventListener('click', event =>"));
let reduced=false,commits=0,cancelled=0;
const animations=[];
const days=Array.from({length:14},()=>({getClientRects:()=>[{}],animate:(frames,options)=>animations.push({frames,options})}));
const calendar={querySelector:()=>null,querySelectorAll:selector=>selector==='.calendar-day'?days:[]};
const context={selectedDate:'2026-09-10',dateKey:()=>'2026-10-16',document:{querySelector:()=>calendar},cancelLiveSlide:()=>cancelled++,matchMedia:()=>({matches:reduced})};
vm.createContext(context);vm.runInContext(snippet,context);
for(const selector of ['.home-calendar','.dose-calendar']){
  animations.length=0;
  context.returnCalendarToToday(selector,()=>commits++);
  assert.equal(animations.length,14);
  assert.equal(animations[0].options.delay,0);
  assert.equal(animations[6].options.delay,144);
  assert.equal(animations[7].options.delay,0);
}
context.selectedDate='2026-11-20';animations.length=0;
context.returnCalendarToToday('.dose-calendar',()=>commits++);
assert.equal(animations[0].options.delay,144);
assert.match(animations[0].frames[0].transform,/-28px/);
reduced=true;animations.length=0;
context.returnCalendarToToday('.home-calendar',()=>commits++);
assert.equal(animations.length,0);
assert.equal(commits,4);assert.equal(cancelled,4);
console.log('Today return: shared calendars, stagger, reverse direction and reduced motion passed.');
