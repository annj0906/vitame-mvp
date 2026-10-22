import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>readFileSync(new URL('../public/vitame/'+name+'.js',import.meta.url),'utf8');
for(const name of ['app','revision','welcome','scanner','analysis','home','care','registration','shop','my-pages','utility-pages']){
  const source=read(name);
  assert.match(source,/if\(!globalThis.vitameBooting\)render\(\)/,name+' must not mount a partial app');
  assert.ok(!/^render\(\);/m.test(source),name+' has no unguarded startup mount');
}
const boot=read('app-viewport');
assert.ok(boot.indexOf('globalThis.vitameBooting=true')<boot.indexOf('for(const file of files){\n'));
assert.match(boot,/globalThis.vitameBooting=false;\s+render\(\);/);
assert.match(read('welcome'),/setTimeout\(\(\)=>\{if\(route\(\)==='intro'&&!logoHandoff\)skipIntroAnimation\(\);\},12000\)/);
console.log('Startup: partial mounts suppressed, final single mount and intro watchdog passed.');
