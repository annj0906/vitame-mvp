'use strict';

// Only the three introduction slides use these supplied character layers.
function onboardingCharacter(index) {
  const key = ['good', 'bad', 'very-bad'][index];
  const label = ['보라색 꽃', '초록색', '분홍색 십자'][index];
  const prefix = 'ob-' + key + '-';
  const asset = 'assets/onboarding/' + key + '/';
  const eye = side => `<span class="${prefix}part ${prefix}eyeWrap ${prefix}eye${side}"><img class="${prefix}eyeVisual" src="${asset}Eye_${side}.png" alt="" draggable="false"></span>`;
  return `<div class="ob-character-slot"><button type="button" class="ob-character ${prefix}charBtn" data-onboarding-character aria-label="${label} 캐릭터 터치"><span class="${prefix}idleMotion"><span class="${prefix}actionMotion" data-character-action><span class="${prefix}char"><img class="${prefix}part ${prefix}body" src="${asset}Body.png" alt="" draggable="false">${eye('L')}${eye('R')}<span class="${prefix}part ${prefix}mouthWrap"><img class="${prefix}mouthVisual" src="${asset}Mouth.png" alt="" draggable="false"></span></span></span></span></button></div><img class="ob-shadow" src="assets/onboarding/shadow-${key}.svg" alt="">`;
}

function onboardingDecorations(index) {
  if (index === 0) return '<span class="ob-decoration ob-square-cyan"></span><span class="ob-decoration ob-square-green"></span><span class="ob-decoration ob-dash-red"></span>';
  if (index === 1) return ['yellow', 'green', 'blue'].map(color => `<img class="ob-decoration ob-circle-${color}" src="assets/onboarding/circle-${color}.svg" alt="">`).join('');
  return ['blue', 'red', 'purple'].map(color => `<span class="ob-decoration ob-triangle ob-triangle-${color}"><img src="assets/onboarding/triangle-${color}.svg" alt=""></span>`).join('');
}

onboarding = function() {
  const titles = ['작은 습관이<br>큰 변화를 만들어요', '영양제 등록을<br>더 간편하게', '나에게 맞는<br>건강한 루틴'];
  const descriptions = ['내 몸에 맞는 영양 관리,<br>지금 시작해볼까요?', '제품 라벨을 찍고,<br>성분 정보를 한눈에 확인해요.', '매일 복용을 기록하고,<br>나만의 관리 방법을 찾아보세요.'];
  return `<section class="onboarding revised-onboarding onboarding-final"><header class="onboarding-header"><div class="final-brand"><img src="assets/onboarding/logo.png" alt="VITAME" width="136" height="29"></div><button class="skip" data-go="health-interests">건너뛰기</button></header><div class="onboarding-window"><div class="onboarding-panel"><div class="onboarding-art">${onboardingDecorations(introPage)}${onboardingCharacter(introPage)}</div><h1>${titles[introPage]}</h1><p class="onboarding-description">${descriptions[introPage]}</p></div></div><div class="slide-dots">${[0,1,2].map(i => `<button data-revision="slide" data-index="${i}" aria-label="온보딩 ${i+1}장" aria-pressed="${i===introPage}" class="${i===introPage?'selected':''}"></button>`).join('')}</div><button class="primary" data-revision="next-slide">${introPage<2?'다음으로':'시작하기'}</button><p class="login-link">이미 계정이 있으신가요? <button class="text-btn" data-go="login">로그인</button></p></section>`;
};

// Reuse the demos' restart-on-tap / animationend cleanup, without test controls.
document.addEventListener('click', event => {
  const character = event.target.closest('[data-onboarding-character]');
  if (!character || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const prefix = 'ob-' + ['good', 'bad', 'very-bad'][introPage] + '-';
  character.classList.remove(prefix + 'tap');
  void character.querySelector('[data-character-action]').offsetWidth;
  character.classList.add(prefix + 'tap');
});
document.addEventListener('animationend', event => {
  if (!event.target.matches('[data-character-action]')) return;
  const character = event.target.closest('[data-onboarding-character]');
  for (const name of [...character.classList]) if (name.endsWith('-tap')) character.classList.remove(name);
});
