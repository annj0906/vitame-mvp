import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/vitame/utility-pages.js',import.meta.url),'utf8');
const wrapper=source.slice(source.indexOf('const beforeNavigationMotion=render;'),source.lastIndexOf('render();'));
for(const reduced of [false,true]){
  let animations=0;
  const old={dataset:{active:'home'},visual:{transform:'matrix(1,0,0,1,23,0)',backgroundColor:'blue'}};
  const next={dataset:{active:'shop'},visual:{transform:'matrix(1,0,0,1,200,0)',backgroundColor:'pink'},animate(frames,options){animations++;assert.equal(frames[0].transform,old.visual.transform);assert.equal(frames[1].backgroundColor,'pink');assert.equal(options.pseudoElement,'::before');assert.equal(options.duration,340);}};
  let current=old;
  const ctx={updateDoseCompletionCelebration(){},render:()=>{current=next;},document:{querySelector:()=>current},getComputedStyle:el=>el.visual,matchMedia:()=>({matches:reduced})};
  vm.createContext(ctx);vm.runInContext(wrapper,ctx);ctx.render();
  assert.equal(animations,reduced?0:1);
  ctx.render();assert.equal(animations,reduced?0:1,'same-tab rerenders do not replay');
}
console.log('Navigation capsule: current visual position, color blend, same-tab and reduced motion passed.');
