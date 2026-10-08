'use strict';

// Display names map to existing stored interest values; no data migration.
const initialHealthOptions = [
  ['눈', '눈 건강', 'eye', 'blue'], ['에너지', '에너지', 'energy', 'yellow'],
  ['수면 · 스트레스', '수면 · 스트레스', 'sleep', 'purple'], ['두뇌 건강', '두뇌 · 집중력', 'brain', 'purple'],
  ['뼈 · 관절 건강', '뼈 · 관절', 'bone', 'orange'], ['면역', '면역', 'immunity', 'green'],
  ['소화 · 장 건강', '소화 · 장 건강', 'digestion', 'pink'], ['피부', '피부', 'skin', 'purple'],
  ['심혈관', '심혈관', 'heart', 'red'], ['근육 · 운동', '근육 · 운동', 'muscle', 'blue']
];
const setupMessages = [
  '복용 중인 영양제가 있다면 지금 등록해볼까요?',
  '영양제를 등록하면 복용 관리가 더 간편해져요.',
  '스캔 한 번이면 영양제 등록을 빠르게 시작할 수 있어요.',
  '지금 등록하지 않아도 홈에서 언제든 추가할 수 있어요.'
];
let setupMessageIndex = 0;
const setupAsset = name => 'assets/setup/' + name + '.svg';
const setupKeys = ['very-bad', 'bad', 'normal', 'good', 'very-good'];

function initialCharacter(key, interactive = false) {
  const p = 'ob-' + key + '-';
  const directory = ['normal','very-good'].includes(key) ? 'setup' : 'onboarding';
  const asset = 'assets/' + directory + '/' + key + '/';
  const extra = key === 'very-good';
  const eye = side => `<span class="${p}${extra?'eyeSlot':'part'} ${extra?'':p+'eyeWrap'} ${p}eye${side}"><img class="${p}${extra?'eyeGraphic':'eyeVisual'}" src="${asset}Eye_${side}.png" alt="" draggable="false"></span>`;
  const face = `<img class="${p}part ${p}body" src="${asset}Body.png" alt="" draggable="false">${eye('L')}${eye('R')}<span class="${extra?'':p+'part'} ${p}${extra?'mouthSlot':'mouthWrap'}"><img class="${p}${extra?'mouthGraphic':'mouthVisual'}" src="${asset}Mouth.png" alt="" draggable="false"></span>`;
  const content = extra ? `<span class="${p}char"><span class="${p}gesture" data-initial-action>${face}</span></span>` : `<span class="${p}idleMotion"><span class="${p}actionMotion" data-initial-action><span class="${p}char">${face}</span></span></span>`;
  return `<span class="initial-character-box" data-character-key="${key}">${interactive?'<button type="button" aria-label="캐릭터를 눌러 안내 바꾸기" data-initial-character':'<span aria-hidden="true"'} class="initial-character ${p}charBtn">${content}${interactive?'</button>':'</span>'}</span>`;
}
function initialHeader(back, step = 0) {
  return `<header class="initial-header"><button data-go="${back}" aria-label="이전 단계"><img src="${setupAsset('back')}" alt=""></button></header>${step?`<div class="initial-progress" role="progressbar" aria-label="초기 설정 진행" aria-valuemin="0" aria-valuemax="2" aria-valuenow="${step}"><span style="margin-left:${(step-1)*50}%"></span></div>`:''}`;
}
function initialFooter(next, complete = false) {
  return complete ? '<div class="initial-actions"><button data-initial-finish="home">홈으로 가기</button><button class="initial-primary" data-initial-finish="scan">영양제 스캔하기</button></div>'
    : `<div class="initial-actions"><button ${next==='setup-frequency'?'data-skip-interests':`data-setup-skip="${next}"`}>건너뛰기</button><button class="initial-primary" ${next==='setup-frequency'?'data-save-interests':`data-setup-next="${next}"`}>다음으로</button></div>`;
}

