import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/vitame/analysis.js',import.meta.url),'utf8');
const ctx=vm.createContext({});
vm.runInContext(source.slice(source.indexOf('function guideSpeechOffset('),source.indexOf('function animateGuideSpeech(')),ctx);
for(const stage of [280,320,390,430]){
  for(const width of [70,160,stage*.85]){
    for(const random of [0,.25,.5,.75,1]){
      const offset=ctx.guideSpeechOffset(stage,width,random);
      assert.ok(Math.abs(offset)+width/2<=stage/2-7,'bubble stays inside stage');
      assert.ok(Math.abs(offset)+24<=width/2,'centered tail stays attached to bubble');
    }
  }
}
assert.ok(ctx.guideSpeechOffset(390,200,0)<0);
assert.ok(ctx.guideSpeechOffset(390,200,1)>0);
console.log('Guide bubble: random left/right offsets, viewport bounds and centered tail attachment passed.');
