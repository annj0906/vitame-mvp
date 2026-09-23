'use strict';
// September reference screens: retain the existing data and form interactions.
let introPage=0, dosePeriod='week', introTimer;
const originalRender=render, originalScan=scan, originalResult=result, originalDose=dose, originalMy=my;
const segment=(guideActive=false)=>`<div class="segment">${button('영양소 상태','analysis',guideActive?'':'selected')}${button('AI 가이드','guide',guideActive?'selected':'')}</div>`;
onboarding=function(){const slides=[['작은 습관이<br><em>큰 변화</em>를 만들어요','내 몸에 맞는 영양 관리,<br>지금 시작해볼까요?'],['영양제 등록을<br><em>더 간편하게</em>','제품 라벨을 찍고,<br>성분 정보를 한눈에 확인해요.'],['나에게 맞는<br><em>건강한 루틴</em>','매일의 복용을 기록하고,<br>나만의 관리 방법을 찾아보세요.']];return `<section class="onboarding revised-onboarding"><button class="skip" data-go="login">건너뛰기</button><iframe class="final-brand" title="VITAME 최종 로고" src="intro.html?static" tabindex="-1"></iframe><div class="onboarding-art slide-${introPage}">${character(true)}${introPage===1?icon('camera'):introPage===2?icon('calendar'):''}</div><h1>${slides[introPage][0]}</h1><p>${slides[introPage][1]}</p><div class="slide-dots">${slides.map((_,i)=>`<button aria-label="온보딩 ${i+1}장" aria-pressed="${i===introPage}" data-revision="slide" data-index="${i}" class="${i===introPage?'selected':''}"></button>`).join('')}</div><button class="primary" data-revision="next-slide">시작하기</button><p class="login-link">이미 계정이 있으신가요? ${button('로그인','login','text-btn')}</p></section>`};
scan=function(){return originalScan().replace(/<div class="hero">[\s\S]*?<\/div><div class="scanner">/,'<div class="scanner">').replace('</div><input type="file"','<button data-revision="light">'+icon('leaf')+'조명 켜기</button></div><input type="file"').replace('직접 입력하기','입력하기').replace('<button class="sample"','<button class="secondary skip-registration" data-go="home">건너뛰기</button><button class="sample"')};
result=function(){return originalResult().replace(/<div class="hero">[\s\S]*?<\/div><form/,'<form')};
home=function(){return `${score().replace('내 영양 점수','오늘의 건강 점수').replace('data-action="score-info" aria-label="영양 점수 안내"','data-go="analysis" aria-label="건강 변화 추이 보기"').replace(icon('info'),icon('arrow'))}<button class="home-nutrient-alert" data-go="analysis">${icon('bell')}<div><b>마그네슘 섭취를 확인해보세요!</b><p>영양소 상태에서 자세히 살펴보세요.</p></div>${icon('arrow')}</button><section class="home-dose"><div class="section-head"><h2>${selectedDate===dateKey()?'오늘의 복용':'선택일의 복용'}</h2>${button(`${completed()} / ${state.supplements.length} 완료`,'dose','')}</div>${state.supplements.length?`<div class="dose-mini">${state.supplements.map((s,i)=>`<button class="${state.records[selectedDate]?.[s.id]?'taken':''}" ${selectedDate>dateKey()?'disabled':''} data-action="toggle-home" data-id="${s.id}" aria-pressed="${!!state.records[selectedDate]?.[s.id]}"><span class="check">✓</span><span class="pill p${supplementColor(s,i)}"></span><b>${esc(s.name)}</b><span>${s.time}</span></button>`).join('')}</div>`:empty('복용 루틴을 시작해보세요','영양제를 추가하면 여기에 표시돼요.','scan','영양제 등록하기')}</section><p class="footer-note">건강 점수와 영양소 상태는 시안 확인용 예시입니다.</p>`};
let doseMonth = null, doseWeekAnchor = null;
function doseCalendar(){
  const selected=new Date(selectedDate+'T12:00:00');
  doseMonth ||= new Date(selected.getFullYear(),selected.getMonth(),1);
  const monthly=dosePeriod==='month';
  const start=new Date(monthly?doseMonth:(doseWeekAnchor||selected));
  if(!monthly)start.setDate(start.getDate()-start.getDay());
  const count=monthly?new Date(start.getFullYear(),start.getMonth()+1,0).getDate():7;
  const cells=Array.from({length:count},(_,i)=>{
    const d=new Date(start);d.setDate(start.getDate()+i);
    const key=dateKey(d), picked=key===selectedDate;
    const recorded=Object.values(state.records[key]||{}).some(Boolean);
    return `<button class="calendar-day ${picked?'picked':''}" data-dose-date="${key}" aria-label="${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일" aria-pressed="${picked}" ${key>dateKey()?'disabled':''}>${!monthly?`<span class="day-label">${weekdays[d.getDay()]}</span>`:''}<span class="day-number">${d.getDate()}</span><i class="record-dot ${recorded?'recorded':''}"></i></button>`;
  }).join('');
  return `<section class="dose-calendar" aria-label="${monthly?'월간':'주간'} 복용 달력">${monthly?`<div class="month-toolbar"><button class="icon-btn" data-dose-month="-1" aria-label="이전 달">${icon('back')}</button><h2>${start.getFullYear()}년 ${start.getMonth()+1}월</h2><button class="icon-btn" data-dose-month="1" aria-label="다음 달">${icon('arrow')}</button></div><div class="calendar-grid weekday-labels">${weekdays.map(d=>`<span>${d}</span>`).join('')}</div>`:''}<div class="${monthly?'calendar-grid':'calendar-week'}">${monthly?'<span></span>'.repeat(start.getDay()):''}${cells}</div></section>`;
}
dose=function(){
  const old=originalDose(),list=old.slice(old.indexOf('<div class="section-head">'));
  return `<div class="segment"><button data-revision="dose-week" class="${dosePeriod==='week'?'selected':''}" aria-pressed="${dosePeriod==='week'}">매주 단위</button><button data-revision="dose-month" class="${dosePeriod==='month'?'selected':''}" aria-pressed="${dosePeriod==='month'}">매월 단위</button></div>${doseCalendar()}<section class="dose-status"><h2>${selectedDate===dateKey()?'오늘의':selectedDate.slice(5).replace('-','월 ')+'일'} 복용 현황</h2><div class="metrics"><div><small>✓ 복용 완료</small><b>${completed()}개</b></div><div><small>◷ 남은 복용</small><b>${state.supplements.length-completed()}개</b></div><div><small>◉ 달성률</small><b>${percent()}%</b></div></div></section>${list}`;
};
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-dose-date],[data-dose-month],[data-revision="dose-month"]');
  if(!b||b.disabled)return;
  if(b.dataset.doseDate){selectedDate=b.dataset.doseDate;}
  else if(b.dataset.doseMonth){doseMonth.setMonth(doseMonth.getMonth()+Number(b.dataset.doseMonth));}
  else {dosePeriod='month';const d=new Date(selectedDate+'T12:00:00');doseMonth=new Date(d.getFullYear(),d.getMonth(),1);}
  render();
});
analysis=function(){return `${segment()}<section class="trend"><h3>${icon('chart')} 건강 변화 추이</h3><strong>+12%</strong><svg viewBox="0 0 360 110" role="img" aria-label="최근 4주 예시 영양 점수 추이"><path class="area" d="M10 95 55 77 100 77 145 54 190 75 235 52 280 52 350 25V110H10Z"/><path d="M10 95 55 77 100 77 145 54 190 75 235 52 280 52 350 25"/>${[[10,95],[55,77],[100,77],[145,54],[190,75],[235,52],[280,52],[350,25]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</svg><small>지난 4주간 영양 점수가 상승했어요. · 예시</small></section>${[groups[1],groups[0],groups[2]].map(([s,c,,desc])=>`<section class="nutrition-group ${c}"><div class="row between"><h2>${s==='주의'?'과다':s==='적정'?'유지':s}</h2><b>${nutrients.filter(n=>n[2]===s).length}개</b></div><p>${desc}</p>${nutrients.filter(n=>n[2]===s).map(n=>nutrientRow(n,true)).join('')}</section>`).join('')}${banner('이제 관리 방법을 알아볼까요?','분석 결과를 바탕으로 안내해드려요.','guide')}${button('AI 최적화 가이드 보기','guide')}${note()}`};
nutrientPage=analysis;
guide=function(){return `${segment(true)}<div class="health-map">${character(true)}${[['◉','눈 건강','비타민 A 부족'],['ϟ','에너지','마그네슘 부족'],['♧','뼈 · 관절','비타민 D 부족'],['✧','피부','비타민 C 적정'],['♡','근육','단백질 적정']].map(([i,t,s],n)=>`<div class="health-node node-${n}"><span>${i}</span><b>${t}</b><small class="${n<3?'low':'ok'}">${s}</small></div>`).join('')}</div><section class="insights"><h2>AI 인사이트</h2><article><h3>함께 먹는 성분을 확인해보세요</h3><p>예시 분석에서 오메가-3와 비타민 B6가 주의 항목으로 표시됐어요. 등록된 제품에 같은 성분이 포함되어 있는지, 제품별 섭취량은 어떻게 되어 있는지 살펴보세요.</p></article><article><h3>균형을 채우는 작은 습관</h3><p>비타민 D와 마그네슘 등 부족으로 표시된 항목을 확인해보세요. 이 화면의 수치는 예시이며, 실제 몸의 결핍을 뜻하지 않아요. 제품의 성분 정보와 평소 식사를 함께 살펴보는 것부터 시작해보세요.</p></article><article><h3>꾸준함을 기록해요</h3><p>편한 시간에 복용 알림을 정하고, 복용한 날을 기록해보세요. 나에게 맞는 루틴을 만드는 데 도움이 돼요.</p></article></section><h3>이런 것도 함께해보세요</h3><div class="two habits">${['균형 잡힌 식단','가벼운 운동','규칙적인 수면','충분한 수분'].map(t=>`<button class="card" data-action="insight" data-name="${t}">${icon('leaf')}<h3>${t}</h3></button>`).join('')}</div>${banner('나에게 맞는 제품을 찾아볼까요?','추천 이유와 성분을 함께 확인해요.','shop')}${button('맞춤 제품 추천 보기','shop')}${note()}`};
shop=function(){return `<section class="card mint recommendation"><div class="row between"><h3>${esc(state.name)}님을 위한 추천 요약</h3><button class="icon-btn" data-action="recommend-info" aria-label="추천 기준">${icon('info')}</button></div><div class="recommend-grid">${[['☾','수면 루틴'],['☀','비타민 D'],['♧','장 건강'],['♡','면역 관리']].map(([i,t])=>`<div><span>${i}</span><b>${t}</b><small>함께 살펴봐요</small></div>`).join('')}</div></section><div class="section-head"><h2>추천 제품 TOP 3</h2><button data-revision="all-products">전체 보기</button></div>${[products[0],products[2],products[1]].map(productCard).join('')}<p class="footer-note">오메가-3는 비교용 제품입니다. 예시 분석의 주의 항목이므로 추가 섭취 추천 대상이 아닙니다.</p><div class="promo-slides" aria-label="건강 이야기">${[['이번 주 베스트','건강을 위한 스타터 팩,<br>지금 시작해볼까요?'],['생활 꿀팁','편안한 밤을 위한<br>작은 습관을 시작해요.'],['매일의 기록','차곡차곡 쌓이는<br>나만의 건강 루틴']].map(([tag,title],i)=>`<article class="promo promo-${i}"><span>${tag}</span><h2>${title}</h2>${character(true)}<button data-action="insight" data-name="${tag}">바로가기</button></article>`).join('')}</div><div class="promo-indicator">●　○　○</div>`};
render=function(){clearTimeout(introTimer);const r=route();document.body.dataset.screen=r;if(r==='intro'){$('#app').innerHTML='<section class="intro-screen"><iframe title="VITAME 로고 애니메이션" src="intro.html"></iframe></section>';introTimer=setTimeout(()=>{if(route()==='intro')go('onboarding')},5200);return}if(r==='login'){$('#app').innerHTML=`<section class="login-screen">${button('‹ 돌아가기','onboarding','text-btn')}<div class="logo">VITAME</div><h1>반가워요!<br>건강한 하루를 시작해요.</h1><p>나만의 영양 루틴을 함께 만들어봐요.</p><form id="welcome-form"><label class="field">어떻게 불러드릴까요?<input name="nickname" maxlength="20" placeholder="이름 또는 닉네임" value="${esc(state.name)}" required></label><button class="primary">체험 시작하기</button></form><button class="sample" data-revision="demo-start">샘플 데이터로 둘러보기</button><p class="footer-note">회원 인증 없이 이용하는 체험 화면입니다.</p></section>`;return}originalRender();if(['analysis','nutrients','guide'].includes(r))$('.top h2').textContent='영양 분석';if(r==='shop'){$('.top h2').textContent='쇼핑';$('.top-actions').insertAdjacentHTML('afterbegin',`<button class="icon-btn" data-go="likes" aria-label="찜한 제품">${icon('heart')}</button><button class="icon-btn" data-revision="search" aria-label="제품 검색"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button>`)}if(r==='home')$('.calendar-actions [data-go="analysis"]')?.remove();};
document.addEventListener('click',e=>{const b=e.target.closest('[data-revision]');if(!b)return;const a=b.dataset.revision;if(a==='slide'){introPage=Number(b.dataset.index);render()}if(a==='next-slide'){if(introPage<2){introPage++;render()}else go('login')}if(a==='dose-week'||a==='dose-day'){dosePeriod=a==='dose-week'?'week':'day';render()}if(a==='demo-start'){if(!state.supplements.length)demo();go('scan')}if(a==='light')toast('조명은 기기의 카메라 화면에서 설정해주세요.');if(a==='all-products')toast('현재 준비된 제품 3종을 모두 표시하고 있어요.');if(a==='search')modal('제품 검색','비타민 D, 오메가-3, 마그네슘 제품을 둘러보세요.',`<form id="product-search"><label class="field">제품명<input name="query" required></label><button class="secondary">검색</button></form>`)});
document.addEventListener('submit',e=>{if(e.target.id==='welcome-form'){e.preventDefault();const name=new FormData(e.target).get('nickname').trim();if(!name)return;state.name=name;save();go('scan')}if(e.target.id==='product-search'){e.preventDefault();const query=new FormData(e.target).get('query').trim();const p=products.find(p=>p.name.includes(query));if(p){$('#dialog').close();selectedProduct=p.id;go('detail')}else toast('일치하는 제품이 없어요.')}});
let swipeStart;
document.addEventListener('pointerdown',e=>{if(e.target.closest('.onboarding-art'))swipeStart=e.clientX});
document.addEventListener('pointerup',e=>{if(swipeStart!==undefined){const dx=e.clientX-swipeStart;swipeStart=undefined;if(Math.abs(dx)>45){introPage=Math.max(0,Math.min(2,introPage+(dx<0?1:-1)));render()}}});
my=function(){return `<section class="card my-profile"><div class="profile"><div class="avatar">${icon('user')}</div><div><h2>${esc(state.name)}님</h2><p>오늘도 건강한 하루 보내세요!</p><small>나만의 건강한 습관</small></div>${button('수정','profile','text-btn')}</div></section><section class="card metrics my-metrics"><div>${icon('pill')}<b>${state.supplements.length}개</b><small>등록한 영양제</small></div><div>${icon('calendar')}<b>${percent(dateKey())}%</b><small>오늘 복용률</small></div><div>${icon('chart')}<b>${state.supplements.length?'72점':'—'}</b><small>예시 영양 점수</small></div></section>${banner('꾸준한 관리로','더 건강한 내일을 만들어가요!','dose')}<section class="card">${[['profile','user','내 정보 관리','프로필, 관심 건강'],['manage','pill','내 영양제 관리','등록한 영양제, 복용 시간'],['analysis','chart','건강 리포트','분석 리포트, 관리 가이드'],['likes','heart','찜한 제품','관심 있는 영양제'],['cart','bag','장바구니','담아둔 제품']].map(([r,i,t,d])=>`<button class="list-row" data-go="${r}">${icon(i)}<span><b>${t}</b><small>${d}</small></span>${icon('arrow')}</button>`).join('')}<button class="list-row" data-action="support">${icon('info')}<span>서비스 안내 및 고객센터</span>${icon('arrow')}</button></section>${button('온보딩 다시 보기','onboarding','text-btn')}`};
let notificationCategory=null;
const notificationTypes=[['health','건강','drop'],['change','변화','gift'],['reminder','알람','flag']];
function notificationIcon(type){
  const shapes={drop:'M12 2C9 7 5 10 5 15a7 7 0 0 0 14 0c0-5-4-8-7-13Z',gift:'M3 8h18v4H3ZM5 12v9h14v-9M12 8v13M12 8C3 8 6 0 10 4l2 4Zm0 0c9 0 6-8 2-4l-2 4Z',flag:'M5 22V3m0 0h15l-4 5 4 5H5'};
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${shapes[type]}"/></svg>`;
}
function notificationPage(){
  const today=dateKey(),remaining=state.supplements.length-completed(today);
  const items=[
    {type:'health',text:'내 영양 상태를 한눈에 확인해보세요. 건강 변화 추이와 주요 영양소를 살펴볼 수 있어요.',route:'analysis'},
    {type:'change',text:'작은 기록이 건강한 습관을 만들어요. 오늘의 복용 현황을 이어서 확인해보세요.',route:'dose'},
    {type:'reminder',text:state.supplements.length?`오늘 아직 기록하지 않은 복용이 ${remaining}개 있어요.`:'영양제를 등록하고 나만의 복용 루틴을 시작해보세요.',route:state.supplements.length?'dose':'scan'}
  ];
  const visible=items.filter(n=>!notificationCategory||n.type===notificationCategory);
  return `<header class="top notification-header"><button class="icon-btn" data-go="home" aria-label="홈으로 돌아가기">${icon('back')}</button><h2>알림</h2><span class="header-spacer"></span></header><main class="content notification-content"><div class="notification-filters" aria-label="알림 분류"><button data-notification-filter="all" aria-pressed="${notificationCategory===null}" class="${notificationCategory===null?'selected':''}">전체</button>${notificationTypes.map(([id,label,symbol])=>`<button data-notification-filter="${id}" aria-pressed="${notificationCategory===id}" class="${notificationCategory===id?'selected':''}">${notificationIcon(symbol)}${label}</button>`).join('')}</div><p class="notification-note">체험용 알림</p><div class="notification-list">${visible.map(n=>{const [,label,symbol]=notificationTypes.find(t=>t[0]===n.type);return `<button class="notification-item" data-go="${n.route}"><span class="notification-category">${notificationIcon(symbol)}${label}</span><p>${esc(n.text)}</p><time datetime="${today}">${Number(today.slice(5,7))}월 ${Number(today.slice(8))}일</time></button>`;}).join('')}</div></main>`;
}
document.addEventListener('click',e=>{
  const filter=e.target.closest('[data-notification-filter]');
  if(!filter)return;
  notificationCategory=filter.dataset.notificationFilter==='all'?null:filter.dataset.notificationFilter;
  render();
});
const revisedRender=render;
render=function(){
  if(route()==='notifications'){
    clearTimeout(introTimer);document.body.dataset.screen='notifications';
    $('#app').innerHTML=notificationPage();document.title='알림 · VITAME';return;
  }
  revisedRender();const r=route();
  if(['scan','result','dose','analysis','nutrients','guide','my'].includes(r))$('.top-actions')?.replaceChildren();
  if(r==='my')$('.top h2').textContent='마이페이지';
  if(r==='home'){
    const card=document.querySelector('.content>.card.mint');
    if(card){
      const link=document.createElement('a');link.href='#analysis';link.className=card.className+' health-score-link';
      link.setAttribute('aria-label','오늘의 건강 점수 72점, 건강 변화 추이 보기');
      link.innerHTML=card.innerHTML;
      const arrow=link.querySelector('button');
      if(arrow){const decoration=document.createElement('span');decoration.className='icon-btn';decoration.setAttribute('aria-hidden','true');decoration.innerHTML=icon('arrow');arrow.replaceWith(decoration);}
      card.replaceWith(link);
      const ring=link.querySelector('.ring');
      ring.classList.add('score-ring-animated');
      ring.insertAdjacentHTML('afterbegin','<svg class="score-progress" viewBox="0 0 128 128" aria-hidden="true"><circle class="score-track" cx="64" cy="64" r="56"/><path class="score-fill" pathLength="100" d="M64 8 A56 56 0 1 0 64 120 A56 56 0 1 0 64 8"/></svg>');
    }
  }
};
// Drag cards with a finger or mouse; a swipe never checks a dose.
let doseSwipe=null, blockDoseTapUntil=0;
document.addEventListener('pointerdown',e=>{
  const rail=e.target.closest('.home-dose .dose-mini');
  if(!rail || rail.closest('.list-mode') || e.button!==0)return;
  blockDoseTapUntil=0;
  doseSwipe={rail,id:e.pointerId,x:e.clientX,y:e.clientY,left:rail.scrollLeft,active:false};
});
document.addEventListener('pointermove',e=>{
  const s=doseSwipe;if(!s||s.id!==e.pointerId)return;
  const dx=e.clientX-s.x,dy=e.clientY-s.y;
  if(!s.active){
    if(Math.abs(dy)>10 && Math.abs(dy)>Math.abs(dx)){doseSwipe=null;return;}
    if(Math.abs(dx)<10)return;
    s.active=true;s.rail.setPointerCapture(e.pointerId);s.rail.classList.add('is-swiping');
  }
  s.rail.scrollLeft=s.left-dx;
});
function finishDoseSwipe(e){
  const s=doseSwipe;if(!s||s.id!==e.pointerId)return;doseSwipe=null;
  s.rail.classList.remove('is-swiping');
  if(!s.active)return;
  blockDoseTapUntil=Date.now()+500;
  const step=(s.rail.firstElementChild?.getBoundingClientRect().width||80)+8;
  const dx=e.clientX-s.x;
  const index=Math.round(s.left/step);
  const target=e.type==='pointercancel'?index*step:
    Math.abs(dx)>30?(index+(dx<0?1:-1)*Math.max(1,Math.round(Math.abs(dx)/step)))*step:s.left;
  s.rail.scrollTo({left:Math.max(0,Math.min(s.rail.scrollWidth-s.rail.clientWidth,target)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
document.addEventListener('pointerup',finishDoseSwipe);
document.addEventListener('pointercancel',finishDoseSwipe);
document.addEventListener('click',e=>{
  if(Date.now()<blockDoseTapUntil && e.target.closest('.home-dose .dose-mini')){
    e.preventDefault();e.stopImmediatePropagation();
  }
},true);
// Keep the horizontal position when checking a later supplement.
document.addEventListener('click',e=>{
  const item=e.target.closest('.home-dose [data-action="toggle-home"]');
  if(!item)return;
  const left=item.closest('.dose-mini').scrollLeft;
  requestAnimationFrame(()=>{const list=document.querySelector('.home-dose .dose-mini');if(list)list.scrollLeft=left;});
},true);
let doseEditing=false, doseGesture=null, doseBlockUntil=0;
let homeDoseList=false;
function supplementColor(s,index){
  if(!Number.isInteger(s.colorIndex)){s.colorIndex=index%4;save();}
  return s.colorIndex;
}
const homeBeforeLayout=home;
home=function(){
  const html=homeBeforeLayout();
  const toggle=`<button class="icon-btn home-view-toggle" data-home-view aria-label="${homeDoseList?'카드형으로 보기':'목록형으로 보기'}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${homeDoseList?'<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>':'<path d="M4 5h16M4 12h16M4 19h16"/>'}</svg></button>`;
  return html.replace('<section class="home-dose">',`<section class="home-dose ${homeDoseList?'list-mode':''}">`).replace('</div><div class="dose-mini">',toggle+'</div><div class="dose-mini">');
};
document.addEventListener('click',e=>{if(e.target.closest('[data-home-view]')){homeDoseList=!homeDoseList;render();}});
const doseBeforeEditing=dose;
const trashIcon='<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg>';
function doseRows(){
  return state.supplements.map((s,i)=>`<div class="dose-swipe-row" data-row-id="${s.id}">
    <button class="dose-item-edit" data-edit-supplement="${s.id}" aria-label="${esc(s.name)} 상세설정" tabindex="-1">✎<span>편집</span></button>
    <button class="dose-delete" data-action="delete-supplement" data-id="${s.id}" aria-label="${esc(s.name)} 삭제" tabindex="-1">${trashIcon}</button>
    <div class="dose-row-front">
      ${doseEditing?`<button class="dose-grip" data-grip="${s.id}" aria-label="${esc(s.name)} 순서 변경, 위아래 방향키 사용">☰</button>`:''}
      <button class="dose-row ${state.records[selectedDate]?.[s.id]?'taken':''}" ${doseEditing?'':'data-action="toggle"'} data-id="${s.id}" aria-pressed="${!!state.records[selectedDate]?.[s.id]}" ${!doseEditing&&selectedDate>dateKey()?'disabled':''}><span class="pill p${supplementColor(s,i)}"></span><span><b>${esc(s.name)}</b><small>${s.dose}정 · ${s.time} · ${state.records[selectedDate]?.[s.id]?'복용 완료':'미복용'}</small></span><span class="check">✓</span></button>
    </div></div>`).join('');
}
dose=function(){
  const base=doseBeforeEditing();const prefix=base.slice(0,base.indexOf('<div class="section-head">'));
  return prefix+`<div class="section-head"><h2>복용 목록</h2><button data-dose-edit aria-pressed="${doseEditing}">${doseEditing?'완료':'✎ 편집'}</button></div>${doseEditing?'<p class="subtle">왼쪽 손잡이를 위아래로 끌어 순서를 바꿔주세요.</p>':''}<section class="card dose-edit-list">${state.supplements.length?doseRows():'<p>영양제를 등록하면 복용 목록이 표시돼요.</p>'}</section>${button('+ 영양제 등록하기','scan','secondary')}`;
};
function moveDose(id,index){
  const from=state.supplements.findIndex(s=>s.id===id);
  if(from<0)return;const [item]=state.supplements.splice(from,1);
  state.supplements.splice(Math.max(0,Math.min(index,state.supplements.length)),0,item);save();
}
function shiftDoseCalendar(delta){
  const base=new Date(dosePeriod==='month'?doseMonth:(doseWeekAnchor||new Date(selectedDate+'T12:00:00')));
  const day=base.getDate();base.setDate(1);base.setMonth(base.getMonth()+delta);
  if(dosePeriod==='month')doseMonth=base;
  else {base.setDate(Math.min(day,new Date(base.getFullYear(),base.getMonth()+1,0).getDate()));doseWeekAnchor=base;}
  render();
}
document.addEventListener('click',e=>{
  if(e.target.closest('[data-dose-edit]')){doseEditing=!doseEditing;render();}
});
document.addEventListener('keydown',e=>{
  const grip=e.target.closest('[data-grip]');if(!grip||!['ArrowUp','ArrowDown'].includes(e.key))return;
  e.preventDefault();const id=grip.dataset.grip,index=state.supplements.findIndex(s=>s.id===id);
  moveDose(id,index+(e.key==='ArrowUp'?-1:1));render();
  document.querySelector(`[data-grip="${id}"]`)?.focus();
});
document.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  const cal=e.target.closest('.dose-calendar'),row=e.target.closest('.dose-swipe-row'),grip=doseEditing&&row?row.querySelector('[data-grip]'):null;
  if(!cal&&!grip&&(!row||doseEditing||e.target.closest('.dose-delete,.dose-item-edit')))return;
  doseBlockUntil=0;
  const el=cal||grip||row;
  doseGesture={el,cal,row,grip,id:e.pointerId,x:e.clientX,y:e.clientY,active:false,open:row?.classList.contains('revealed')};
  if(grip){
    e.preventDefault();el.setPointerCapture(e.pointerId);
    const rect=row.getBoundingClientRect();
    doseGesture.center=rect.top+rect.height/2;
    doseGesture.from=[...row.parentElement.children].indexOf(row);
    doseGesture.others=[...document.querySelectorAll('.dose-swipe-row')].filter(r=>r!==row);
    doseGesture.centers=doseGesture.others.map(r=>r.getBoundingClientRect().top+r.offsetHeight/2);
    row.classList.add('reordering');
  }
});
document.addEventListener('pointermove',e=>{
  const g=doseGesture;if(!g||g.id!==e.pointerId)return;
  const dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(g.grip){
    e.preventDefault();g.active=g.active||Math.abs(dy)>8;
    g.row.style.transform=`translateY(${dy}px)`;
    g.target=g.centers.filter(y=>g.center+dy>y).length;
    const step=g.row.offsetHeight+12;
    g.others.forEach((row,i)=>{const old=i>=g.from?i+1:i,next=i>=g.target?i+1:i;row.style.transform=`translateY(${(next-old)*step}px)`;});
    return;
  }
  if(!g.active){
    if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){doseGesture=null;return;}
    if(Math.abs(dx)<12)return;
    g.active=true;g.el.setPointerCapture(e.pointerId);
  }
  if(g.row)g.row.querySelector('.dose-row-front').style.transform=`translateX(${Math.max(-72,Math.min(72,dx))}px)`;
  if(g.cal)g.cal.style.transform=`translateX(${dx}px)`;
});
function endDoseGesture(e){
  const g=doseGesture;if(!g||g.id!==e.pointerId)return;doseGesture=null;
  const dx=e.clientX-g.x;
  if(g.row){g.row.style.transform='';g.row.classList.remove('reordering');}
  g.others?.forEach(row=>row.style.transform='');
  if(!g.active)return;
  doseBlockUntil=Date.now()+500;
  if(g.grip){
    if(e.type!=='pointercancel'){
      moveDose(g.grip.dataset.grip,g.target??g.centers.filter(y=>e.clientY>y).length);render();
    }
  }else if(g.cal){if(e.type!=='pointercancel'&&Math.abs(dx)>42)slideCalendar('.dose-calendar',dx<0?1:-1,()=>shiftDoseCalendar(dx<0?1:-1));else g.cal.style.transform='';}
  else{
    g.row.querySelector('.dose-row-front').style.transform='';
    if(e.type!=='pointercancel'&&dx<-60)deleteDoseNow(g.row.dataset.rowId);
    else {
      if(e.type!=='pointercancel'&&dx>60){
        editingSupplementId=g.row.dataset.rowId;go('supplement-settings');
      }
    }
  }
}
document.addEventListener('pointerup',endDoseGesture);
document.addEventListener('pointercancel',endDoseGesture);
document.addEventListener('click',e=>{
  if(Date.now()<doseBlockUntil&&e.target.closest('.dose-swipe-row,.dose-calendar')){e.preventDefault();e.stopImmediatePropagation();}
},true);
function deleteDoseNow(id){
  const index=state.supplements.findIndex(s=>s.id===id);if(index<0)return;
  const [item]=state.supplements.splice(index,1);
  state.deletedSupplements ||= [];state.deletedSupplements.push({item,index});
  save();render();showDoseUndo();
}
function showDoseUndo(){
  clearTimeout(doseUndoTimer);
  document.querySelector('.dose-undo')?.remove();
  if(!state.deletedSupplements?.length)return;
  const bar=document.createElement('div');bar.className='dose-undo';bar.setAttribute('role','status');
  bar.innerHTML='<span>영양제를 삭제했어요.</span><button data-dose-undo>되돌리기</button>';document.body.append(bar);
  doseUndoTimer=setTimeout(()=>{bar.classList.add('dismissed');setTimeout(()=>bar.remove(),250);},4500);
}
document.addEventListener('click',e=>{
  if(e.target.closest('[data-dose-undo]')){
    const entry=state.deletedSupplements?.pop();if(!entry)return;
    state.supplements.splice(Math.min(entry.index,state.supplements.length),0,entry.item);save();render();showDoseUndo();
  }
  if(e.target.closest('[data-dose-today]')){
    selectedDate=dateKey();doseWeekAnchor=null;
    const d=new Date(selectedDate+'T12:00:00');doseMonth=new Date(d.getFullYear(),d.getMonth(),1);render();
  }
});
const doseBeforeTodayPlacement=dose;
dose=function(){return doseBeforeTodayPlacement().replace('<div class="segment">','<div class="dose-period-toolbar"><div class="segment">').replace('</div><section class="dose-calendar"','</div><button class="calendar-today" data-dose-today>오늘</button></div><section class="dose-calendar"');};
let editingSupplementId=null;
const beforeSupplementSettings=render;
render=function(){
  if(route()!=='supplement-settings'){beforeSupplementSettings();return;}
  clearTimeout(introTimer);document.body.dataset.screen='supplement-settings';
  document.title='영양제 상세설정 · VITAME';
  const s=state.supplements.find(s=>s.id===editingSupplementId);
  $('#app').innerHTML=`<header class="top"><button class="icon-btn" data-go="dose" aria-label="복용 관리로 돌아가기">${icon('back')}</button><h2>영양제 상세설정</h2></header><main class="content">${s?`<form id="supplement-settings-form"><label class="field">제품명<input name="name" value="${esc(s.name)}" maxlength="60" required></label><label class="field">1일 섭취량 (정)<input name="dose" type="number" min="1" max="20" step="1" value="${s.dose}" required></label><label class="field">복용 시간<input name="time" type="time" value="${esc(s.time)}" required></label><h3>성분 정보</h3>${(s.ingredients||[]).map((n,i)=>`<label class="field">성분명<input name="ingredient-${i}" value="${esc(n.name)}" required></label><label class="field">함량 (${esc(n.unit)})<input name="amount-${i}" type="number" min="0.01" max="1000000" step="any" value="${n.amount}" required></label>`).join('')}<button class="primary" type="submit">저장하기</button></form>`:'<p>복용 목록에서 수정할 영양제를 선택해주세요.</p>'}</main>`;
};
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-edit-supplement]');if(!b)return;
  editingSupplementId=b.dataset.editSupplement;go('supplement-settings');
});
document.addEventListener('submit',e=>{
  if(e.target.id!=='supplement-settings-form')return;e.preventDefault();
  if(!e.target.reportValidity())return;
  const s=state.supplements.find(s=>s.id===editingSupplementId);if(!s)return;
  const data=new FormData(e.target),name=data.get('name').trim();if(!name)return;
  const ingredients=(s.ingredients||[]).map((n,i)=>({...n,name:data.get(`ingredient-${i}`).trim(),amount:Number(data.get(`amount-${i}`))}));
  if(ingredients.some(n=>!n.name))return;
  Object.assign(s,{name,dose:Number(data.get('dose')),time:data.get('time'),ingredients});
  save();go('dose');toast('영양제 설정을 저장했어요.');
});
const pencilIcon='<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m16 3 5 5-13 13H3v-5ZM13 6l5 5"/></svg>';
let homeAlertDismissed=false;
const homeBeforeDismiss=home;
home=function(){
  return homeBeforeDismiss().replace(/<button class="home-nutrient-alert"[\s\S]*?<\/button>/,homeAlertDismissed?'':`<section class="home-alert-wrap"><button class="home-nutrient-alert" data-go="analysis">${icon('bell')}<div><b>마그네슘 섭취를 확인해보세요!</b><p>영양소 상태에서 자세히 살펴보세요.</p></div></button><button class="alert-close" data-dismiss-alert aria-label="영양 안내 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></section>`);
};
const doseBeforeProgress=dose;
dose=function(){
  const total=state.supplements.length,done=completed(),rate=total?Math.round(done/total*100):0;
  return doseBeforeProgress()
    .replace(/<section class="dose-status">[\s\S]*?<\/section>/,`<section class="dose-progress-card"><h2>${selectedDate===dateKey()?'오늘의':selectedDate.slice(5).replace('-','월 ')+'일'} 복용현황</h2><div class="dose-progress-summary"><span>달성률 <span data-count-to="${rate}">${rate}</span>%</span><strong><span class="done-count" data-count-to="${done}">${done}</span>/${total} <small>완료</small></strong></div><div class="dose-progress-track" role="progressbar" aria-label="복용 달성률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${rate}"><span style="--progress:${rate/100}"></span></div></section>`)
    .replace('<button data-dose-edit', '<button class="dose-time-sort" data-dose-sort aria-label="복용 시간순 정렬"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h12M3 11h9M3 17h6M19 3v17m-4-4 4 4 4-4"/></svg>시간순 정렬</button><button data-dose-edit')
    .replace('✎ 편집',pencilIcon+' 편집')
    .replace(/>✎<span>편집<\/span>/g,'>'+pencilIcon+'<span>편집</span>')
    .replace('<section class="card dose-edit-list">',`${!doseEditing&&total?'<p class="dose-swipe-hint">좌우로 스와이프 해보세요 · 왼쪽 삭제 / 오른쪽 편집</p>':''}<section class="card dose-edit-list">`);
};
document.addEventListener('click',e=>{
  if(e.target.closest('[data-dismiss-alert]')){homeAlertDismissed=true;e.target.closest('.home-alert-wrap').remove();}
  if(e.target.closest('[data-dose-sort]')){
    state.supplements.sort((a,b)=>(a.time||'').localeCompare(b.time||''));save();render();toast('복용 시간순으로 정렬했어요.');
  }
});
const renderBeforeCount=render;
let previousDoseKey='';
render=function(){
  renderBeforeCount();
  if(route()!=='dose')return;
  const key=selectedDate+':'+completed()+':'+state.supplements.length;
  const animate=key!==previousDoseKey;previousDoseKey=key;
  if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelector('.dose-progress-track>span')?.style.setProperty('animation','none');return;
  }
  const nodes=[...document.querySelectorAll('[data-count-to]')],start=performance.now();
  nodes.forEach(n=>n.textContent='0');
  function tick(now){
    if(!nodes.every(n=>n.isConnected))return;
    const t=Math.min(1,(now-start)/700),ease=1-Math.pow(1-t,3);
    nodes.forEach(n=>n.textContent=Math.round(Number(n.dataset.countTo)*ease));
    if(t<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
};
let doseUndoTimer;
const renderBeforeMotion=render;
let previousHomeKey='',previousScreen='';
render=function(){
  const next=route(),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const leavingNotifications=previousScreen==='notifications'&&next!=='notifications';
  let ghost;
  if(leavingNotifications&&!reduce){
    const app=document.querySelector('#app'),rect=app.getBoundingClientRect();
    ghost=app.cloneNode(true);ghost.removeAttribute('id');ghost.inert=true;ghost.setAttribute('aria-hidden','true');
    Object.assign(ghost.style,{position:'fixed',left:rect.left+'px',top:'0',width:rect.width+'px',height:'100vh',overflow:'hidden',zIndex:'60',background:'#fff',margin:'0'});
    document.body.append(ghost);
  }
  renderBeforeMotion();
  if(ghost)ghost.animate([{transform:'translateX(0)'},{transform:'translateX(105%)'}],{duration:280,easing:'ease-in'}).finished.finally(()=>ghost.remove());
  if(next==='notifications'&&previousScreen!=='notifications'&&!reduce)
    document.querySelector('#app').animate([{transform:'translateX(100%)'},{transform:'translateX(0)'}],{duration:320,easing:'cubic-bezier(.22,.7,.2,1)'});
  previousScreen=next;
  if(next==='dose'&&state.deletedSupplements?.length){
    document.querySelector('.dose-edit-list')?.insertAdjacentHTML('afterend','<button class="text-btn restore-deleted" data-dose-undo>최근 삭제한 영양제 복구</button>');
  }
  if(next!=='home')return;
  const card=document.querySelector('.health-score-link');if(!card)return;
  const day=new Date(selectedDate+'T12:00:00'),label=selectedDate===dateKey()?'오늘의 건강 점수':`${day.getMonth()+1}월 ${day.getDate()}일의 건강 점수`;
  const total=state.supplements.length,done=completed();
  // Stable illustrative score, not a medical assessment.
  const score=total?Math.min(95,66+(day.getDate()+day.getMonth()*3)%7+Math.round(done/total*12)):0;
  card.querySelector('h2').textContent=label;
  card.setAttribute('aria-label',label+' '+score+'점, 체험용 점수, 건강 변화 추이 보기');
  const key=selectedDate+':'+done+':'+total,animate=key!==previousHomeKey&&!reduce;
  previousHomeKey=key;
  const ring=card.querySelector('.ring'),number=ring.querySelector('b');
  if(number)number.textContent=total?score:'—';
  const svg=ring.querySelector('.score-progress'),colors=['#ffdc29','#65dfac','#f267cd','#b76cf6'];
  let offset=0;
  svg.innerHTML='<circle class="score-track" cx="64" cy="64" r="56"/>'+colors.map((color,i)=>{
    const size=score*[.42,.27,.1,.21][i],start=offset;offset+=size;
    return `<path class="score-color" pathLength="100" d="M64 8 A56 56 0 1 0 64 120 A56 56 0 1 0 64 8" stroke="${color}" stroke-dasharray="${size} ${100-size}" stroke-dashoffset="${-start}"/>`;
  }).join('');
  card.querySelector('.score-example-label')?.remove();
  card.insertAdjacentHTML('beforeend','<small class="score-example-label">체험용 예시 점수 · 날짜와 복용 기록에 따른 시각화</small>');
  if(animate){
    const start=performance.now();
    function tick(now){
      if(!ring.isConnected)return;
      const t=Math.min(1,(now-start)/800),ease=1-Math.pow(1-t,3);
      if(number&&total)number.textContent=Math.round(score*ease);
      let pos=0;
      svg.querySelectorAll('.score-color').forEach((path,i)=>{const size=score*[.42,.27,.1,.21][i],visible=Math.max(0,Math.min(size,score*ease-pos));path.setAttribute('stroke-dasharray',visible+' '+(100-visible));pos+=size;});
      if(t<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
};
history.replaceState(null,'',location.pathname+location.search+'#intro');render();
