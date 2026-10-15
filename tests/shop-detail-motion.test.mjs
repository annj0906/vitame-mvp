import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/vitame/shop.js',import.meta.url),'utf8');
const binding=source.slice(source.indexOf('function bindShoppingDetailMotion(){'),source.indexOf('const beforeShopping=render;'));
for(const reduced of [false,true]){
  const targets=Array.from({length:6},()=>({classes:new Set(),matches:()=>false,classList:{add(name){this.owner.classes.add(name);}}}));
  targets.forEach(t=>t.classList.owner=t);
  const observed=[],finished=[];let callback,disconnected=false,stopped=false;
  class Observer{
    constructor(cb,options){callback=cb;assert.equal(options.threshold,0);assert.equal(options.rootMargin,'0px 0px -45% 0px','start near viewport center, not bottom');}
    observe(target){observed.push(target);}
    unobserve(target){finished.push(target);}
    disconnect(){disconnected=true;}
  }
  const ctx={document:{querySelector:()=>({querySelectorAll:()=>targets})},window:{IntersectionObserver:Observer},IntersectionObserver:Observer,matchMedia:()=>({matches:reduced}),stopShoppingVideo:()=>{stopped=true;}};
  vm.createContext(ctx);vm.runInContext(binding,ctx);ctx.bindShoppingDetailMotion();
  assert.equal(observed.length,reduced?0:6);
  if(!reduced){
    callback([{target:targets[0],isIntersecting:false}]);assert.equal(finished.length,0);
    callback([{target:targets[1],isIntersecting:true}]);
    assert.equal(targets[1].classes.has('is-visible'),true);
    assert.equal(targets[2].classes.has('is-visible'),false,'later sections wait for their own intersection');
    assert.deepEqual(finished,[targets[1]],'each entrance plays once');
    ctx.stopShoppingVideo();assert.ok(disconnected&&stopped,'route teardown disconnects observer');
  }else assert.ok(targets.every(t=>t.classes.size===0),'reduced motion leaves content visible');
}
console.log('Product detail motion: immediate section-local entrance, independent captions, once-only reveal and cleanup passed.');