const beforeFinalInitialSetup = render;
render = function() {
  const r = route();
  if (!['health-interests','setup-frequency','setup-complete'].includes(r)) return beforeFinalInitialSetup();
  clearTimeout(introTimer);
  document.body.dataset.screen = r;
  document.title = ({'health-interests':'관심 건강 선택','setup-frequency':'복용 빈도','setup-complete':'설정 완료'})[r] + ' · VITAME';
  let content;
  if (r === 'health-interests') {
    interestDraft ||= [...state.interests];
    content = `${initialHeader('onboarding',1)}<div class="initial-copy"><h1>현재 신경쓰이는<br>고민이 있으신가요?</h1><p>설정에서 변경 가능해요</p></div><div class="initial-health-grid">${initialHealthOptions.map(([label,value,asset,color])=>`<button data-setup-interest="${value}" aria-pressed="${interestDraft.includes(value)}" style="--health-tint:var(--vitame-color-accent-${color}-light)"><span class="initial-health-icon"><img src="${setupAsset(asset)}" alt=""></span><span class="initial-health-label">${label}</span><span class="initial-check"><img src="${setupAsset('check')}" alt=""></span></button>`).join('')}</div>${initialFooter('setup-frequency')}`;
  } else if (r === 'setup-frequency') {
    content = `${initialHeader('health-interests',2)}<div class="initial-copy"><h1>영양제를 얼마나<br>자주 챙겨 드시나요?</h1><p>꾹 누르고 움직여 보세요</p></div><div class="initial-frequency"><div class="initial-range"><div class="initial-stops" aria-hidden="true">${Array.from({length:5},()=>`<span><img src="${setupAsset('stop')}" alt=""></span>`).join('')}</div><div class="initial-frequency-character" style="left:${frequencyDraft*25}%">${initialCharacter(setupKeys[frequencyDraft])}</div><input id="initial-frequency" type="range" min="0" max="4" step="1" value="${frequencyDraft}" aria-label="영양제 복용 빈도" aria-valuetext="${frequencyLabels[frequencyDraft]}"></div><div class="initial-frequency-labels">${['거의<br>안먹어요','가끔<br>먹어요','절반 정도','자주<br>먹어요','매일<br>먹어요'].map((label,i)=>`<button data-initial-frequency="${i}" aria-pressed="${i===frequencyDraft}">${label}</button>`).join('')}</div></div>${initialFooter('setup-complete')}`;
  } else {
    content = `${initialHeader('setup-frequency')}<div class="initial-copy initial-complete-copy"><h1>준비가 끝났어요!</h1><p>${esc(state.name)} 님의 관심 건강과 복용<br>습관을 반영했어요.</p></div><div class="initial-completion-art"><div class="initial-bubble"><button data-initial-message aria-label="다른 등록 안내 보기"><span aria-live="polite">${setupMessages[setupMessageIndex]}</span><img src="${setupAsset('refresh')}" alt=""></button><img class="initial-bubble-tail" src="${setupAsset('bubble-tail')}" alt=""></div>${initialCharacter('good',true)}<img class="initial-complete-shadow" src="${setupAsset('shadow')}" alt=""></div>${initialFooter('',true)}`;
  }
  $('#app').innerHTML = `<section class="initial-setup-final initial-${r}">${content}</section>`;
};

function setInitialFrequency(value) {
  frequencyDraft = Math.max(0,Math.min(4,Math.round(Number(value))));
  const input = document.querySelector('#initial-frequency');
  input.value = frequencyDraft;
  input.setAttribute('aria-valuetext',frequencyLabels[frequencyDraft]);
  const mascot = document.querySelector('.initial-frequency-character');
  mascot.style.left = frequencyDraft*25+'%';
  // Replace atomically; fast drags never stack character layers.
  if (mascot.firstElementChild.dataset.characterKey !== setupKeys[frequencyDraft]) mascot.innerHTML = initialCharacter(setupKeys[frequencyDraft]);
  document.querySelectorAll('[data-initial-frequency]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.initialFrequency)===frequencyDraft)));
}
document.addEventListener('input',e=>{if(e.target.id==='initial-frequency')setInitialFrequency(e.target.value);});
document.addEventListener('click',e=>{
  const frequency = e.target.closest('[data-initial-frequency]');
  if (frequency) setInitialFrequency(frequency.dataset.initialFrequency);
  const character = e.target.closest('[data-initial-character]');
  if (character || e.target.closest('[data-initial-message]')) {
    setupMessageIndex = (setupMessageIndex+1)%setupMessages.length;
    document.querySelector('.initial-bubble [aria-live]').textContent = setupMessages[setupMessageIndex];
    if (character && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      character.classList.remove('ob-good-tap');
      void character.querySelector('[data-initial-action]').offsetWidth;
      character.classList.add('ob-good-tap');
    }
  }
  const finish = e.target.closest('[data-initial-finish]');
  if (finish) { state.started = true; save(); interestDraft = null; go(finish.dataset.initialFinish); }
});
document.addEventListener('animationend',e=>{
  if(e.target.matches('[data-initial-action]'))e.target.closest('[data-initial-character]')?.classList.remove('ob-good-tap');
});
