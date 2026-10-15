import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/vitame/utility-pages.js',import.meta.url),'utf8');
const wrapper=source.slice(source.indexOf('const beforeUtilityPages=render;'),source.indexOf("document.addEventListener('click'"));
for(const destination of ['notifications','likes','cart']){
  for(const reduced of [false,true]){
    let snapshots=0,animations=0,delegated=0;
    const app={innerHTML:''};
    const context={
      utilityRoutes:['notifications','likes','cart'],route:()=>destination,
      render:()=>delegated++,document:{body:{dataset:{screen:'shop'}}},
      matchMedia:()=>({matches:reduced}),$:()=>app,
      archiveTransitionSnapshot:()=>{snapshots++;return {viewport:{style:{},remove(){}},snapshot:{animate(frames,options){animations++;assert.equal(frames[0].transform,'translateX(100%)');assert.equal(options.duration,320);return {finished:Promise.resolve()};}}};},
      stopShoppingVideo(){},clearInterval(){},clearTimeout(){},shoppingTimer:0,introTimer:0,
      utilityNotificationPage:()=>'notices',utilityFavoritesPage:()=>'likes',utilityCartPage:()=>'cart',bindShoppingRails(){}
    };
    vm.createContext(context);vm.runInContext(wrapper,context);context.render();
    assert.equal(snapshots,reduced?0:2,`${destination}: preserve origin and incoming page`);
    assert.equal(animations,reduced?0:1);
    context.render();assert.equal(animations,reduced?0:1,'same-page updates must not replay entrance');
    assert.equal(delegated,0);
  }
}
const care=readFileSync(new URL('../public/vitame/care.js',import.meta.url),'utf8');
assert.match(care,/const overlayScreens=\['archive','scan','notifications','likes','cart'\]/,'favorites and cart reuse shared slide-out motion');
console.log('Utility motion: three entrances, frozen underlay, reduced motion and same-page updates passed.');
