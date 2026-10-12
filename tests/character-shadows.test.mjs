import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../public/vitame/', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
const context = vm.createContext({ onboarding() {}, document: { addEventListener() {} } });
vm.runInContext(read('onboarding.js'), context);
const run = code => vm.runInContext(code, context);
for (const key of ['very-bad', 'bad', 'normal', 'good', 'very-good']) {
  const markup = run(`characterShadow('${key}', 'test-shadow')`);
  assert.match(markup, new RegExp(`data-shadow-key="${key}"`));
  assert.equal((markup.match(/<img /g) || []).length, 1);
  assert.match(markup, /alt="" draggable="false"/);
  const bytes = fs.readFileSync(new URL(`assets/character-shadows/${key}.webp`, root));
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  assert.equal(bytes.toString('ascii', 12, 16), 'VP8X');
  assert.ok(bytes[20] & 16, `${key} retains alpha`);
  const width = bytes.readUIntLE(24, 3) + 1, height = bytes.readUIntLE(27, 3) + 1;
  assert.ok(markup.includes(`width="${width}" height="${height}"`));
}
assert.throws(() => run("characterShadow('unknown', '')"), /Unknown character shadow/);
for (const [index, key] of ['good', 'bad', 'very-bad'].entries()) {
  const markup = run(`onboardingCharacter(${index})`);
  assert.ok(markup.includes(`assets/character-shadows/${key}.webp`));
  assert.equal((markup.match(/data-shadow-key=/g) || []).length, 1);
  assert.doesNotMatch(markup, /shadow-.*\.svg/);
}
// Carousel previews and commits both call this same renderer.
const guideSource = read('analysis.js').split('function finalGuideCharacters(){')[1].split('function finalGuideCard(')[0];
context.initialCharacter = key => `<span data-character-key="${key}"></span>`;
context.icon = () => '';
vm.runInContext('function finalGuideCharacters(){' + guideSource, context);
for (const [index, key] of ['bad', 'very-bad', 'good', 'normal', 'very-good'].entries()) {
  context.guideCharacter = index;
  const markup = run('finalGuideCharacters()');
  assert.ok(markup.includes(`data-shadow-key="${key}"`));
  assert.equal((markup.match(/data-shadow-key=/g) || []).length, 1);
}
const css = read('onboarding.css');
assert.match(css, /object-fit: contain/);
assert.match(css, /prefers-reduced-motion: reduce/);
for (const key of ['very-bad', 'bad', 'normal', 'good', 'very-good']) {
  for (const motion of ['idle', 'tap', 'success']) assert.ok(css.includes(`@keyframes vitame-shadow-${key}-${motion}`));
}
for (const file of ['onboarding-motion.css', 'setup-motion.css']) assert.doesNotMatch(read(file), /filter:\s*blur\(10px\)/);
console.log('Character shadows: five original-alpha assets, state mapping, carousel and motion rules passed.');
