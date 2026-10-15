import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/vitame/setup.js',import.meta.url),'utf8');
const snippet=source.slice(source.indexOf('let initialCompletionCelebrated='),source.indexOf('render = function()',source.indexOf('let initialCompletionCelebrated=')));
for(const reduced of [false,true]){
  const ctx={matchMedia:()=>({matches:reduced})};vm.createContext(ctx);vm.runInContext(snippet,ctx);
  const html=ctx.initialCompletionCelebration();
  if(reduced)assert.equal(html,'');
  else{
    assert.equal((html.match(/class="completion-pop /g)||[]).length,5);
    assert.match(html,/aria-hidden="true"/);
    for(const [,path] of html.matchAll(/src="([^"]+)"/g))assert.ok(existsSync(new URL('../public/vitame/'+path,import.meta.url)));
  }
  assert.equal(ctx.initialCompletionCelebration(),'','rerender/revisit cannot replay celebration');
}
assert.match(source,/if\(r==='setup-complete'\)\{\s*startSetupMessageRotation\(\);\s*const celebration=initialCompletionCelebration\(\);\s*const box=document.querySelector\('\.initial-completion-art \.initial-character-box'\)/,'decorations attach only to the completion character');
assert.match(source,/if\(celebration\)\{[\s\S]*?box.querySelector\('\[data-initial-character\]'\).classList.add\('ob-good-success'\)/,'first entry reuses existing Success motion');
assert.match(source,/copyBottom\+18-origin/,'burst apex follows the copy boundary');
assert.match(source,/window.innerHeight-origin-10/,'larger particles reach the viewport floor');
assert.match(source,/bubble.classList.add\('completion-bubble-after-success'\);bubble.inert=true/,'bubble waits without changing layout or accepting hidden clicks');
assert.match(source,/bubble.inert=false;bubble.classList.remove\('completion-bubble-after-success'\)/,'bubble becomes interactive after its entrance');
assert.match(source,/classList.remove\('ob-good-tap','ob-good-success'\)/,'action completion returns to the existing Idle');
console.log('Completion celebration: five decorative shapes, existing assets, first-entry only, reduced motion and completion-only scope passed.');
