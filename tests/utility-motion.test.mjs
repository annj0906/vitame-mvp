import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/vitame/utility-pages.js',import.meta.url),'utf8');
const wrapper=source.slice(source.indexOf('const beforeUtilityPages=render;'),source.indexOf("document.addEventListener('click'"));
for(const destination of ['notifications','likes','cart']){
 for(const origin of ['shop','my']){
  for(const reduced of [false,true]){
    const instant=reduced||origin==='my';
    let snapshots=0,animations=0,delegated=0,nextRoute=destination;
    const app={innerHTML:''};
    const context={
      window:{scrollTo(options){assert.equal(options.top,0);assert.equal(options.behavior,'instant');}},
      utilityRoutes:['notifications','likes','cart'],route:()=>nextRoute,
      render:()=>{delegated++;context.document.body.dataset.screen=nextRoute;},document:{body:{dataset:{screen:origin}}},
      matchMedia:()=>({matches:reduced}),$:()=>app,
      archiveTransitionSnapshot:()=>{snapshots++;return {viewport:{style:{},remove(){}},snapshot:{animate(frames,options){animations++;assert.equal(frames[0].transform,nextRoute===destination?'translateX(100%)':'translateX(0)');assert.equal(frames[1].transform,nextRoute===destination?'translateX(0)':'translateX(100%)');assert.equal(options.duration,320);return {finished:Promise.resolve()};}}};},
      stopShoppingVideo(){},clearInterval(){},clearTimeout(){},shoppingTimer:0,introTimer:0,
      utilityNotificationPage:()=>'notices',utilityFavoritesPage:()=>'likes',utilityCartPage:()=>'cart',bindShoppingRails(){}
    };
    vm.createContext(context);vm.runInContext(wrapper,context);context.render();
    assert.equal(snapshots,instant?0:2,`${origin} to ${destination}: only shopping uses frozen transition`);
    assert.equal(animations,instant?0:1);
    context.render();assert.equal(animations,instant?0:1,'same-page updates must not replay entrance');
    assert.equal(delegated,0);
    nextRoute=origin;context.render();
    assert.equal(delegated,1);
    assert.equal(snapshots,instant?0:3,'my exit is immediate; shop exit preserves outgoing page');
    assert.equal(animations,instant?0:2,'only return to shop plays slide-out');
    context.render();assert.equal(animations,instant?0:2,'subsequent renders must not replay exit');
  }
 }
}
const care=readFileSync(new URL('../public/vitame/care.js',import.meta.url),'utf8');
assert.match(care,/const overlayScreens=\['archive','scan'\]/,'utility routes must not double-animate in the inner care wrapper');
assert.match(care,/drawImage\(node,0,0,frame.width,frame.height\)/,'freeze the visible video frame instead of restarting a cloned video');
assert.match(care,/style.animation='none'/,'snapshot animations do not restart');
console.log('Utility motion: three entrances, frozen underlay, reduced motion and same-page updates passed.');
