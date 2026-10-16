'use strict';

// Shared persisted interest strings remain compatible with onboarding and AI guide.
const myHealthColors={eye:'blue',energy:'yellow',sleep:'purple',brain:'blue',bone:'yellow',immunity:'green',digestion:'pink',skin:'yellow',heart:'pink',muscle:'blue'};
let interestSettingsBack='my';
document.addEventListener('click',event=>{
  if(event.target.closest('[data-go="interest-settings"]'))interestSettingsBack=route()==='guide'?'guide':'my';
},true);
function myPageHeader(title,back){
  return `<header class="my-page-header">${back?`<button data-go="${back}" aria-label="${back==='guide'?'AI 가이드로 돌아가기':'마이페이지로 돌아가기'}"><img src="assets/setup/back.svg" alt=""></button>`:''}<h1>${title}</h1></header>`;
}
function myHealthCard([label,value,asset]){
  const selected=state.interests.includes(value),color=myHealthColors[asset];
  return `<button type="button" class="my-health-card" data-my-interest="${esc(value)}" aria-pressed="${selected}" style="--category:var(--vitame-color-accent-${color}-main);--category-light:var(--vitame-color-accent-${color}-light)"><span class="my-health-symbol" aria-hidden="true"><span style="--glyph:url('assets/setup/${asset}.svg')"></span></span><span class="my-health-label">${esc(label)}</span><span class="my-health-check" aria-hidden="true"><img src="assets/setup/check.svg" alt=""></span></button>`;
}
function myInterestSettings(){
  return `${myPageHeader('관심 건강 설정',interestSettingsBack)}<main class="my-interest-content"><h2>현재 신경쓰이는<br>고민이 있으신가요?</h2><p>관심 건강을 눌러 가이드에 추가해보세요</p><div class="my-health-grid" aria-label="관심 건강 선택">${initialHealthOptions.map(myHealthCard).join('')}</div><span class="my-save-status" role="status" aria-live="polite"></span></main>`;
}
function myMenuGroup(title,items){
  const inactive=['복용 알림 설정','주문·배송 조회','최근 본 제품','앱 알림 설정','계정 및 개인정보','고객센터','이용약관'];
  return `<section class="my-menu-group"><h2>${title}</h2>${items.map(([label,destination])=>`<button ${inactive.includes(label)?'type="button" inert aria-disabled="true"':destination?`data-go="${destination}"`:`data-my-unavailable="${label}"`}><span>${label}</span><img src="assets/care/chevron.svg" alt=""></button>`).join('')}</section>`;
}
function finalMyPage(){
  return `${myPageHeader('마이페이지')}<main class="my-page-content"><section class="my-identity"><button class="my-avatar" data-go="profile" aria-label="프로필 수정">${initialCharacter('good')}<span><img src="assets/care/edit.svg" alt=""></span></button><h2>${esc(state.name)}</h2><button class="my-edit-profile" data-go="profile">프로필 수정</button></section><section class="my-summary" aria-label="나의 건강 관리 요약">${[['관심 건강',new Set(state.interests).size,'interest-settings'],['등록 영양제',state.supplements.length,'manage'],['찜한 제품',(state.shopLikes||[]).filter(id=>shoppingProducts.some(p=>p.id===id)).length,'likes']].map(([label,count,destination])=>`<button data-go="${destination}"><span>${label}</span><b>${count}</b></button>`).join('')}</section>${myMenuGroup('나의 건강 관리',[['관심 건강 설정','interest-settings'],['등록한 영양제 관리','manage'],['복용 알림 설정',null]])}${myMenuGroup('나의 쇼핑',[['주문·배송 조회',null],['찜한 제품','likes'],['최근 본 제품',null]])}${myMenuGroup('설정',[['앱 알림 설정',null],['계정 및 개인정보','profile'],['고객센터',null],['이용약관',null]])}<button class="my-logout" data-go="login">로그아웃</button></main>${nav('my')}`;
}
const myPageBeforeDoseDestination=finalMyPage;
finalMyPage=function(){return myPageBeforeDoseDestination().replaceAll('data-go="manage"','data-go="dose"').replaceAll('data-go="profile"','data-my-profile-open').replace(initialCharacter('good'),initialCharacter(myProfileCharacter())).replace('class="my-logout" data-go="login"','class="my-logout" type="button" inert aria-disabled="true"');};
const myProfileCharacters=[['very-bad','분홍','pink'],['bad','초록','green'],['normal','주황','orange'],['good','보라','purple'],['very-good','파랑','blue']];
function myProfileCharacter(){return myProfileCharacters.some(([key])=>key===state.profileCharacter)?state.profileCharacter:'good';}
function myProfileValues(name,character){
  const trimmed=String(name||'').trim();
  return trimmed&&trimmed.length<=20&&myProfileCharacters.some(([key])=>key===character)?{name:trimmed,profileCharacter:character}:null;
}
function openMyProfileSheet(){
  if(route()!=='my'||document.querySelector('#my-profile-sheet'))return;
  let selected=myProfileCharacter(),closing=false,swipe=null;
  const opener=document.activeElement,sheet=document.createElement('dialog');
  sheet.id='my-profile-sheet';sheet.className='my-profile-sheet';sheet.setAttribute('aria-labelledby','my-profile-title');
  sheet.innerHTML=`<div class="my-profile-sheet-head" data-profile-drag><span class="my-profile-handle" aria-hidden="true"></span><h2 id="my-profile-title">프로필 수정</h2><button type="button" class="my-profile-close" aria-label="프로필 수정 닫기">×</button></div><form id="my-profile-form"><div class="my-profile-preview" aria-label="선택한 프로필 캐릭터">${initialCharacter(selected)}</div><div class="my-profile-choices" role="group" aria-label="프로필 캐릭터 선택">${myProfileCharacters.map(([key,label,color])=>`<button type="button" data-profile-character="${key}" aria-label="${label} 캐릭터" aria-pressed="${key===selected}" style="--profile-accent:var(--vitame-color-accent-${color}-main);--profile-light:var(--vitame-color-accent-${color}-light)"><span class="my-profile-art">${initialCharacter(key)}</span><span class="my-profile-choice-check" aria-hidden="true">✓</span></button>`).join('')}</div><label class="my-profile-name" for="my-profile-name">이름</label><input id="my-profile-name" name="profileName" value="${esc(state.name)}" maxlength="20" autocomplete="nickname" required><button class="my-profile-save" type="submit">저장하기</button></form>`;
  document.body.append(sheet);
  const form=sheet.querySelector('form'),input=sheet.querySelector('input'),submit=sheet.querySelector('.my-profile-save');
  input.type='text';input.inputMode='text';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  const syncViewport=()=>{
    const viewport=window.visualViewport;
    sheet.style.setProperty('--profile-viewport-height',(viewport?.height||window.innerHeight)+'px');
    sheet.style.setProperty('--profile-keyboard-inset',Math.max(0,window.innerHeight-(viewport?.height||window.innerHeight)-(viewport?.offsetTop||0))+'px');
  };
  const validate=()=>{submit.disabled=!myProfileValues(input.value,selected);};
  const cleanup=()=>{
    window.visualViewport?.removeEventListener('resize',syncViewport);window.visualViewport?.removeEventListener('scroll',syncViewport);
    window.removeEventListener('hashchange',onNavigate);document.body.style.overflow=previousOverflow;sheet.remove();
    if(route()==='my'){if(opener?.isConnected)opener.focus({preventScroll:true});else document.querySelector('[data-my-profile-open]')?.focus({preventScroll:true});}
  };
  const close=(saved=false,immediate=false)=>{
    if(closing)return;closing=true;input.blur();sheet.inert=true;
    const finish=()=>{sheet.close();if(saved&&route()==='my')render();cleanup();};
    if(reduced||immediate){finish();return;}
    const from=getComputedStyle(sheet).transform;sheet.getAnimations().forEach(animation=>animation.cancel());sheet.classList.add('is-closing');
    sheet.animate([{transform:from==='none'?'translateY(0)':from},{transform:'translateY(100%)'}],{duration:250,easing:'cubic-bezier(.4,0,.8,.6)',fill:'forwards'}).finished.then(finish,finish);
  };
  const onNavigate=()=>close(false,true);
  window.addEventListener('hashchange',onNavigate);
  window.visualViewport?.addEventListener('resize',syncViewport);window.visualViewport?.addEventListener('scroll',syncViewport);
  sheet.addEventListener('cancel',event=>{event.preventDefault();close();});
  sheet.addEventListener('click',event=>{
    if(event.target.closest('.my-profile-close')){close();return;}
    if(event.target===sheet){const box=sheet.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)close();return;}
    const choice=event.target.closest('[data-profile-character]');if(!choice||closing)return;
    selected=choice.dataset.profileCharacter;
    sheet.querySelector('.my-profile-preview').innerHTML=initialCharacter(selected);
    sheet.querySelectorAll('[data-profile-character]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.profileCharacter===selected)));validate();
  });
  input.addEventListener('input',validate);
  form.addEventListener('submit',event=>{
    event.preventDefault();if(closing)return;
    const values=myProfileValues(input.value,selected);if(!values){validate();input.focus();return;}
    Object.assign(state,values);close(true);
  });
  const handle=sheet.querySelector('[data-profile-drag]');
  handle.addEventListener('pointerdown',event=>{
    if(event.button!==0||event.target.closest('button')||closing)return;
    sheet.getAnimations().forEach(animation=>animation.cancel());swipe={id:event.pointerId,y:event.clientY};handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove',event=>{if(swipe?.id===event.pointerId){event.preventDefault();sheet.style.transform=`translateY(${Math.max(0,event.clientY-swipe.y)}px)`;}});
  const finishSwipe=event=>{
    if(swipe?.id!==event.pointerId)return;
    const distance=Math.max(0,event.clientY-swipe.y);swipe=null;
    if(event.type!=='pointercancel'&&distance>56){close();return;}
    sheet.style.transform='';if(!reduced)sheet.animate([{transform:`translateY(${distance}px)`},{transform:'translateY(0)'}],{duration:250,easing:'ease-out'});
  };
  handle.addEventListener('pointerup',finishSwipe);handle.addEventListener('pointercancel',finishSwipe);
  syncViewport();validate();sheet.showModal();sheet.querySelector('.my-profile-close').focus({preventScroll:true});
  if(!reduced)sheet.animate([{transform:'translateY(100%)'},{transform:'translateY(0)'}],{duration:250,easing:'cubic-bezier(.22,1,.36,1)'});
}
const renderBeforeMyPages=render;
render=function(){
  const r=route();
  if(!['my','interest-settings'].includes(r)){renderBeforeMyPages();return;}
  clearTimeout(introTimer);document.body.dataset.screen=r;
  document.title=(r==='my'?'마이페이지':'관심 건강 설정')+' · VITAME';
  $('#app').innerHTML=r==='my'?finalMyPage():myInterestSettings();
};
document.addEventListener('click',e=>{
  if(e.target.closest('[data-my-profile-open]')){openMyProfileSheet();return;}
  const card=e.target.closest('[data-my-interest]');
  if(card&&route()==='interest-settings'){
    const value=card.dataset.myInterest;
    if(!initialHealthOptions.some(option=>option[1]===value))return;
    state.interests=state.interests.includes(value)?state.interests.filter(v=>v!==value):[...state.interests,value];
    save();card.setAttribute('aria-pressed',String(state.interests.includes(value)));
    document.querySelector('.my-save-status').textContent=`관심 건강 ${new Set(state.interests).size}개를 저장했어요.`;
  }
  const unavailable=e.target.closest('[data-my-unavailable]');
  if(unavailable&&route()==='my')modal(unavailable.dataset.myUnavailable,'아직 제공되지 않는 기능이에요. 현재 등록 정보와 복용 기록은 이 브라우저에 저장됩니다.');
});
render();
