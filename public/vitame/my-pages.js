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
  return `<section class="my-menu-group"><h2>${title}</h2>${items.map(([label,destination])=>`<button ${destination?`data-go="${destination}"`:`data-my-unavailable="${label}"`}><span>${label}</span><img src="assets/care/chevron.svg" alt=""></button>`).join('')}</section>`;
}
function finalMyPage(){
  return `${myPageHeader('마이페이지')}<main class="my-page-content"><section class="my-identity"><button class="my-avatar" data-go="profile" aria-label="프로필 수정">${initialCharacter('good')}<span><img src="assets/care/edit.svg" alt=""></span></button><h2>${esc(state.name)}</h2><button class="my-edit-profile" data-go="profile">프로필 수정</button></section><section class="my-summary" aria-label="나의 건강 관리 요약">${[['관심 건강',new Set(state.interests).size,'interest-settings'],['등록 영양제',state.supplements.length,'manage'],['찜한 제품',(state.shopLikes||[]).filter(id=>shoppingProducts.some(p=>p.id===id)).length,'likes']].map(([label,count,destination])=>`<button data-go="${destination}"><span>${label}</span><b>${count}</b></button>`).join('')}</section>${myMenuGroup('나의 건강 관리',[['관심 건강 설정','interest-settings'],['등록한 영양제 관리','manage'],['복용 알림 설정',null]])}${myMenuGroup('나의 쇼핑',[['주문·배송 조회',null],['찜한 제품','likes'],['최근 본 제품',null]])}${myMenuGroup('설정',[['앱 알림 설정',null],['계정 및 개인정보','profile'],['고객센터',null],['이용약관',null]])}<button class="my-logout" data-go="login">로그아웃</button></main>${nav('my')}`;
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
