'use strict';

// Illustrative analysis only. These values are not calculated from health data.
const nutritionExpanded={low:false,high:false,ok:false};
const analysisGroups=[
  {status:'부족',tone:'low',title:'부족한 영양소',description:'지금 더 챙겨보세요.',symbol:'down'},
  {status:'주의',tone:'high',title:'주의가 필요한 영양소',description:'과다 섭취되지 않도록 관리해보세요.',symbol:'alert'},
  {status:'적정',tone:'ok',title:'적정 영양소',description:'지금처럼 잘 유지해주세요.',symbol:'check'}
];
const wellnessPaths={
  down:'M12 4v16m-6-6 6 6 6-6',up:'M12 20V4m-6 6 6-6 6 6',
  alert:'M12 5v9m0 4v1',check:'m5 12 5 5L20 7',
  eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  brain:'M12 5c-3-5-8-1-7 3-5 2-3 8 0 8-1 5 5 7 7 3V5Zm0 0c3-5 8-1 7 3 5 2 3 8 0 8 1 5-5 7-7 3M7 8l2 2m8-2-2 2M7 16l2-2m8 2-2-2',
  gut:'M10 3v6c0 3-5 1-5 6a6 6 0 0 0 12 1c0-2 4-3 3-7-1-4-5-5-7-2V3',
  bone:'M5 4a3 3 0 0 0-1 5l5 6a3 3 0 1 0 5 4l5-5a3 3 0 1 0-4-5L9 4a3 3 0 0 0-4 0Z',
  bolt:'m13 2-9 12h7l-1 8 10-13h-8l1-7Z',
  heart:'M12 21 3 12C-3 4 7-1 12 6 17-1 27 4 21 12Z',
  moon:'M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z',
  sparkle:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z',
  meal:'M4 3v7m3-7v7m3-7v7M4 8h6M7 10v11M18 3c-4 4-4 9 0 9V3Zm0 9v9',
  clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l4 2',
  muscle:'m3 15 4-8 4 1 1 4 4-1 5 4-3 5H6l-3-5Z',
  chevron:'m7 10 5 5 5-5'
};
function wellnessIcon(name){return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${wellnessPaths[name]||paths[name]||wellnessPaths.sparkle}"/></svg>`;}
let wellnessArtId=0;
function wellnessArt(index){
  const prefix=`wellness-${++wellnessArtId}-`;
  return jellyArt(index).replace(/id="([^"]+)"/g,`id="${prefix}$1"`).replace(/url\(#([^\)]+)\)/g,`url(#${prefix}$1)`);
}
function analysisTabs(isGuide=false){return `<div class="segment wellness-tabs" aria-label="분석 화면 선택"><button data-go="analysis" class="${isGuide?'':'selected'}" aria-current="${isGuide?'false':'page'}">종합 분석</button><button data-go="guide" class="${isGuide?'selected':''}" aria-current="${isGuide?'page':'false'}">AI 가이드</button></div>`;}
function nutritionCard(group){
  const items=nutrients.filter(n=>n[2]===group.status),expanded=nutritionExpanded[group.tone];
  return `<section class="nutrition-panel ${group.tone}"><button class="nutrition-panel-toggle" data-nutrition-toggle="${group.tone}" aria-expanded="${expanded}" aria-controls="nutrition-${group.tone}"><span class="wellness-symbol">${wellnessIcon(group.symbol)}</span><span><b>${group.title} ${items.length}개</b><small>${group.description}</small></span>${wellnessIcon('chevron')}</button><div id="nutrition-${group.tone}" class="nutrition-panel-body" ${expanded?'':'hidden'}>${items.map(n=>`<button class="analysis-nutrient" data-action="nutrient" data-name="${esc(n[0])}"><span class="nutrient-glyph" aria-hidden="true">${n[3]}</span><span>${esc(n[0])}</span><span class="nutrient-rate">${n[1]}%</span><span class="nutrient-track"><i style="width:${Math.min(n[1],100)}%"></i></span><span class="nutrient-status">${group.status}</span>${icon('arrow')}</button>`).join('')}</div><div class="nutrition-panel-chips" ${expanded?'hidden':''}>${items.slice(0,4).map(n=>`<span>${esc(n[0])}</span>`).join('')}${items.length>4?`<span>+ 외 ${items.length-4}개</span>`:''}</div></section>`;
}
const wellnessGuides=[
  {id:'eyes',title:'눈 건강',interest:'눈 건강',symbol:'eye',color:'blue',art:4,names:['비타민 A','오메가-3'],description:'눈을 위한 일상 관리 습관을 살펴보세요.',food:'다양한 채소를 곁들인 식사를 기록해보세요.',habit:'화면을 오래 봤다면 잠시 눈을 쉬게 해주세요.'},
  {id:'energy',title:'에너지',interest:'에너지',symbol:'bolt',color:'yellow',art:3,names:['엽산','마그네슘'],description:'하루를 가볍게 채우는 생활 습관을 알아보세요.',food:'끼니를 거르지 않고 다양한 식품을 골고루 챙겨보세요.',habit:'가벼운 움직임과 휴식 시간을 일상에 더해보세요.'},
  {id:'sleep',title:'수면 · 스트레스',interest:'수면 · 스트레스',symbol:'moon',color:'purple',art:0,names:['마그네슘','비타민 B6'],description:'편안한 하루를 마무리하는 습관을 살펴보세요.',food:'늦은 시간의 카페인 섭취 습관을 돌아보세요.',habit:'일정한 취침 시간과 편안한 휴식 루틴을 만들어보세요.'},
  {id:'brain',title:'두뇌 건강',interest:'두뇌 · 집중력',symbol:'brain',color:'purple',art:0,names:['오메가-3','비타민 B6'],description:'집중과 휴식의 균형을 찾아보세요.',food:'한 가지 식품에 치우치지 않는 식사를 기록해보세요.',habit:'집중하는 시간 사이에 짧은 휴식을 계획해보세요.'},
  {id:'gut',title:'소화 · 장 건강',interest:'소화 · 장 건강',symbol:'gut',color:'pink',art:2,names:['마그네슘','아연'],description:'편안한 식사와 일상의 리듬을 살펴보세요.',food:'평소 먹는 채소와 통곡물 등 식품의 종류를 살펴보세요.',habit:'천천히 식사하고, 나에게 편안한 식사 시간을 기록해보세요.'},
  {id:'bones',title:'뼈 · 관절 건강',interest:'뼈 · 관절',symbol:'bone',color:'orange',art:3,names:['비타민 D','칼슘'],description:'꾸준히 이어갈 수 있는 관리 습관을 찾아보세요.',food:'평소 식사에서 칼슘이 포함된 식품을 확인해보세요.',habit:'몸에 무리가 없는 가벼운 움직임을 이어가보세요.'},
  {id:'immune',title:'면역',interest:'면역',symbol:'heart',color:'pink',art:2,names:['비타민 C','아연'],description:'균형 잡힌 일상의 기본을 챙겨보세요.',food:'채소와 과일 등 다양한 식품을 골고루 먹는 습관을 살펴보세요.',habit:'충분한 휴식과 규칙적인 생활 리듬을 챙겨보세요.'},
  {id:'skin',title:'피부',interest:'피부',symbol:'sparkle',color:'pink',art:2,names:['비타민 C','비타민 E'],description:'나에게 맞는 일상 관리 루틴을 살펴보세요.',food:'다양한 식품과 규칙적인 식사를 챙겨보세요.',habit:'수면과 휴식 습관을 함께 기록해보세요.'},
  {id:'circulation',title:'심혈관',interest:'심혈관',symbol:'heart',color:'orange',art:3,names:['오메가-3','비타민 B1'],description:'생활 속 작은 관리 습관을 확인해보세요.',food:'평소 식사의 종류와 균형을 돌아보세요.',habit:'일상에서 오래 앉아 있는 시간을 살펴보세요.'},
  {id:'muscles',title:'근육 · 운동',interest:'근육 · 운동',symbol:'muscle',color:'blue',art:4,names:['마그네슘','비타민 D'],description:'운동과 휴식의 균형을 기록해보세요.',food:'운동하는 날에도 규칙적인 식사를 챙겨보세요.',habit:'나에게 맞는 활동과 회복 시간을 함께 계획해보세요.'}
];
function guideSection(g,index){
  const current=g.names.map(name=>nutrients.find(n=>n[0]===name)).filter(Boolean);
  const related=products.filter(p=>g.names.includes(p.nutrient));
  return `<section id="guide-${g.id}" class="wellness-guide-section tone-${g.color}" aria-labelledby="guide-title-${g.id}"><header class="wellness-section-heading"><span class="wellness-section-number">${String(index+1).padStart(2,'0')}</span><div><h2 id="guide-title-${g.id}" tabindex="-1">${g.title} 가이드</h2><p>${g.description}</p></div></header><div class="wellness-current"><span class="wellness-symbol">${wellnessIcon(g.symbol)}</span><div><h3>현재 상태 <small>예시</small></h3>${current.map(n=>`<button data-action="nutrient" data-name="${esc(n[0])}" class="guide-nutrient"><span>${esc(n[0])}</span><span>${n[1]}%</span><b class="${n[2]==='부족'?'low':n[2]==='주의'?'high':'ok'}">${n[2]}</b></button>`).join('')}</div></div><div class="wellness-advice"><h3>이렇게 관리해보세요!</h3>${[
    ['pill','복용 관리','등록한 제품의 성분과 표시된 섭취량을 확인해보세요.','동일한 성분이 여러 제품에 포함되어 있는지 확인하고, 임의로 섭취량을 늘리지 마세요.'],
    ['meal','식습관 관리',g.food,'평소 식사를 기록해 나의 식사 패턴을 살펴보세요.'],
    ['clock','생활 습관',g.habit,'무리한 목표보다 일상에서 꾸준히 이어갈 수 있는 작은 습관부터 시작해보세요.']
  ].map(([symbol,title,copy,detail])=>`<details class="wellness-advice-row"><summary><span>${wellnessIcon(symbol)}</span><span><b>${title}</b><span>${copy}</span></span>${icon('arrow')}</summary><p>${detail}</p></details>`).join('')}<details class="guide-related"><summary>${icon('bag')}관련 제품 살펴보기 ${wellnessIcon('chevron')}</summary><div>${related.length?related.map(p=>`<button data-action="product" data-id="${p.id}"><span><b>${esc(p.name)}</b><small>${p.id==='o'?'주의 성분 · 비교용 제품':'체험용 예시 제품'}</small></span>${icon('arrow')}</button>`).join(''):'<p>이 영역의 예시 제품은 준비 중이에요.</p>'}${button('전체 제품 보기','shop','text-btn')}</div></details><div class="wellness-section-art" aria-hidden="true">${wellnessArt(g.art)}</div></div><button class="guide-back-top" data-guide-top>건강 영역 다시 선택 ${wellnessIcon('up')}</button></section>`;
}
let guideScrollFrame=0;
function stopGuideScroll(){cancelAnimationFrame(guideScrollFrame);guideScrollFrame=0;}
function scrollToGuide(target){
  stopGuideScroll();
  const start=window.scrollY,end=Math.max(0,Math.min(start+target.getBoundingClientRect().top-20,document.documentElement.scrollHeight-window.innerHeight));
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){window.scrollTo({top:end,behavior:'instant'});return;}
  const started=performance.now();
  function tick(now){
    const progress=Math.min(1,(now-started)/320),ease=1-Math.pow(1-progress,3);
    window.scrollTo({top:start+(end-start)*ease,behavior:'instant'});
    if(progress<1)guideScrollFrame=requestAnimationFrame(tick);else guideScrollFrame=0;
  }
  guideScrollFrame=requestAnimationFrame(tick);
}
window.addEventListener('wheel',stopGuideScroll,{passive:true});
window.addEventListener('touchstart',stopGuideScroll,{passive:true});
window.addEventListener('keydown',stopGuideScroll);
window.addEventListener('hashchange',stopGuideScroll);
document.addEventListener('click',event=>{
  const toggle=event.target.closest('[data-nutrition-toggle]');
  if(toggle){
    const key=toggle.dataset.nutritionToggle,expanded=!nutritionExpanded[key];nutritionExpanded[key]=expanded;
    toggle.setAttribute('aria-expanded',String(expanded));
    const panel=toggle.closest('.nutrition-panel');panel.querySelector('.nutrition-panel-body').hidden=!expanded;panel.querySelector('.nutrition-panel-chips').hidden=expanded;
  }
  const jump=event.target.closest('[data-guide-jump]'),top=event.target.closest('[data-guide-top]');
  if(jump||top){
    if(jump&&document.querySelector('.ai-guide-page')){openFinalGuide(jump.dataset.guideJump,true);return;}
    const target=document.getElementById(jump?'guide-'+jump.dataset.guideJump:'guide-navigation');if(!target)return;
    const focus=jump?target.querySelector('h2'):target.querySelector('[data-guide-jump]');
    focus?.focus({preventScroll:true});
    scrollToGuide(top?(document.querySelector('.top')||target):target);
  }
});
const renderBeforeWellness=render;
render=function(){renderBeforeWellness();if(['analysis','nutrients','guide'].includes(route())){document.querySelector('.top h2').textContent='분석';document.title=(route()==='guide'?'AI 가이드':'종합 분석')+' · VITAME';}};
// Period navigation uses calendar boundaries, not fixed millisecond months.
const chartPeriods=[['day','1일'],['week','1주'],['month','1개월'],['half','6개월'],['year','1년']];
let chartPeriod='day',chartAnchor=dateKey(),chartSelection=null,guideCharacter=0,guideVisit=0;
function periodStart(key,kind=chartPeriod){
  const d=new Date(key+'T12:00:00');
  if(kind==='week')d.setDate(d.getDate()-d.getDay());
  if(['month','half','year'].includes(kind))d.setDate(1);
  if(kind==='half')d.setMonth(Math.floor(d.getMonth()/6)*6);
  if(kind==='year')d.setMonth(0);
  return dateKey(d);
}
function periodOffset(key,n,kind=chartPeriod){
  const d=new Date(periodStart(key,kind)+'T12:00:00');
  if(kind==='day'||kind==='week')d.setDate(d.getDate()+n*(kind==='week'?7:1));
  else d.setMonth(d.getMonth()+n*({month:1,half:6,year:12}[kind]));
  return dateKey(d);
}
function periodLabel(key,short=false){
  const d=new Date(key+'T12:00:00'),m=d.getMonth()+1,day=d.getDate(),year=d.getFullYear();
  if(chartPeriod==='year')return `${year}년`;
  if(chartPeriod==='half')return `${year} ${m===1?'상반기':'하반기'}`;
  if(chartPeriod==='month')return short?`${m}월`:`${year}년 ${m}월`;
  return `${short?'':year+'년 '}${m}/${day}${chartPeriod==='week'?' 주':''}`;
}
function periodScore(key){
  if(key>periodStart(dateKey()))return null;
  let hash=0;for(const c of chartPeriod+key)hash=(hash*31+c.charCodeAt(0))>>>0;
  return 57+hash%29;
}
function periodChart(){
  const anchor=periodStart(chartAnchor),keys=Array.from({length:7},(_,i)=>periodOffset(anchor,i-3));
  return `<div class="period-chart" aria-label="${chartPeriods.find(p=>p[0]===chartPeriod)[1]} 단위 예시 그래프"><div class="chart-scale" aria-hidden="true"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div class="month-bars">${keys.map((key,i)=>{
    const score=periodScore(key),picked=key===chartSelection;
    return `<div class="period-column ${i<2?'edge-left':i>4?'edge-right':''}"><button class="month-bar ${key===anchor?'current':''} ${picked?'picked':''}" data-period-bar="${key}" aria-pressed="${picked}" aria-label="${periodLabel(key)} ${score===null?'기록 없음':score+'점'}" ${score===null?'disabled':''}><span class="month-bar-track"><i style="--bar-height:${score??4}%"></i></span><span class="month-bar-label">${periodLabel(key,true)}</span></button>${picked?`<div class="period-tooltip" role="status" style="bottom:calc(30px + ${score*1.5}px)"><small>${periodLabel(key)}</small><b>${score}점</b><span>선택한 기간의 예시 점수</span></div>`:''}</div>`;
  }).join('')}</div></div>`;
}
analysis=function(){
  const anchor=periodStart(chartAnchor),score=periodScore(anchor);
  return `${analysisTabs()}<div class="analysis-periods" aria-label="분석 기간">${chartPeriods.map(([id,label])=>`<button data-chart-period="${id}" aria-pressed="${chartPeriod===id}">${label}</button>`).join('')}</div><div class="analysis-overview"><div class="period-navigation"><button data-period-step="-1" aria-label="이전 기간">${icon('back')}</button><span>${periodLabel(anchor)}</span><button data-period-step="1" aria-label="다음 기간" ${anchor>=periodStart(dateKey())?'disabled':''}>${icon('arrow')}</button></div><p class="analysis-score-label">선택한 기간 건강 관리 점수 <button data-period-info aria-label="건강 관리 점수 안내">${icon('info')}</button></p><h1 class="analysis-month-score">${score}점</h1><p class="analysis-month-description">나의 복용 루틴을 돌아보세요.<br>화면 체험을 위한 <b>예시 점수</b>예요.</p>${periodChart()}<p class="period-hint">좌우로 넘겨 기간을 이동하고, 막대를 눌러 확인해보세요.</p></div><div class="nutrition-panels">${analysisGroups.map(nutritionCard).join('')}</div><section class="analysis-guide-cta"><h3>이제 관리 방법을 알아볼까요?</h3><p>나에게 맞는 관리 가이드를 살펴보세요.</p>${button('AI 가이드 보러가기','guide')}</section>${note()}`;
};
nutrientPage=analysis;
function moveChart(step){
  const next=periodOffset(chartAnchor,step);
  if(next>periodStart(dateKey())||next<'2000-01-01')return;
  chartAnchor=next;chartSelection=null;render();
  const chart=document.querySelector('.period-chart');
  if(chart&&!matchMedia('(prefers-reduced-motion: reduce)').matches)chart.animate([{opacity:.5,transform:`translateX(${step*18}px)`},{opacity:1,transform:'translateX(0)'}],{duration:220,easing:'ease-out'});
}
function guideOrbit(){
  const selected=wellnessGuides.filter(g=>state.interests.includes(g.interest));
  return `<button class="guide-hero-art" data-guide-character aria-label="캐릭터 바꾸기">${wellnessArt(guideCharacter)}</button>${selected.map((g,i)=>{
    const angle=-Math.PI/2+2*Math.PI*i/selected.length;
    const status=g.names.map(n=>nutrients.find(v=>v[0]===n)).find(n=>n&&n[2]!=='적정');
    return `<button class="guide-orbit-node tone-${g.color}" style="left:${50+39*Math.cos(angle)}%;top:${50+39*Math.sin(angle)}%" data-guide-jump="${g.id}"><span>${wellnessIcon(g.symbol)}</span><b>${g.title}</b><small class="${status?(status[2]==='부족'?'low':'high'):'ok'}">${status?esc(status[0])+' '+status[2]:'적정'} · 예시</small></button>`;
  }).join('')}${selected.length?'':'<p class="orbit-empty">관심 건강을 아래에서 추가해보세요</p>'}`;
}
function guideAvailable(){return wellnessGuides.filter(g=>!state.interests.includes(g.interest)).map(g=>`<button class="guide-jump-chip tone-${g.color}" data-guide-add="${g.id}" aria-label="${g.title} 관심 건강에 추가"><span>${wellnessIcon(g.symbol)}</span>${g.title}<span class="add-symbol" aria-hidden="true">+</span></button>`).join('')||'<p>모든 관심 건강을 추가했어요.</p>';}
function refreshedGuideSection(g,index){
  // Rotate reviewed example prompts on a new visit, never manufacture a diagnosis.
  const statuses=g.names.map(name=>nutrients.find(n=>n[0]===name)).filter(Boolean);
  const caution=statuses.find(n=>n[2]==='주의'),low=statuses.find(n=>n[2]==='부족');
  const variants=caution?[
    `${caution[0]}: 주의로 표시된 예시예요. 여러 제품의 성분표를 함께 확인해보세요.`,
    `${caution[0]}가 겹쳐 들어 있는 제품이 있는지 등록 목록을 살펴보세요.`
  ]:low?[
    `${low[0]}: 부족으로 표시된 예시예요. 먼저 등록한 함량과 단위를 확인해보세요.`,
    `${low[0]}의 예시 수치와 실제 제품 표시가 같은지 확인해보세요.`
  ]:['등록한 제품 정보가 최신인지 확인해보세요.','지금의 복용 기록을 빠뜨리지 않고 이어가보세요.'];
  let html=guideSection(g,index);
  html=html.replace('등록한 제품의 성분과 표시된 섭취량을 확인해보세요.',variants[guideVisit%variants.length]);
  html=html.replace('평소 식사를 기록해 나의 식사 패턴을 살펴보세요.',guideVisit%2?'오늘 먹은 식품을 기록하고 지난 기록과 비교해보세요.':'식사 기록에서 자주 반복되는 메뉴를 살펴보세요.');
  html=html.replace(/<div class="wellness-section-art"[\s\S]*?<\/div><\/div><button class="guide-back-top"[\s\S]*?<\/button><\/section>$/, '</div></section>');
  // Only the three advice summaries use this exact trailing arrow markup.
  html=html.replaceAll(`${icon('arrow')}</summary>`,`${wellnessIcon('chevron')}</summary>`);
  return html;
}
guide=function(){
  const preferred=wellnessGuides.filter(g=>state.interests.includes(g.interest));
  const ordered=[...preferred,...wellnessGuides.filter(g=>!preferred.includes(g))];
  return `${analysisTabs(true)}<div class="ai-guide-page"><section class="ai-guide-hero" id="guide-navigation"><h1>${esc(state.name)} 님,<br>오늘도 잘 하고 있어요!</h1><div class="ai-character-stage">${finalGuideCharacters()}</div><section class="ai-interests"><div class="ai-interest-heading"><div><h2>나의 관심 건강</h2><p>버튼을 눌러 가이드로 이동해보세요</p></div><button data-go="profile"><img src="assets/care/edit.svg" alt="">편집</button></div><div class="ai-interest-tags">${(preferred.length?preferred:ordered).map(g=>`<button data-guide-jump="${g.id}">${finalGuideIcon(g)}<span>${g.id==='eyes'?'눈':g.title}</span></button>`).join('')}</div></section><span class="ai-guide-down" aria-hidden="true">${wellnessIcon('chevron')}</span></section><div class="ai-guide-cards">${ordered.map(finalGuideCard).join('')}</div></div><button class="guide-fixed-top" data-guide-top aria-label="맨 위로 이동">${wellnessIcon('up')}<span>맨 위</span></button>`;
};

