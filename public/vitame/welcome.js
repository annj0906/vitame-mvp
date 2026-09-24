'use strict';
function jellyArt(index){
  const shapes=[
    'M100 13C120 13 122 40 142 43C178 45 186 80 164 102C152 113 165 140 145 153C123 170 112 149 96 153C69 171 46 158 47 134C49 113 18 112 22 82C25 51 50 52 62 42C74 30 75 13 100 13Z',
    'M62 23C27 23 13 58 30 79C39 92 55 94 58 100C23 105 15 137 34 154C48 168 68 163 99 163C129 163 154 169 167 148C183 120 159 103 141 100C163 90 179 70 166 46C155 21 128 23 101 23Z',
    'M100 10C120 10 127 36 127 58C157 56 185 69 185 91C185 114 153 122 129 122C128 151 120 180 101 180C81 180 73 151 73 123C41 124 15 112 15 91C15 70 45 56 74 58C75 35 81 10 100 10Z',
    'M100 68C82 13 26 18 26 57C26 82 53 93 69 100C15 117 20 174 60 174C84 174 95 147 100 130C116 183 175 177 175 138C175 114 148 104 132 99C184 81 176 24 139 24C115 24 104 50 100 68Z',
    'M94 20Q100 16 107 21L174 70Q181 75 178 84L153 163Q151 171 141 171H59Q49 171 47 162L22 84Q19 75 27 69Z'
  ];
  const colors=[['#7572ff','#e348df'],['#ff94c9','#67e5a8','#599fe8'],['#ff288e','#ffd13f','#ffd0b4'],['#ff663b','#ffce3b'],['#2757ff','#00c5ff']][index];
  return `<div class="jelly-scene"><svg class="jelly-body" viewBox="0 0 200 200" role="img" aria-label="${['보라색 미소 젤리','무지개빛 젤리','분홍빛 별 젤리','주황 네잎 젤리','파란 오각형 젤리'][index]}"><defs><linearGradient id="jelly-gradient" x2=".7" y2="1">${colors.map((c,i)=>`<stop offset="${i/(colors.length-1)*100}%" stop-color="${c}"/>`).join('')}</linearGradient><filter id="jelly-grain"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".13"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter><clipPath id="jelly-clip"><path d="${shapes[index]}"/></clipPath></defs><g clip-path="url(#jelly-clip)"><path d="${shapes[index]}" fill="url(#jelly-gradient)"/><path d="${shapes[index]}" fill="url(#jelly-gradient)" /></g><g fill="none" stroke="white" stroke-width="3.4" stroke-linecap="round"><path d="${index===2?'M85 79l5 3m21 0 5-3':'M83 84h4m26 0h4'}"/>${(index===0||index===4)?'<path d="M83 102q17 14 34 0"/>':index===1?'<ellipse cx="100" cy="102" rx="9" ry="5"/>' :index===3?'<path d="M91 102h18"/>':'<path d="M81 104q19-13 38 0"/>'}</g></svg><div class="jelly-shadow"></div></div>`;
}
const onboardingBeforeJelly=onboarding;
onboarding=function(){
  const titles=['작은 습관이<br>큰 변화를 만들어요','영양제 등록을<br>더 간편하게','나에게 맞는<br>건강한 루틴'];
  const descriptions=['내 몸에 맞는 영양 관리,<br>지금 시작해볼까요?','제품 라벨을 찍고,<br>성분 정보를 한눈에 확인해요.','매일의 복용을 기록하고,<br>나만의 관리 방법을 찾아보세요.'];
  return `<section class="onboarding revised-onboarding"><header class="onboarding-header"><iframe class="final-brand" title="VITAME 최종 로고" src="intro.html?static" tabindex="-1"></iframe><button class="skip" data-go="health-interests">건너뛰기</button></header><div class="onboarding-window"><div class="onboarding-panel"><div class="onboarding-art">${jellyArt(introPage)}</div><h1>${titles[introPage]}</h1><p>${descriptions[introPage]}</p></div></div><div class="slide-dots">${[0,1,2].map(i=>`<button data-revision="slide" data-index="${i}" aria-label="온보딩 ${i+1}장" aria-pressed="${i===introPage}" class="${i===introPage?'selected':''}"></button>`).join('')}</div><button class="primary" data-revision="next-slide">${introPage<2?'다음으로':'시작하기'}</button><p class="login-link">이미 계정이 있으신가요? <button class="text-btn" data-go="login">로그인</button></p></section>`;
};
const welcomeRender=render;
render=function(){
  if(route()==='login'){
    clearTimeout(introTimer);document.body.dataset.screen='login';document.title='로그인 · VITAME';
    $('#app').innerHTML=`<section class="welcome-login"><header><button class="icon-btn" data-go="onboarding" aria-label="온보딩으로 돌아가기">${icon('back')}</button><h2>로그인</h2></header><p class="login-demo-note">체험용 로그인 · 실제 비밀번호를 입력하지 마세요.</p><form id="demo-login-form"><label class="field">이메일<input type="email" name="email" placeholder="이메일을 입력해 주세요" autocomplete="off" required></label><label class="field">비밀번호<span class="password-field"><input type="password" name="password" placeholder="체험용 비밀번호" autocomplete="off" required><button type="button" data-show-password aria-label="비밀번호 보기">보기</button></span></label><div class="login-options"><label><input type="checkbox" disabled> 아이디 저장</label><button type="button" data-login-help>아이디/비밀번호 찾기</button></div><button class="primary" type="submit">로그인</button></form><div class="social-login"><button data-social-demo="카카오" aria-label="카카오 로그인 체험"><span class="kakao-symbol">TALK</span></button><button data-social-demo="Google" aria-label="Google 로그인 체험"><span class="google-symbol">G</span></button><button data-social-demo="Apple" aria-label="Apple 로그인 체험">Apple</button></div><p class="login-demo-note">소셜 로그인도 실제 인증 없이 홈으로 이동하는 체험입니다.</p><p class="signup-line">아직 회원이 아니신가요? <button data-login-help>회원가입</button></p></section>`;
    return;
  }
  welcomeRender();
  if(route()==='intro')clearTimeout(introTimer);
};
document.addEventListener('submit',e=>{
  if(e.target.id!=='demo-login-form')return;
  e.preventDefault();if(!e.target.reportValidity())return;
  e.target.reset();go('home');toast('체험용 홈으로 이동했어요.');
});
document.addEventListener('click',e=>{
  const reveal=e.target.closest('[data-show-password]');
  if(reveal){const input=reveal.previousElementSibling,show=input.type==='password';input.type=show?'text':'password';reveal.textContent=show?'숨김':'보기';reveal.setAttribute('aria-label',show?'비밀번호 숨기기':'비밀번호 보기');}
  if(e.target.closest('[data-login-help]'))toast('체험 버전에서는 계정 가입·찾기를 제공하지 않아요.');
  if(e.target.closest('[data-social-demo]')){go('home');toast('실제 인증 없이 체험용 홈으로 이동했어요.');}
});
let logoHandoff=false;
window.addEventListener('message',async e=>{
  const frame=document.querySelector('.intro-screen iframe');
  if(e.origin!==location.origin||e.source!==frame?.contentWindow||e.data?.type!=='vitame-intro-complete'||logoHandoff)return;
  logoHandoff=true;
  const bounds=frame.getBoundingClientRect(),logo=frame.contentDocument.querySelector('#logoGroup');
  // Keep the same, fully drawn logo alive while the onboarding appears below it.
  const intro=frame.parentElement;
  Object.assign(intro.style,{position:'fixed',left:bounds.left+'px',top:bounds.top+'px',width:bounds.width+'px',height:bounds.height+'px',zIndex:'90',pointerEvents:'none',background:'transparent'});
  frame.contentDocument.body.style.background='transparent';
  frame.contentDocument.querySelector('.stage').style.background='transparent';
  introPage=0;history.replaceState(null,'',location.pathname+location.search+'#onboarding');
  document.body.dataset.screen='onboarding';
  document.querySelector('#app').insertAdjacentHTML('beforeend',onboarding());
  const reveal=document.querySelector('.revised-onboarding');
  reveal.style.opacity='0';reveal.style.pointerEvents='none';
  const target=document.querySelector('.final-brand'),rect=target.getBoundingClientRect();target.style.visibility='hidden';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  await logo.animate([{top:'50%',left:'50%',transform:getComputedStyle(logo).transform},{top:(rect.top+rect.height/2-bounds.top)+'px',left:(rect.left+rect.width/2-bounds.left)+'px',transform:'translate(-50%, -50%) scale(.21)'}],{duration:reduced?0:850,easing:'cubic-bezier(.22,.7,.2,1)',fill:'forwards'}).finished;
  target.style.visibility='';
  await reveal.animate([{opacity:0},{opacity:1}],{duration:reduced?0:650,easing:'ease-out',fill:'forwards'}).finished;
  reveal.style.opacity='';reveal.style.pointerEvents='';intro.remove();logoHandoff=false;
});
let interestDraft=null,checkedDemoId='';
const welcomeBeforeRoutes=render;
render=function(){
  const r=route();
  if(r==='health-interests'){
    clearTimeout(introTimer);document.body.dataset.screen=r;document.title='관심 건강 선택 · VITAME';
    interestDraft ||= [...state.interests];
    const labels=[...interests,'기타'],symbols=['ϟ','✧','◉','♡','♧','♡','◎','◡','♧','☾','…'];
    $('#app').innerHTML=`<section class="interest-setup"><header><button class="icon-btn" data-go="onboarding" aria-label="온보딩으로 돌아가기">${icon('back')}</button></header><div class="setup-progress" aria-label="시작 설정 1단계"><span></span></div><h1>현재 가장 신경 쓰이는<br>건강 고민은?</h1><p class="subtle">선택 사항 · 여러 개를 선택할 수 있어요.</p><div class="setup-interests">${labels.map((t,i)=>`<button data-setup-interest="${t}" aria-pressed="${interestDraft.includes(t)}" class="${interestDraft.includes(t)?'selected':''}"><span class="interest-symbol" aria-hidden="true">${symbols[i]}</span><span>${t}</span><span class="interest-check" aria-hidden="true">${interestDraft.includes(t)?'✓':''}</span></button>`).join('')}</div><p class="subtle">선택한 관심 건강은 MY에서 언제든 변경할 수 있어요.</p><div class="setup-actions"><button class="secondary" data-skip-interests>건너뛰기</button><button class="primary" data-save-interests>다음으로</button></div></section>`;return;
  }
  if(r==='signup'){
    clearTimeout(introTimer);document.body.dataset.screen=r;document.title='회원가입 · VITAME';
    $('#app').innerHTML=`<section class="welcome-login signup-screen"><header><button class="icon-btn" data-go="login" aria-label="로그인으로 돌아가기">${icon('back')}</button><h2>회원가입</h2></header><p class="login-demo-note">화면 체험용입니다. 실제 계정은 생성되지 않으며<br>아이디·비밀번호를 저장하거나 전송하지 않아요.</p><form id="demo-signup-form"><label class="field">아이디<span class="password-field"><input name="username" placeholder="아이디를 입력해 주세요" pattern="[A-Za-z0-9_]{4,20}" title="영문, 숫자, 밑줄 4~20자" maxlength="20" autocomplete="off" required><button type="button" data-check-demo-id>중복확인</button></span></label><p id="demo-id-status" class="login-demo-note" role="status"></p><label class="field">비밀번호<span class="password-field"><input name="password" type="password" minlength="4" placeholder="체험용 비밀번호" autocomplete="new-password" required><button type="button" data-show-password aria-label="비밀번호 보기">보기</button></span></label><label class="field">비밀번호 확인<span class="password-field"><input name="confirm" type="password" placeholder="비밀번호를 다시 입력해 주세요" autocomplete="new-password" required><button type="button" data-show-password aria-label="비밀번호 확인 보기">보기</button></span></label><p class="signup-error" role="alert"></p><button class="primary" type="submit">회원가입</button></form><p class="signup-line">회원이신가요? <button data-go="login">로그인</button></p></section>`;return;
  }
  welcomeBeforeRoutes();
  if(r==='login'){
    const link=document.querySelector('.signup-line button');link.removeAttribute('data-login-help');link.dataset.go='signup';
    const email=document.querySelector('[name="email"]');email.type='text';email.name='username';email.placeholder='아이디를 입력해 주세요';
    email.parentElement.firstChild.textContent='아이디';
  }
};
// Capture only the start/skip controls, leaving the underlined login independent.
document.addEventListener('click',e=>{
  if(route()!=='onboarding')return;
  if(e.target.closest('.skip')||(introPage===2&&e.target.closest('[data-revision="next-slide"]'))){
    e.preventDefault();e.stopImmediatePropagation();interestDraft=[...state.interests];go('health-interests');
  }
},true);
document.addEventListener('click',e=>{
  const choice=e.target.closest('[data-setup-interest]');
  if(choice){const name=choice.dataset.setupInterest;interestDraft=interestDraft.includes(name)?interestDraft.filter(t=>t!==name):[...interestDraft,name];render();}
  if(e.target.closest('[data-skip-interests]')){interestDraft=null;go('setup-frequency');}
  if(e.target.closest('[data-save-interests]')){state.interests=[...interestDraft];save();interestDraft=null;go('setup-frequency');}
  if(e.target.closest('[data-check-demo-id]')){
    const input=document.querySelector('[name="username"]');if(!input.reportValidity())return;
    checkedDemoId=input.value;document.querySelector('#demo-id-status').textContent='입력 형식을 확인했어요. 실제 계정 중복 여부는 확인하지 않습니다.';
  }
});
document.addEventListener('input',e=>{
  if(e.target.closest('#demo-signup-form')&&e.target.name==='username'){checkedDemoId='';document.querySelector('#demo-id-status').textContent='';}
});
document.addEventListener('submit',e=>{
  if(e.target.id!=='demo-signup-form')return;e.preventDefault();
  if(!e.target.reportValidity())return;
  const data=new FormData(e.target),error=e.target.querySelector('.signup-error');
  if(data.get('username')!==checkedDemoId){error.textContent='아이디 중복확인 버튼으로 입력 형식을 확인해주세요.';return;}
  if(data.get('password')!==data.get('confirm')){error.textContent='비밀번호가 일치하지 않아요.';return;}
  e.target.reset();checkedDemoId='';go('login');toast('회원가입 화면 체험을 완료했어요. 로그인 체험을 이어가세요.');
});
const setupRoutes=['health-interests','setup-frequency','setup-difficulty','setup-register'];
const frequencyLabels=['거의 안 먹어요','가끔 먹어요','절반 정도','자주 먹어요','거의 매일 먹어요'];
const difficultyLabels=['자주 깜빡해요','언제 먹어야 할지 헷갈려요','여러 개라 관리가 어려워요','잘 먹고 있는지 모르겠어요','기타'];
let frequencyDraft=state.setupAnswers?.frequency??2;
// Keep previously saved single-choice answers when moving to multiple choices.
let difficultyDraft=Array.isArray(state.setupAnswers?.difficulty)?[...state.setupAnswers.difficulty]:Number.isInteger(state.setupAnswers?.difficulty)?[state.setupAnswers.difficulty]:[];
function setupHeader(step,back){
  return `<header class="setup-header"><button class="icon-btn" data-go="${back}" aria-label="이전 단계">${icon('back')}</button><span><b>${step}</b> / 4</span></header><div class="setup-progress" role="progressbar" aria-label="온보딩 진행" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${step}"><span style="width:${step*25}%"></span></div>`;
}
function setupFooter(next){
  return `<div class="setup-actions"><button class="secondary" data-setup-skip="${next}">건너뛰기</button><button class="primary" data-setup-next="${next}">다음으로</button></div>`;
}
const beforeSetupSteps=render;
render=function(){
  const r=route(),step=setupRoutes.indexOf(r)+1;
  if(step<2){
    beforeSetupSteps();
    if(step===1){const screen=document.querySelector('.interest-setup');screen.querySelector('header').outerHTML=setupHeader(1,'onboarding');const bars=screen.querySelectorAll('.setup-progress');if(bars.length>1)bars[1].remove();}
    return;
  }
  clearTimeout(introTimer);document.body.dataset.screen=r;document.title=['','','복용 빈도','복용 고민','영양제 등록 안내'][step]+' · VITAME';
  let content='';
  if(step===2)content=`<h1>영양제를 얼마나<br>자주 챙겨 드시나요?</h1><p class="setup-description">대략적인 복용 습관을 알려주시면<br>맞춤 관리에 도움이 돼요.</p><div class="frequency-control"><div class="frequency-track"><div class="frequency-mascot" style="left:${frequencyDraft*25}%" aria-hidden="true">${jellyArt(0)}</div><input id="setup-frequency" aria-label="영양제 복용 빈도" type="range" min="0" max="4" step="1" value="${frequencyDraft}" aria-valuetext="${frequencyLabels[frequencyDraft]}"></div><div class="frequency-labels">${frequencyLabels.map((t,i)=>`<button data-frequency-value="${i}" aria-pressed="${i===frequencyDraft}">${t}</button>`).join('')}</div><p class="frequency-current" aria-live="polite">${frequencyLabels[frequencyDraft]}</p></div>${setupFooter('setup-difficulty')}`;
  if(step===3)content=`<div class="difficulty-intro"><h1>영양제를 챙겨 먹을 때<br>가장 어려운 점은<br>무엇인가요?</h1><p class="setup-description">복용 습관을 알면 나에게 맞는<br>관리 방법을 찾는 데 도움이 돼요.</p><div class="setup-mini-jelly" aria-hidden="true">${jellyArt(1)}</div></div><p class="difficulty-help">여러 개를 선택할 수 있어요.</p><div class="difficulty-options">${difficultyLabels.map((t,i)=>`<button data-difficulty="${i}" aria-pressed="${difficultyDraft.includes(i)}" class="${difficultyDraft.includes(i)?'selected':''}">${icon(['bell','calendar','pill','info','plus'][i])}<span>${t}</span><span class="interest-check" aria-hidden="true">${difficultyDraft.includes(i)?'✓':''}</span></button>`).join('')}</div>${setupFooter('setup-register')}`;
  if(step===4)content=`<h1>복용 중인 영양제를<br>등록해볼까요?</h1><p class="setup-description">제품 라벨과 성분 정보를 등록하고<br>나만의 복용 루틴을 시작해요.</p><div class="registration-preview"><div class="setup-mini-jelly" aria-hidden="true">${jellyArt(2)}</div><div class="registration-bottle">${bottle()}</div><div class="registration-benefits"><span>${icon('camera')}사진으로<br>라벨 확인</span><span>${icon('info')}성분·함량<br>직접 확인</span><span>${icon('pill')}나만의<br>복용 목록</span></div></div><p class="login-demo-note">체험 버전은 자동 인식 대신 직접 입력·샘플 결과를 제공해요.</p><div class="registration-actions"><button class="primary" data-go="scan">${icon('camera')} 영양제 스캔하기</button><div class="registration-or">또는</div><div class="setup-actions"><button class="secondary" data-action="manual">직접 입력하기</button><button class="secondary" data-go="home">나중에 할게요</button></div></div>`;
  $('#app').innerHTML=`<section class="interest-setup setup-step step-${step}">${setupHeader(step,setupRoutes[step-2])}${content}</section>`;
};
function updateFrequency(value){
  const previous=frequencyDraft;
  frequencyDraft=Math.max(0,Math.min(4,Math.round(Number(value))));
  const input=document.querySelector('#setup-frequency');input.value=frequencyDraft;input.setAttribute('aria-valuetext',frequencyLabels[frequencyDraft]);
  document.querySelector('.frequency-mascot').style.left=frequencyDraft*25+'%';
  if(previous!==frequencyDraft)paintFrequencyCharacter(true);
  document.querySelector('.frequency-current').textContent=frequencyLabels[frequencyDraft];
  document.querySelectorAll('[data-frequency-value]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.frequencyValue)===frequencyDraft)));
}
document.addEventListener('input',e=>{if(e.target.id==='setup-frequency')updateFrequency(e.target.value);});
document.addEventListener('click',e=>{
  const f=e.target.closest('[data-frequency-value]');if(f)updateFrequency(f.dataset.frequencyValue);
  const d=e.target.closest('[data-difficulty]');if(d){const value=Number(d.dataset.difficulty);difficultyDraft=difficultyDraft.includes(value)?difficultyDraft.filter(v=>v!==value):[...difficultyDraft,value];render();}
  const skip=e.target.closest('[data-setup-skip]');if(skip){go(skip.dataset.setupSkip);return;}
  const next=e.target.closest('[data-setup-next]');if(next){
    state.setupAnswers ||= {};
    if(route()==='setup-frequency')state.setupAnswers.frequency=frequencyDraft;
    if(route()==='setup-difficulty')state.setupAnswers.difficulty=difficultyDraft;
    save();go(next.dataset.setupNext);
  }
});
let frequencyArtId=0;
function frequencyCharacter(index){
  const prefix=`frequency-${++frequencyArtId}-`;
  return jellyArt([2,1,3,0,4][index]).replace(/id="([^"]+)"/g,`id="${prefix}$1"`).replace(/url\(#([^\)]+)\)/g,`url(#${prefix}$1)`);
}
function paintFrequencyCharacter(animate=false){
  const mascot=document.querySelector('.frequency-mascot');if(!mascot)return;
  // Replace synchronously: interrupted fades must never leave older characters behind.
  mascot.querySelectorAll('*').forEach(node=>node.getAnimations().forEach(animation=>animation.cancel()));
  mascot.innerHTML=frequencyCharacter(frequencyDraft);
  const next=mascot.firstElementChild;
  if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    next.animate([{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'scale(1)'}],{duration:220});
  }
}
const beforeFrequencyPolish=render;
render=function(){
  beforeFrequencyPolish();
  if(route()==='setup-frequency'){
    const track=document.querySelector('.frequency-track');
    track.insertAdjacentHTML('afterbegin','<div class="frequency-stops" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>');
    paintFrequencyCharacter();
    document.querySelectorAll('[data-frequency-value]').forEach((b,i)=>{b.innerHTML=['거의<br>안 먹어요','가끔<br>먹어요','절반 정도','자주<br>먹어요','거의 매일<br>먹어요'][i];});
  }
};
let onboardingMoving=false,onboardingDrag=null;
async function changeOnboarding(index,offset=0){
  index=Math.max(0,Math.min(2,index));if(onboardingMoving)return;
  const panel=document.querySelector('.onboarding-panel');if(!panel)return;
  const direction=index>introPage?1:-1,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  onboardingMoving=true;
  if(index===introPage){await panel.animate([{transform:`translateX(${offset}px)`},{transform:'translateX(0)'}],{duration:reduced?0:220}).finished;panel.style.transform='';onboardingMoving=false;return;}
  await panel.animate([{transform:`translateX(${offset}px)`},{transform:`translateX(${-direction*panel.clientWidth}px)`}],{duration:reduced?0:220,easing:'ease-in'}).finished;
  if(route()!=='onboarding'){onboardingMoving=false;return;}
  introPage=index;render();
  const next=document.querySelector('.onboarding-panel');
  await next.animate([{transform:`translateX(${direction*next.clientWidth}px)`},{transform:'translateX(0)'}],{duration:reduced?0:300,easing:'cubic-bezier(.22,.7,.2,1)'}).finished;
  onboardingMoving=false;
}
document.addEventListener('click',e=>{
  if(route()!=='onboarding')return;
  const dot=e.target.closest('[data-revision="slide"]'),next=e.target.closest('[data-revision="next-slide"]');
  if(dot||(next&&introPage<2)){e.preventDefault();e.stopImmediatePropagation();changeOnboarding(dot?Number(dot.dataset.index):introPage+1);}
},true);
document.addEventListener('pointerdown',e=>{
  const panel=e.target.closest('.onboarding-panel');if(!panel||onboardingMoving||e.button!==0)return;
  e.stopPropagation();onboardingDrag={panel,x:e.clientX,y:e.clientY,id:e.pointerId,active:false};
},true);
document.addEventListener('pointermove',e=>{
  const d=onboardingDrag;if(!d||d.id!==e.pointerId)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;
  if(!d.active&&Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){onboardingDrag=null;return;}
  if(Math.abs(dx)>8){d.active=true;d.panel.setPointerCapture(e.pointerId);d.panel.style.transform=`translateX(${dx}px)`;}
});
function endOnboardingDrag(e){
  const d=onboardingDrag;if(!d||d.id!==e.pointerId)return;onboardingDrag=null;
  const dx=e.clientX-d.x;
  if(d.active)changeOnboarding(e.type==='pointercancel'||Math.abs(dx)<45?introPage:introPage+(dx<0?1:-1),dx);
}
document.addEventListener('pointerup',endOnboardingDrag);
document.addEventListener('pointercancel',endOnboardingDrag);
render();