// Reuse setup artwork and the existing data/catalog; no generated AI diagnosis.
function finalGuideIcon(g){
  const option=initialHealthOptions.find(o=>o[1]===g.interest);
  return `<span class="ai-health-icon" style="--health-tint:var(--vitame-color-accent-${option[3]}-light)"><img src="${setupAsset(option[2])}" alt=""></span>`;
}
function finalGuideCharacters(){
  const keys=['bad','very-bad','good','normal','very-good'],i=guideCharacter%keys.length;
  return `<button class="ai-guide-message" data-ai-character="1">관심 건강의 관리 습관을 살펴보세요<img src="assets/setup/refresh.svg" alt=""></button><img class="ai-bubble-tail" src="assets/setup/bubble-tail.svg" alt=""><div class="ai-character-row"><button data-ai-character="-1" aria-label="이전 캐릭터">${icon('back')}</button><div class="ai-character-side" aria-hidden="true">${initialCharacter(keys[(i+keys.length-1)%keys.length])}</div><button class="ai-character-main" data-ai-character="1" aria-label="다음 캐릭터">${initialCharacter(keys[i])}</button><div class="ai-character-side" aria-hidden="true">${initialCharacter(keys[(i+1)%keys.length])}</div><button data-ai-character="1" aria-label="다음 캐릭터 보기">${icon('arrow')}</button></div><img class="ai-character-shadow" src="assets/setup/shadow.svg" alt="">`;
}
function finalGuideCard(g){
  // nutrients is explicitly an illustrative dataset, not personal AI analysis.
  const current=state.demo?g.names.map(name=>nutrients.find(n=>n[0]===name)).filter(Boolean):[];
  const related=products.filter(p=>g.names.includes(p.nutrient));
  return `<section class="ai-guide-card" id="guide-${g.id}"><h2><button class="ai-guide-toggle" data-ai-guide-toggle="${g.id}" aria-expanded="false" aria-controls="ai-guide-body-${g.id}">${finalGuideIcon(g)}<span>${esc(g.title)} 가이드</span>${wellnessIcon('chevron')}</button></h2><p class="ai-guide-description">${esc(g.description)}</p><div class="ai-guide-reveal" id="ai-guide-body-${g.id}" inert aria-hidden="true"><div class="ai-guide-inner"><div class="ai-guide-details"><div class="ai-guide-status">${current.length?`<small>예시 분석 · 개인 분석 결과가 아니에요</small>${current.map(n=>`<div class="ai-guide-nutrient" data-status="${n[2]}"><button data-action="nutrient" data-name="${esc(n[0])}">${esc(n[0])}</button><span class="ai-guide-track" role="meter" aria-label="${esc(n[0])} 예시 섭취 비율" aria-valuemin="0" aria-valuemax="${Math.max(100,n[1])}" aria-valuenow="${n[1]}"><i style="width:${Math.max(0,Math.min(n[1],100))}%"></i></span><span>${n[1]}%</span><b>${n[2]}</b></div>`).join('')}`:'<p>아직 확인할 수 있는 개인 분석 데이터가 없어요.</p>'}</div><p class="ai-guide-copy">${esc(g.food)}<br><br>${esc(g.habit)}</p><div class="ai-guide-tips">${[['very-good','채워보기',g.food],['bad','함께 확인','등록한 제품의 성분과 표시된 섭취량을 확인해보세요.'],['normal','오늘의 루틴',g.habit]].map(([key,title,copy])=>`<div class="ai-guide-tip"><div class="ai-tip-character" aria-hidden="true">${initialCharacter(key)}</div><div><small>${title}</small><p>${esc(copy)}</p></div></div>`).join('')}</div><section class="ai-guide-products"><div class="ai-product-heading"><div><h3>${esc(g.title)} 추천 제품</h3><p>관련 성분의 등록 제품을 확인해보세요.</p></div><button data-go="shop">전체보기 ${icon('arrow')}</button></div><div class="ai-product-grid">${related.length?related.map(p=>`<button class="ai-product" data-action="product" data-id="${p.id}"><span class="ai-product-art">${bottle(p)}</span><span>VITAME</span><span>${esc(p.name)}</span><strong>${money(p.price)}</strong></button>`).join(''):'<p>관련 제품이 아직 없어요.</p>'}</div></section></div></div></div></section>`;
}
let finalGuideScrollTimer;
function openFinalGuide(id,jump=false){
  const target=document.getElementById('guide-'+id);if(!target)return;
  const opening=jump||target.querySelector('[data-ai-guide-toggle]').getAttribute('aria-expanded')!=='true';
  clearTimeout(finalGuideScrollTimer);stopGuideScroll();
  document.querySelectorAll('.ai-guide-card').forEach(card=>{
    const expanded=card===target&&opening,body=card.querySelector('.ai-guide-reveal');
    card.querySelector('[data-ai-guide-toggle]').setAttribute('aria-expanded',String(expanded));
    card.classList.toggle('is-open',expanded);body.inert=!expanded;body.setAttribute('aria-hidden',String(!expanded));
  });
  if(jump){
    target.querySelector('[data-ai-guide-toggle]').focus({preventScroll:true});
    // Wait for both cards' heights to settle before measuring the scroll target.
    finalGuideScrollTimer=setTimeout(()=>{if(target.isConnected)scrollToGuide(target);},matchMedia('(prefers-reduced-motion: reduce)').matches?0:280);
  }
}
document.addEventListener('click',event=>{
  if(route()!=='guide')return;
  const toggle=event.target.closest('[data-ai-guide-toggle]');if(toggle)openFinalGuide(toggle.dataset.aiGuideToggle);
  const character=event.target.closest('[data-ai-character]');
  if(character){guideCharacter=(guideCharacter+Number(character.dataset.aiCharacter)+5)%5;document.querySelector('.ai-character-stage').innerHTML=finalGuideCharacters();}
});
window.addEventListener('hashchange',()=>clearTimeout(finalGuideScrollTimer));
window.addEventListener('touchstart',()=>clearTimeout(finalGuideScrollTimer),{passive:true});
window.addEventListener('wheel',()=>clearTimeout(finalGuideScrollTimer),{passive:true});
function addGuide(id){
  const g=wellnessGuides.find(g=>g.id===id);if(!g||state.interests.includes(g.interest))return;
  state.interests.push(g.interest);save();
  document.querySelector('.guide-health-map').innerHTML=guideOrbit();
  document.querySelector('.guide-available').innerHTML=guideAvailable();
  document.querySelector('.guide-add-status').textContent=`${g.title}을 관심 건강에 추가했어요.`;
}
let wellnessDrag=null,suppressWellnessClickUntil=0;
document.addEventListener('pointerdown',e=>{
  const chip=e.target.closest('[data-guide-add]'),chart=e.target.closest('.period-chart');
  if(e.button!==0||(!chip&&!chart))return;
  wellnessDrag={node:chip||chart,id:e.pointerId,x:e.clientX,y:e.clientY,chip,moved:false};
});
document.addEventListener('pointermove',e=>{
  const d=wellnessDrag;if(!d||d.id!==e.pointerId)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;
  if(!d.chip&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>10){wellnessDrag=null;return;}
  if(Math.hypot(dx,dy)<8&&!d.moved)return;
  d.moved=true;d.node.setPointerCapture(e.pointerId);
  if(d.chip){d.node.style.transform=`translate(${dx}px,${dy}px)`;d.node.classList.add('dragging');document.querySelector('.guide-health-map')?.classList.add('drop-ready');}
});
function finishWellnessDrag(e){
  const d=wellnessDrag;if(!d||d.id!==e.pointerId)return;wellnessDrag=null;
  d.node.style.transform='';d.node.classList.remove('dragging');
  const map=document.querySelector('.guide-health-map');map?.classList.remove('drop-ready');
  if(!d.moved)return;suppressWellnessClickUntil=performance.now()+450;
  if(e.type==='pointercancel')return;
  if(d.chip&&map){const r=map.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)addGuide(d.chip.dataset.guideAdd);}
  else if(Math.abs(e.clientX-d.x)>45)moveChart(e.clientX<d.x?1:-1);
}
document.addEventListener('pointerup',finishWellnessDrag);
document.addEventListener('pointercancel',finishWellnessDrag);
window.addEventListener('hashchange',()=>{wellnessDrag=null;if(route()==='guide')guideVisit++;});
document.addEventListener('click',e=>{
  if(performance.now()<suppressWellnessClickUntil&&e.target.closest('[data-guide-add],.period-chart')){e.preventDefault();return;}
  const period=e.target.closest('[data-chart-period]'),step=e.target.closest('[data-period-step]'),bar=e.target.closest('[data-period-bar]'),add=e.target.closest('[data-guide-add]'),character=e.target.closest('[data-guide-character]');
  if(period){chartPeriod=period.dataset.chartPeriod;chartAnchor=dateKey();chartSelection=null;render();}
  if(step&&!step.disabled)moveChart(Number(step.dataset.periodStep));
  if(bar&&!bar.disabled){chartSelection=bar.dataset.periodBar;document.querySelector('.period-chart').outerHTML=periodChart();document.querySelector(`[data-period-bar="${chartSelection}"]`)?.focus({preventScroll:true});}
  if(add)addGuide(add.dataset.guideAdd);
  if(character){guideCharacter=(guideCharacter+1)%5;character.innerHTML=wellnessArt(guideCharacter);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)character.firstElementChild.animate([{transform:'scale(.55)',opacity:.4},{transform:'scale(1.12)',opacity:1},{transform:'scale(1)',opacity:1}],{duration:330,easing:'ease-out'});}
  if(e.target.closest('[data-period-info]'))modal('건강 관리 점수 안내','기간별 점수와 영양소 상태는 화면 체험용 예시입니다. 실제 복용 기록으로 계산한 결과나 의료 평가가 아닙니다.');
});
render();
