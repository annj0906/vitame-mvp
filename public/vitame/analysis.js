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
  {id:'energy',title:'에너지',interest:'에너지',symbol:'bolt',color:'yellow',art:3,names:['비타민 D','마그네슘'],description:'에너지를 위한 일상 관리 습관을 살펴보세요.',food:'끼니를 거르지 않고 다양한 식품을 골고루 챙겨보세요.',habit:'가벼운 움직임과 휴식 시간을 일상에 더해보세요.'},
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
    const panel=toggle.closest('.nutrition-panel'),body=panel.querySelector('.nutrition-panel-body'),chips=panel.querySelector('.nutrition-panel-chips');
    const startHeight=panel.getBoundingClientRect().height;
    panel.getAnimations().forEach(a=>a.cancel());
    body.hidden=!expanded;chips.hidden=expanded;
    const motionId=String(Number(body.dataset.motionId||0)+1);body.dataset.motionId=motionId;
    const endHeight=panel.getBoundingClientRect().height;
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
      panel.animate([{height:startHeight+'px'},{height:endHeight+'px'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});
      if(expanded)animateNutrientRows(body);
    }
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
let chartPeriod='week',chartAnchor=dateKey(),chartSelection=null,guideCharacter=0,guideVisit=0;
function chartUnit(){return {week:'day',month:'week',half:'month',year:'year',day:'day'}[chartPeriod];}
function periodStart(key,kind=chartUnit()){
  const d=new Date(key+'T12:00:00');
  if(kind==='week')d.setDate(d.getDate()-d.getDay());
  if(['month','half','year'].includes(kind))d.setDate(1);
  if(kind==='half')d.setMonth(Math.floor(d.getMonth()/6)*6);
  if(kind==='year')d.setMonth(0);
  return dateKey(d);
}
function periodOffset(key,n,kind=chartUnit()){
  const d=new Date(periodStart(key,kind)+'T12:00:00');
  if(kind==='day'||kind==='week')d.setDate(d.getDate()+n*(kind==='week'?7:1));
  else d.setMonth(d.getMonth()+n*({month:1,half:6,year:12}[kind]));
  return dateKey(d);
}
function periodLabel(key,short=false){
  const d=new Date(key+'T12:00:00'),m=d.getMonth()+1,day=d.getDate(),year=d.getFullYear();
  if(chartPeriod==='year')return `${year}년`;
  if(chartPeriod==='half')return short?`${m}월`:`${year}년 ${m}월`;
  if(chartPeriod==='month')return `${m}월 ${Math.ceil(day/7)}주`;
  if(chartPeriod==='week')return short?['일','월','화','수','목','금','토'][d.getDay()]:`${year}년 ${m}/${day}`;
  return `${short?'':year+'년 '}${m}/${day}${chartPeriod==='month'?' 주':''}`;
}
function periodScore(key){
  if(key>periodStart(dateKey()))return null;
  let hash=0;for(const c of chartPeriod+key)hash=(hash*31+c.charCodeAt(0))>>>0;
  if(chartPeriod==='week'){
    // Stable illustrative daily variation, never a personal health measurement.
    hash=Math.imul(hash^(hash>>>16),0x45d9f3b)>>>0;
    hash=Math.imul(hash^(hash>>>16),0x45d9f3b)>>>0;
    return 10+((hash^(hash>>>16))>>>0)%87;
  }
  return 57+hash%29;
}
function periodChart(){
  const anchor=periodStart(chartAnchor),start=chartPeriod==='week'?periodStart(chartAnchor,'week'):periodOffset(anchor,-3);
  const keys=Array.from({length:7},(_,i)=>periodOffset(start,i));
  const referenceScore=periodScore(chartSelection||anchor);
return `<div class="period-chart" data-period-kind="${chartPeriod}" aria-label="${chartPeriods.find(p=>p[0]===chartPeriod)[1]} 단위 예시 그래프"><p class="period-hint">좌우로 넘겨 기간을 이동하고, 막대를 눌러 확인해보세요.</p><div class="period-plot"><div class="chart-scale" aria-hidden="true"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><span class="period-reference-line" style="--reference-top:${150*(1-(referenceScore??0)/100)}px" aria-hidden="true"><img src="assets/care/analysis-reference-line.svg" alt=""></span><div class="month-bars">${keys.map((key,i)=>{
    const score=periodScore(key),picked=key===chartSelection,highlight=key===(chartSelection||anchor);
    const label=periodLabel(key,true);
    return `<div class="period-column ${i<2?'edge-left':i>4?'edge-right':''}"><button class="month-bar ${highlight?'current':''} ${picked?'picked':''}" data-period-bar="${key}" aria-pressed="${picked}" aria-label="${periodLabel(key)} ${score===null?'기록 없음':score+'점'}" ${score===null?'disabled':''}><span class="month-bar-track"><i style="--bar-height:${score??4}%"></i></span><span class="month-bar-label">${label}</span></button>${picked?`<div class="period-tooltip" role="status" style="bottom:calc(28px + ${score*1.5}px + 8px)"><small>${periodLabel(key)}</small><b>${score}<span>점</span></b></div>`:''}</div>`;
  }).join('')}</div></div></div>`;
}
function analysisScoreDate(key){
  if(['month','half','year'].includes(chartPeriod))return periodLabel(key);
  const d=new Date(key+'T12:00:00');return `${d.getMonth()+1}월 ${d.getDate()}일`;
}
function analysisScoreMessage(score){
  if(score===null)return '아직 기록이 없어요.<br>복용 기록을 시작해보세요.';
  return score>=80?'꾸준히 관리하고 있어요.<br>지금의 복용 습관을 유지해보세요.':score>=60?'균형을 찾아가는 중이에요.<br>복용을 유지해보세요.':'작은 습관부터 시작해봐요.<br>복용 기록을 차근차근 이어가세요.';
}
let analysisScoreFrame=0,analysisDisplayedKey='';
function updateAnalysisScore(entering=false){
  const key=chartSelection||periodStart(chartAnchor),score=periodScore(key);
  const heading=document.querySelector('.analysis-month-score');
  if(!heading)return;
  cancelAnimationFrame(analysisScoreFrame);
  document.querySelector('.analysis-score-label').textContent=analysisScoreDate(key);
  document.querySelector('.analysis-month-description').innerHTML=analysisScoreMessage(score);
  heading.innerHTML=`<span>${score??'—'}</span><small>점</small>`;
  heading.setAttribute('aria-label',score===null?'기록 없음':`${score}점`);
  const number=heading.querySelector('span');
  number.setAttribute('aria-hidden','true');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced&&score!==null&&(entering||analysisDisplayedKey!==`${chartPeriod}:${key}`)){
    const start=performance.now();number.textContent='0';
    const tick=now=>{
      if(!number.isConnected)return;
      const progress=Math.min(1,(now-start)/650);
      number.textContent=String(Math.round(score*(1-Math.pow(1-progress,3))));
      if(progress<1)analysisScoreFrame=requestAnimationFrame(tick);
    };
    analysisScoreFrame=requestAnimationFrame(tick);
  }
  analysisDisplayedKey=`${chartPeriod}:${key}`;
  if(entering&&!reduced)document.querySelectorAll('.period-chart .month-bar-track i').forEach((bar,index)=>{
    bar.animate([{transform:'scaleY(0)',transformOrigin:'bottom'},{transform:'scaleY(1)',transformOrigin:'bottom'}],{duration:650,delay:index*85,fill:'backwards',easing:'cubic-bezier(.22,1,.36,1)'});
  });
}
analysis=function(){
  const anchor=chartSelection||periodStart(chartAnchor),score=periodScore(anchor);
return `${analysisTabs()}<div class="analysis-periods" aria-label="분석 기간">${chartPeriods.filter(([id])=>id!=='day').map(([id,label])=>`<button data-chart-period="${id}" aria-pressed="${chartPeriod===id}">${label}</button>`).join('')}</div><div class="analysis-overview"><p class="analysis-score-label">${analysisScoreDate(anchor)}</p><h1 class="analysis-month-score">${score}점</h1><p class="analysis-month-description">${analysisScoreMessage(score)}</p>${periodChart()}</div><div class="nutrition-panels">${analysisGroups.map(nutritionCard).join('')}</div><section class="analysis-guide-cta"><h3>이제 관리 방법을 알아볼까요?</h3><p>나에게 맞는 관리 가이드를 살펴보세요.</p>${button('AI 가이드 보러가기','guide')}</section>`;
};
nutrientPage=analysis;
function moveChart(step){
  const next=periodOffset(chartAnchor,step*7);
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
  if(!guideSessionActive){Object.keys(guideVisitMessages).forEach(key=>delete guideVisitMessages[key]);guideSessionActive=true;}
  const preferred=wellnessGuides.filter(g=>state.interests.includes(g.interest));
  const ordered=[...preferred,...wellnessGuides.filter(g=>!preferred.includes(g))];
  return `${analysisTabs(true)}<div class="ai-guide-page"><section class="ai-guide-hero" id="guide-navigation"><h1>${esc(state.name)} 님,<br>오늘도 잘 하고 있어요!</h1><div class="ai-character-stage">${finalGuideCharacters()}</div><section class="ai-interests"><div class="ai-interest-heading"><div><h2>나의 관심 건강</h2><p>버튼을 눌러 가이드로 이동해보세요</p></div><button data-go="interest-settings"><img src="assets/care/edit.svg" alt="">편집</button></div><div class="ai-interest-tags">${preferred.map(g=>`<button data-guide-jump="${g.id}">${finalGuideIcon(g)}<span>${g.id==='eyes'?'눈':g.title}</span></button>`).join('')}</div></section><span class="ai-guide-down" aria-hidden="true">${wellnessIcon('chevron')}</span></section><div class="ai-guide-cards">${ordered.map(finalGuideCard).join('')}</div></div><button class="guide-fixed-top" data-guide-top aria-label="맨 위로 이동">${wellnessIcon('up')}<span>맨 위</span></button>`;
};

// Reuse setup artwork and the existing data/catalog; no generated AI diagnosis.
function finalGuideIcon(g, large=false){
  const option=initialHealthOptions.find(o=>o[1]===g.interest);
  const active={eyes:'eye',energy:'energy',sleep:'sleep',immune:'immunity',gut:'digestion'};
  const colored={brain:'brain',bones:'bones',skin:'skin',circulation:'circulation',muscles:'muscles'};
  if(large)return `<span class="ai-health-icon ai-health-icon-large" style="--health-tint:var(--vitame-color-accent-${setupHealthColors[option[2]]}-light)"><img src="assets/guide/${active[g.id]||colored[g.id]}-large-active.svg" alt=""></span>`;
  if(route()==='guide'&&colored[g.id])return `<span class="ai-health-icon" style="--health-tint:var(--vitame-color-accent-${setupHealthColors[option[2]]}-light)"><img src="assets/shop/${colored[g.id]}.svg" alt=""></span>`;
  const asset=active[g.id]?`assets/guide/${active[g.id]}${large&&g.id==='eyes'?'-large':''}-active.svg`:setupAsset(option[2]);
  return `<span class="ai-health-icon${large?' ai-health-icon-large':''}" style="--health-tint:var(--vitame-color-accent-${option[3]}-light)"><img src="${asset}" alt=""></span>`;
}
const guideCharacterKeys=['bad','very-bad','good','normal','very-good'];
const guideCharacterMessages={
'very-bad':[
['manyLow','헉?! 챙겨야 할 게 많잖아요! 어디부터 시작할지 같이 골라봐요!'],
['low','어어?! {영양소}가 신경 쓰여요! 이 친구부터 한번 챙겨볼까요?'],
['missed','잠깐만요오! 영양제들이 주인을 기다리고 있어요! 오늘은 잊지 말기!'],
['resumed','어?! 다시 챙기기 시작했네요? 휴우, 저 이제 조금 안심했어요!'],
['improved','세상에! 지난번보다 기록이 좋아졌잖아요! 저 괜히 걱정했네요!'],
['clear','휴우~ 예시 분석에는 걱정할 항목이 없네요. 다행이다, 정말!']],
bad:[
['neutral','으음… 오늘은 어떤 걸 먼저 챙겨볼까요? 제가 같이 살펴볼게요.'],
['low','저기… {영양소}가 조금 마음에 걸려요. 이것부터 살펴보면 어떨까요?'],
['manyLow','음… 몇 가지가 조금 아쉽네요. 그래도 하나씩 챙기면 되니까요.'],
['missed','혹시 요즘 많이 바빴나요…? 복용 기록이 조금 뜸해졌길래요.'],
['improved','어…? 다시 잘 챙기고 있네요. 저 혼자 괜한 걱정을 했나 봐요.'],
['clear','헤헤… 예시 분석에 좋은 소식이 있네요. 지금처럼 살펴봐요.']],
normal:[
['neutral','흠, 오늘 챙길 것부터 보죠. 몇 가지만 차분히 살펴봐요.'],
['low','{영양소}가 조금 아쉽군요. 뭐, 오늘부터 신경 쓰면 되죠.'],
['duplicate','잠깐, {영양소}가 여러 제품에 있네요. 중복되는지만 확인해두죠.'],
['irregular','챙긴 날도, 깜빡한 날도 있네요. 뭐, 다시 이어가면 됩니다.'],
['steady','오, 최근 기록은 꽤 일정하네요. 이런 건 인정해야죠.'],
['clear','흠, 예시 분석은 무난하네요. 더 욕심내지 말고 꾸준히 가보죠.']],
good:[
['optimal','오호, {영양소}도 잘 챙겨지고 있네요! 작은 습관들이 소중해요.'],
['manyOptimal','어머, 잘 챙기는 영양소가 이렇게 많다니! 하나하나 신경 쓴 게 느껴져요.'],
['steady','요즘 정말 꾸준하시네요! 제가 다 뿌듯해요. 이 흐름 놓치지 말아요!'],
['improved','지난주보다 더 자주 챙겼네요? 작은 변화지만 정말 멋진걸요!'],
['irregular','하루쯤 놓칠 수도 있죠. 잘해온 게 사라지는 건 아니니까요.'],
['low','잘하고 있는 부분도 있어요! 이제 {영양소}도 살펴볼까요?']],
'very-good':[
['manyOptimal','잠깐, 이거 실화예요?! 잘 챙긴 영양소가 이렇게 많다니!'],
['steady','와아아! 꾸준히 챙겼네요! 저 혼자 박수 치는 거 보이세요? 짝짝짝!'],
['weekComplete','대박! 이번 주 복용 올클리어! 오늘의 주인공은 바로 당신이에요!'],
['improved','오오?! 지난주보다 좋아졌잖아요! 이 성장세, 제가 응원할게요!'],
['steady','이야~ 요즘 루틴 고수인데요? 이 멋진 흐름 계속 이어가요!'],
['low','좋은 시작이에요! 이제 {영양소}까지 살펴보면 더 든든하겠어요!']]
};
let guideMessageIndex=0,guideSessionActive=false;
const guideDialogueCursor={},guideVisitMessages={};
function guideDialogueFacts(){
 const model=typeof state==='undefined'?{}:state,items=model.supplements||[],records=model.records||{};
 const data=typeof nutrients==='undefined'?[]:nutrients;
 const low=data.filter(n=>n[2]==='부족'),optimal=data.filter(n=>n[2]==='적정');
 const today=typeof dateKey==='function'?dateKey():null;
 const daily=today?Array.from({length:14},(_,i)=>{
   const d=new Date(today+'T12:00:00');d.setDate(d.getDate()-i);
   const due=items.filter(s=>!s.days?.length||s.days.includes(d.getDay())),row=records[dateKey(d)];
   return {known:due.length>0&&!!row&&due.every(s=>Object.prototype.hasOwnProperty.call(row,s.id)),done:due.filter(s=>row?.[s.id]===true).length,total:due.length};
 }):[];
 const recent=daily.slice(0,7),prior=daily.slice(7),seen=recent.filter(d=>d.known);
 const complete=recent.length===7&&recent.every(d=>d.known&&d.done===d.total);
 const rate=days=>days.reduce((a,d)=>a+d.done,0)/days.reduce((a,d)=>a+d.total,0);
 const duplicate=items.flatMap(s=>(s.ingredients||[]).map(n=>n.name)).find((name,i,all)=>all.indexOf(name)!==i);
 return {low:low[0]?.[0],optimal:optimal[0]?.[0],manyLow:low.length>1,manyOptimal:optimal.length>1,duplicate,neutral:true,
 clear:data.length>0&&!low.length&&!data.some(n=>n[2]==='주의'),
 missed:seen.some(d=>d.done<d.total),irregular:seen.some(d=>d.done>0)&&seen.some(d=>d.done<d.total),
 resumed:!!daily[0]?.known&&daily[0].done>0&&!!daily[1]?.known&&daily[1].done===0,
 improved:daily.length===14&&daily.every(d=>d.known)&&rate(recent)>rate(prior),steady:complete,
 weekComplete:!!today&&new Date(today+'T12:00:00').getDay()===6&&complete};
}
function guideCharacterMessage(){
 const key=guideCharacterKeys[guideCharacter];
 if(guideVisitMessages[key])return guideVisitMessages[key];
 const facts=guideDialogueFacts(),eligible=guideCharacterMessages[key].filter(([condition])=>facts[condition]);
 const fallback={bad:'으음… 오늘은 어떤 걸 먼저 챙겨볼까요? 제가 같이 살펴볼게요.',
 'very-bad':'앗! 서두르지 않아도 괜찮아요. 챙길 것부터 같이 살펴봐요!',
 normal:'흠, 기록부터 차분히 살펴보죠. 아직 모르는 상태는 단정하지 않을게요.',
 good:'오, 만나서 반가워요! 내 페이스에 맞는 작은 습관부터 찾아봐요.',
 'very-good':'와아아! 오늘도 반가워요! 무리하지 말고 가볍게 시작해요!'};
 const cursor=guideDialogueCursor[key]||0,selected=eligible.length?eligible[cursor%eligible.length]:null;
 const text=selected?selected[1].replace('{영양소}',facts[selected[0]]||facts.low||facts.optimal):fallback[key];
 guideDialogueCursor[key]=cursor+1;
 return guideVisitMessages[key]=text;
}
window.addEventListener('hashchange',()=>{if(route()!=='guide')guideSessionActive=false;});
function finalGuideCharacters(){
  return `<button class="ai-guide-message" data-ai-refresh aria-label="캐릭터 안내 새로고침"><span aria-live="polite">${guideCharacterMessage()}</span><img src="assets/setup/refresh.svg" alt=""></button><img class="ai-bubble-tail" src="assets/setup/bubble-tail.svg" alt=""><div class="ai-character-viewport" aria-label="캐릭터 캐러셀">${guideCharacterKeys.map((key,i)=>{const position=((i-guideCharacter+7)%5)-2;return `<div class="ai-character-item" data-ai-item="${i}" style="--position:${position};--scale:${position===0?1:.55};--opacity:${Math.abs(position)>1?0:position===0?1:.45};--blur:${position===0?0:3}px"><button class="ai-character-main" data-ai-tap aria-label="${key} 캐릭터 터치" tabindex="${position===0?0:-1}" ${position===0?'':'disabled'}>${initialCharacter(key)}</button>${characterShadow(key,'ai-character-shadow')}</div>`;}).join('')}</div><button class="ai-character-prev" data-ai-character="-1" aria-label="이전 캐릭터">${icon('back')}</button><button class="ai-character-next" data-ai-character="1" aria-label="다음 캐릭터 보기">${icon('arrow')}</button>`;
}
const eyeGuideContent={
  paragraphs:[
    '{analysis} 부족한 영양소를 바로 영양제로 추가하기보다 평소 식사에서 쉽게 만날 수 있는 음식으로 조금씩 보완해보세요. 당근이나 달걀, 시금치처럼 자주 먹는 식재료부터 챙겨도 충분해요.',
    '화면을 오래 보는 날에는 영양 관리와 함께 눈을 쉬게 해주는 습관도 중요해요. 중간중간 먼 곳을 바라보거나 잠깐 화면에서 시선을 떼어보세요. 완벽하게 관리하려고 하기보다 지금 내 상태에 필요한 것부터 하나씩 바꿔가는 게 좋아요.'
  ],
  tips:[['very-bad','채워보기','비타민 A는 영양제보다 식사에서 먼저 채워봐요'],['bad','잠깐 확인','오메가-3도 현재보다 조금 더 챙겨도 좋아요'],['normal','오늘의 루틴','오후에 화면을 오래 본 날엔 눈 쉬는 시간을 챙겨봐요']]
};
// General lifestyle guidance, not a diagnosis or a personalized dosage plan.
const categoryGuideContent={
  energy:{paragraphs:['{analysis} 영양제를 바로 추가하기보다 달걀, 생선, 견과류처럼 일상에서 쉽게 먹을 수 있는 식품부터 골고루 챙겨보세요.','활력이 떨어지는 날에는 생활 리듬을 돌아보는 것도 중요해요. 규칙적으로 식사하고, 중간중간 가볍게 몸을 움직여보세요. 충분한 수면과 작은 움직임이 모여 더 건강한 하루를 만들어줄 거예요.'],tips:[['','채워보기','비타민 D는 달걀과 생선으로 챙겨봐요'],['','잠깐 확인','마그네슘은 견과류와 콩류로 보충해보세요'],['','오늘의 루틴','오후에 10분만 가볍게 걸어보세요']]},
  sleep:{paragraphs:['{analysis} 영양제를 바로 추가하기보다 견과류, 콩류, 통곡물처럼 일상에서 쉽게 먹을 수 있는 식품부터 챙겨보세요.','수면 리듬이 흐트러질 때는 생활 습관을 돌아보는 것도 중요해요. 일정한 시간에 잠자리에 들고, 잠들기 전에는 화면을 잠시 멀리해보세요. 가벼운 스트레칭이나 깊은 호흡으로 하루를 마무리하는 것도 좋아요.'],tips:[['','채워보기','마그네슘은 견과류와 콩류로 챙겨보세요'],['','잠깐 확인','비타민 B6가 중복으로 들어 있는지 확인해보세요'],['','오늘의 루틴','잠들기 30분 전, 화면 대신 가볍게 스트레칭 해보세요']]},
  brain:{paragraphs:['집중이 필요한 날에는 한 가지 영양소만 챙기기보다 평소 식사와 휴식의 균형을 함께 살펴보세요. 생선, 달걀, 콩류처럼 익숙한 식품을 식탁에 다양하게 곁들이면 좋아요. 바쁜 일정 때문에 끼니를 건너뛰고 있지는 않은지 돌아보고, 간단한 식사부터 규칙적으로 챙겨보세요.','오랫동안 한 가지 일에 몰두했다면 잠시 자리에서 일어나 몸을 움직여보세요. 쉬는 동안에는 화면에서도 눈을 떼고, 다시 시작할 일을 하나만 정해보는 것도 좋아요. 무리하게 집중 시간을 늘리기보다 나에게 편안한 활동과 휴식의 리듬을 찾아가는 게 중요해요.'],tips:[['','채워보기','생선과 달걀, 콩류를 식사에 골고루 곁들여봐요'],['','잠깐 확인','오메가-3와 비타민 B6가 여러 제품에 겹치는지 확인해요'],['','오늘의 루틴','집중하는 시간 사이에 잠시 일어나 몸과 시선을 쉬게 해줘요']]},
  gut:{paragraphs:['편안한 식사 습관을 만들고 싶다면 먼저 자주 먹는 메뉴와 식사 시간을 살펴보세요. 채소, 과일, 통곡물처럼 여러 식품을 골고루 곁들이고, 익숙하지 않은 식품은 편안하게 먹을 수 있는 양부터 시작해보세요. 특정 식품이나 영양제를 한꺼번에 늘리기보다 식사 뒤의 느낌을 기록해보면 좋아요.','바쁘게 먹는 날에는 잠시 화면을 내려놓고 천천히 씹는 데 집중해보세요. 끼니를 건너뛰거나 늦은 시간에 몰아서 먹는 날이 잦은지도 함께 돌아보면 좋아요. 다른 사람의 식사법을 그대로 따르기보다 내 일상에서 편안하게 이어갈 수 있는 리듬을 찾아보세요.'],tips:[['','채워보기','익숙한 식사에 채소와 통곡물을 조금씩 곁들여봐요'],['','잠깐 확인','등록한 제품의 성분과 섭취 방법을 실제 표시와 비교해요'],['','오늘의 루틴','식사할 때 화면을 내려놓고 천천히 씹는 시간을 가져봐요']]},
  bones:{paragraphs:['뼈와 관절을 위한 관리는 평소 식사를 돌아보는 작은 습관에서 시작해보세요. 우유, 두부처럼 칼슘이 포함된 식품과 달걀, 생선 등 다양한 식품을 골고루 곁들이면 좋아요. 영양제를 더하기 전에는 이미 먹고 있는 제품에 칼슘과 비타민 D가 함께 들어 있는지도 확인해보세요.','오래 앉아 있었다면 중간중간 자리에서 일어나 몸을 가볍게 풀어보세요. 활동량을 갑자기 늘리기보다 내 몸에 무리가 없는 움직임부터 꾸준히 이어가는 게 좋아요. 활동한 뒤 불편함이 있었다면 무리하지 말고 쉬어가며, 편안하게 할 수 있는 범위에서 일상의 리듬을 만들어보세요.'],tips:[['','채워보기','우유와 두부처럼 칼슘이 포함된 식품을 식사에 더해봐요'],['','잠깐 확인','칼슘과 비타민 D가 여러 제품에 중복되는지 확인해요'],['','오늘의 루틴','오래 앉아 있는 중간에 일어나 편안한 범위에서 몸을 풀어봐요']]},
  immune:{paragraphs:['일상의 기본을 챙기고 싶다면 특정 영양소만 늘리기보다 식사와 휴식을 함께 살펴보세요. 채소, 과일, 단백질 식품을 골고루 곁들이고, 바쁜 날에도 끼니를 거르지 않을 방법을 찾아보면 좋아요. 비타민 C나 아연 제품을 먹고 있다면 다른 제품과 성분이 겹치지 않는지도 확인해보세요.','일정이 빽빽한 날에는 해야 할 일뿐 아니라 쉬는 시간도 미리 남겨두세요. 잠드는 시간과 일어나는 시간이 자주 달라지는지 돌아보고, 편안하게 유지할 수 있는 생활 리듬을 만들어보면 좋아요. 하루를 완벽하게 관리하려 하기보다 오늘 챙길 수 있는 작은 습관부터 이어가보세요.'],tips:[['','채워보기','다양한 색의 채소와 과일을 평소 식사에 곁들여봐요'],['','잠깐 확인','비타민 C와 아연 제품의 함량과 중복 성분을 확인해요'],['','오늘의 루틴','오늘의 활동을 돌아보며 충분히 쉬는 시간도 함께 챙겨봐요']]},
  skin:{paragraphs:['피부를 위한 일상 관리도 다양한 식품을 골고루 먹는 습관과 함께 시작해보세요. 채소, 과일, 견과류처럼 익숙한 식품을 식탁에 곁들이고, 바쁜 날에도 규칙적으로 식사하는지 돌아보면 좋아요. 한 가지 제품에 기대기보다 이미 먹고 있는 제품의 성분과 표시량부터 차근차근 확인해보세요.','늦게 잠드는 날이나 바깥 활동이 많은 날에는 평소의 관리와 휴식 습관도 함께 기록해보세요. 여러 습관을 한 번에 바꾸기보다 내 일상에서 꾸준히 지킬 수 있는 루틴을 하나씩 정하는 게 좋아요. 하루를 마무리할 때는 수면 시간을 돌아보고 편안하게 쉬는 시간도 남겨두세요.'],tips:[['','채워보기','채소와 과일, 견과류를 식사에 다양하게 곁들여봐요'],['','잠깐 확인','비타민 C와 비타민 E가 겹쳐 들어 있는지 성분표를 살펴봐요'],['','오늘의 루틴','하루를 마무리하며 수면 시간과 평소 관리 습관을 돌아봐요']]},
  circulation:{paragraphs:['평소 자주 먹는 메뉴와 간식의 종류를 기록하며 식사의 균형을 돌아보세요. 채소, 통곡물, 생선 등 여러 식품을 골고루 곁들이고, 같은 메뉴만 반복하고 있지는 않은지 살펴보면 좋아요. 오메가-3 제품을 먹고 있다면 새 제품을 추가하기 전에 이미 등록한 제품의 성분과 표시량을 비교해보세요.','오래 앉아서 일하거나 공부하는 날에는 틈틈이 자리에서 일어나 가볍게 움직여보세요. 운동 계획을 크게 세우기보다 일상에서 걸을 수 있는 시간을 조금씩 찾는 것도 좋은 시작이에요. 몸에 무리가 없는 활동과 충분한 휴식을 함께 챙기며 꾸준히 이어갈 수 있는 나만의 리듬을 만들어보세요.'],tips:[['','채워보기','채소와 통곡물, 생선을 평소 식사에 골고루 곁들여봐요'],['','잠깐 확인','오메가-3가 포함된 제품을 함께 먹는다면 성분과 함량을 비교해요'],['','오늘의 루틴','일하는 중간에 잠시 걸으며 오래 앉아 있는 시간을 나누어봐요']]},
  muscles:{paragraphs:['운동하는 날에는 활동량뿐 아니라 식사를 규칙적으로 챙기고 있는지도 살펴보세요. 곡류와 단백질 식품, 채소 등 여러 식품을 골고루 곁들이고, 운동 전후에 먹은 음식도 함께 기록해보면 좋아요. 영양제를 바로 더하기보다 이미 먹고 있는 제품의 마그네슘과 비타민 D 함량부터 확인해보세요.','활동한 시간만큼 회복을 위한 휴식도 일상에 남겨두세요. 운동 강도를 갑자기 높이기보다 몸에 무리가 없는 범위에서 꾸준히 이어갈 계획을 세우는 게 좋아요. 활동 뒤의 느낌과 쉬는 시간을 함께 기록하며, 다음 운동도 편안하게 시작할 수 있는 나만의 속도를 찾아보세요.'],tips:[['','채워보기','운동하는 날에도 곡류와 단백질 식품을 골고루 챙겨봐요'],['','잠깐 확인','마그네슘과 비타민 D가 여러 제품에 겹치는지 성분표를 확인해요'],['','오늘의 루틴','활동한 날에는 쉬는 시간도 남겨 다음 운동을 편안하게 준비해요']]}
};
// Guide-only presentation catalog: Figma values explicitly requested by the user.
// Never mutate the shop catalog or treat these prices as a live sales feed.
const eyeGuideProducts=[
  {id:'eye-berry',name:'아이 베리 루테인 구미 (30개)',brand:'VITAME',price:19800,discount:18,image:'assets/guide/products/eye-berry.webp',tags:'eye-immune'},
  {id:'eye-balance',name:'아이 밸런스 루테인 · 지아잔틴 (30일분)',brand:'VITAME',price:24900,discount:22,image:'assets/registration/eye-balance.webp',tags:'eye'},
  {id:'eye-care',name:'아이 케어 비타민A · 오메가3 (30일분)',brand:'VITAME',price:21000,discount:25,image:'assets/registration/eye-care.webp',tags:'eye-circulation'}
];
function guideProductCard(p){
  const hasPrice=Number.isFinite(p.price)&&p.price>=0;
  const discount=Number.isFinite(p.discount)&&p.discount>0&&p.discount<100?p.discount:null;
  const action=p.designOnly?`data-guide-catalog="${esc(p.id)}"`:`data-action="product" data-id="${esc(p.id)}"`;
  return `<button class="ai-product" ${action}><span class="ai-product-art">${p.image?`<img class="ai-product-photo" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" draggable="false">`:'<span class="ai-product-missing">제품 이미지 준비 중</span>'}<img class="ai-product-heart" src="assets/guide/product-heart.svg" alt=""></span><span class="ai-product-info"><span class="ai-product-brand">${esc(p.brand||'VITAME')}</span><span class="ai-product-name">${esc(p.name)}</span><span class="ai-product-price">${hasPrice?`${discount?`<b>${discount}%</b>`:''}<strong>${money(p.price)}</strong>`:'<small>가격 정보 없음</small>'}</span>${p.tags?`<span class="ai-product-tags" aria-label="관련 건강 영역">${['eyes',...(p.tags==='eye-immune'?['immune']:p.tags==='eye-circulation'?['circulation']:[])].map(id=>finalGuideIcon(wellnessGuides.find(g=>g.id===id))).join('')}</span>`:''}</span></button>`;
}
function guideProducts(g){
  let related=products.filter(p=>g.names.includes(p.nutrient)&&p.image);
  if(g.id==='eyes')related=eyeGuideProducts.map(design=>{
    const live=products.find(p=>p.id===design.id||p.name===design.name);
    return live?{...design,...live,price:live.price,discount:live.discount,designOnly:false}:{...design,designOnly:true};
  });
  return `<section class="ai-guide-products" aria-label="${esc(g.title)} 추천 제품"><div class="ai-product-heading"><div><h3>${esc(g.title)} 추천 제품</h3><p>${g.id==='eyes'&&state.demo?'현재 부족한 영양소를 바탕으로 추천했어요.':'관련 성분의 제품을 살펴보세요.'}</p></div><button data-go="shop">전체보기 ${icon('arrow')}</button></div><div class="ai-product-grid" tabindex="0" aria-label="추천 제품 좌우 스크롤">${related.map(p=>{const html=guideProductCard({...p,designOnly:true});return p.id==='eye-berry'?html:html.replace(/data-guide-catalog="[^"]+"/,'type="button" aria-disabled="true"');}).join('')||'<p class="ai-products-empty">관련 제품이 아직 없어요.</p>'}</div></section>`;
}
// One collapsible detail shell for all categories; category copy/data stay separate.
function detailedGuideCard(g,content){
  // Reuse the same illustrative nutrient values shown in the analysis accordion.
  const current=g.names.map(name=>nutrients.find(n=>n[0]===name)).filter(Boolean);
  const displayName=state.name||'회원';
  const designIntroductions={
    eyes:`${displayName}님, 현재 등록된 복용 정보를 보면 비타민 A와 오메가-3 섭취가 조금 부족한 편이에요.`,
    energy:`${displayName}님, 현재 등록된 복용 정보를 보면 비타민 D와 마그네슘을 조금 더 챙길 필요가 있어 보여요.`,
    sleep:`${displayName}님, 현재 등록된 복용 정보를 보면 마그네슘을 조금 더 챙기고 비타민 B6의 중복 섭취 여부도 확인하면 좋겠어요.`
  };
  // Figma's personalized example wording is valid only for its matching demo
  // state. Missing or different data must not inherit a deficiency claim.
  const matchesDesign=current.length===2&&(g.id==='sleep'?current[0][2]==='부족'&&['주의','과다'].includes(current[1][2]):current.every(n=>n[2]==='부족'));
  const introduction=state.demo&&matchesDesign&&designIntroductions[g.id]?designIntroductions[g.id]:`${displayName}님, ${current.length?'표시된 영양소 정보와 등록한 제품의 성분·함량을 함께 확인해보세요.':'아직 개인 분석 데이터가 없어 영양 상태를 판단할 수는 없어요.'}`;
  content={...content,paragraphs:content.paragraphs.map(p=>p.replace('{analysis}',introduction)),tips:content.tips.map(t=>[...t])};
  if(g.id==='eyes'&&!(state.demo&&matchesDesign))content.tips[1][2]='오메가-3가 포함된 제품의 성분과 함량을 확인해요';
  const status=current.length?current.map(n=>`<div class="ai-guide-nutrient" data-status="${esc(n[2])}"><span class="ai-guide-nutrient-name">${esc(n[0])}</span><span class="ai-guide-track" role="meter" aria-label="${esc(n[0])} 예시 섭취 비율" aria-valuemin="0" aria-valuemax="${Math.max(100,n[1])}" aria-valuenow="${n[1]}"><i style="width:${Math.max(0,Math.min(n[1],100))}%"></i></span><span class="ai-guide-rate">${n[1]}%</span><b>${esc(n[2])}</b></div>`).join(''):'<p>아직 확인할 수 있는 개인 분석 데이터가 없어요.</p>';
  return `<section class="ai-guide-card ai-detail-card" id="guide-${g.id}"><div class="ai-detail-surface"><h2><button class="ai-guide-toggle" data-ai-guide-toggle="${g.id}" aria-expanded="false" aria-controls="ai-guide-body-${g.id}">${finalGuideIcon(g,true)}<span>${esc(g.title)} 가이드</span>${wellnessIcon('chevron')}</button></h2><p class="ai-guide-description">${esc(g.description)}</p></div><div class="ai-guide-reveal" id="ai-guide-body-${g.id}" inert aria-hidden="true"><div class="ai-guide-inner"><div class="ai-detail-content"><div class="ai-guide-status">${status}</div><div class="ai-guide-copy">${content.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div><div class="ai-guide-tips">${content.tips.map(([,title,copy],i)=>`<div class="ai-guide-tip"><img class="ai-tip-symbol" src="assets/onboarding/${['very-bad','bad','good'][i]}/Body.png" alt=""><div><small>${esc(title)}</small><p>${esc(copy)}</p></div></div>`).join('')}</div></div>${guideProducts(g)}</div></div></section>`;
}
function finalGuideCard(g){
  const presentation=g.id==='energy'?{...g,title:'에너지 건강'}:g.id==='sleep'?{...g,title:'수면 · 스트레스 건강',description:'수면 · 스트레스를 위한 일상 관리 습관을 살펴보세요.'}:g;
  return detailedGuideCard(presentation,g.id==='eyes'?eyeGuideContent:categoryGuideContent[g.id]);
}
document.addEventListener('click',e=>{
  const preview=e.target.closest('[data-guide-catalog]');
  if(route()==='guide'&&preview&&preview.dataset.guideCatalog==='eye-berry')go('shop-eye-berry');
});
// Drag only the lower product rail; leave vertical page scrolling and taps intact.
let guideProductDrag=null,guideProductSuppressUntil=0;
document.addEventListener('pointerdown',e=>{
  const rail=e.target.closest('.ai-detail-card .ai-product-grid');
  if(route()!=='guide'||!rail||e.button!==0)return;
  guideProductDrag={rail,id:e.pointerId,x:e.clientX,y:e.clientY,left:rail.scrollLeft,moved:false};
});
document.addEventListener('pointermove',e=>{
  const d=guideProductDrag;if(!d||d.id!==e.pointerId)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;
  if(!d.moved){
    if(Math.abs(dy)>8&&Math.abs(dy)>Math.abs(dx)){guideProductDrag=null;return;}
    if(Math.abs(dx)<8)return;
    d.moved=true;d.rail.classList.add('is-dragging');d.rail.setPointerCapture(e.pointerId);
  }
  e.preventDefault();d.rail.scrollLeft=d.left-dx;
},{passive:false});
function finishGuideProductDrag(e){
  const d=guideProductDrag;if(!d||d.id!==e.pointerId)return;
  guideProductDrag=null;
  if(d.rail.hasPointerCapture(e.pointerId))d.rail.releasePointerCapture(e.pointerId);
  d.rail.classList.remove('is-dragging');
  if(d.moved){
    guideProductSuppressUntil=performance.now()+350;
    const cards=[...d.rail.querySelectorAll('.ai-product')];
    const step=cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:150;
    const target=Math.max(0,Math.min(d.rail.scrollWidth-d.rail.clientWidth,Math.round(d.rail.scrollLeft/step)*step));
    d.rail.scrollTo({left:target,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
}
document.addEventListener('pointerup',finishGuideProductDrag);
document.addEventListener('pointercancel',finishGuideProductDrag);
document.addEventListener('click',e=>{
  if(e.target.closest('.ai-detail-card .ai-product-grid')&&performance.now()<guideProductSuppressUntil){e.preventDefault();e.stopImmediatePropagation();}
},true);
document.addEventListener('dragstart',e=>{if(e.target.closest('.ai-detail-card .ai-product-grid'))e.preventDefault();});
let finalGuideScrollTimer;
// Only the guide uses this carousel. Character DOM and original motion keyframes stay intact.
const guideCarousel={offset:0,frame:0,drag:null,queue:0,suppressUntil:0,motionTimer:0,tapPending:false};
function paintGuideCarousel(){
  document.querySelectorAll('[data-ai-item]').forEach(item=>{
    let position=Number(item.dataset.aiItem)-guideCharacter-guideCarousel.offset;
    while(position>2.5)position-=5;while(position< -2.5)position+=5;
    const distance=Math.abs(position),near=Math.min(distance,1);
    item.style.setProperty('--position',position);
    item.style.setProperty('--scale',1-.45*near);
    item.style.setProperty('--blur',`${3*near}px`);
    item.style.setProperty('--opacity',distance<=1?1-.55*distance:.45*Math.max(0,2-distance));
    item.style.zIndex=String(Math.round((3-distance)*10));
    const central=distance<.01,button=item.querySelector('[data-ai-tap]');
    button.disabled=!central;button.tabIndex=central?0:-1;
    item.setAttribute('aria-hidden',String(!central));
  });
}
function clearGuideMotion(){
  clearTimeout(guideCarousel.motionTimer);guideCarousel.tapPending=false;
  guideCarousel.arrivalPending=false;
  guideCarousel.motionCleanup?.();guideCarousel.motionCleanup=null;
  document.querySelectorAll('.ai-character-item .initial-character').forEach(el=>{
    const key=el.closest('[data-character-key]').dataset.characterKey;
    el.classList.remove(`ob-${key}-tap`,`ob-${key}-success`);
    delete el.dataset.motion;
  });
}
function guideMessage(refresh=false){
  // Explicit taps/refresh advance this character only; renders retain the line.
  if(refresh)delete guideVisitMessages[guideCharacterKeys[guideCharacter]];
  const label=document.querySelector('.ai-guide-message [aria-live]');
  if(label){
    const next=guideCharacterMessage(),changed=label.textContent!==next;label.textContent=next;
    if(changed&&typeof label.animate==='function'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)label.animate([{opacity:0,transform:'translateY(2px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});
  }
}
function playGuideMotion(type){
  const item=document.querySelector(`[data-ai-item="${guideCharacter}"]`),el=item?.querySelector('.initial-character');
  if(!el)return;
  if(type==='tap')guideMessage(true);
  if(el.dataset.motion){guideCarousel.tapPending=type==='tap';return;}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const key=guideCharacterKeys[guideCharacter],name=`ob-${key}-${type}`;
  el.dataset.motion=type;el.classList.add(name);
  const action=el.querySelector('[data-initial-action]');
  const finish=(discard=false)=>{el.classList.remove(name);delete el.dataset.motion;clearTimeout(guideCarousel.motionTimer);action.removeEventListener('animationend',end);guideCarousel.motionCleanup=null;if(discard)return;if(guideCarousel.arrivalPending&&!guideCarousel.drag&&!guideCarousel.frame){guideCarousel.arrivalPending=false;playGuideMotion('success');}else if(guideCarousel.queue&&el.isConnected&&!guideCarousel.drag&&!guideCarousel.frame){const next=Math.sign(guideCarousel.queue);guideCarousel.queue-=next;moveGuideCharacter(next);}else if(guideCarousel.tapPending&&el.isConnected&&!guideCarousel.drag&&!guideCarousel.frame){guideCarousel.tapPending=false;playGuideMotion('tap');}};
  const end=e=>{if(e.target===action)finish();};
  guideCarousel.motionCleanup=()=>finish(true);
  action.addEventListener('animationend',end);
  guideCarousel.motionTimer=setTimeout(finish,parseFloat(getComputedStyle(action).animationDuration)*1000+80);
}
function settleGuideCarousel(target){
  cancelAnimationFrame(guideCarousel.frame);
  const from=guideCarousel.offset,start=performance.now(),duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:320;
  const tick=now=>{
    const t=duration?Math.min(1,(now-start)/duration):1;
    guideCarousel.offset=from+(target-from)*(1-Math.pow(1-t,3));paintGuideCarousel();
    if(t<1){guideCarousel.frame=requestAnimationFrame(tick);return;}
    guideCarousel.frame=0;guideCarousel.offset=0;
    guideCharacter=(guideCharacter+target+5)%5;paintGuideCarousel();guideMessage();
    if(guideCarousel.queue){const next=Math.sign(guideCarousel.queue);guideCarousel.queue-=next;moveGuideCharacter(next);}
    else if(target){if(guideCarousel.motionCleanup)guideCarousel.arrivalPending=true;else playGuideMotion('success');}
  };
  guideCarousel.frame=requestAnimationFrame(tick);
}
function moveGuideCharacter(direction){
  if(guideCarousel.frame||guideCarousel.drag||guideCarousel.motionCleanup){guideCarousel.queue+=direction;return;}
  clearGuideMotion();settleGuideCarousel(direction);
}
document.addEventListener('pointerdown',e=>{
  const viewport=e.target.closest('.ai-character-viewport');
  if(route()!=='guide'||!viewport||e.button!==0||guideCarousel.frame)return;
  guideCarousel.drag={id:e.pointerId,x:e.clientX,y:e.clientY,viewport,moved:false};
});
document.addEventListener('pointermove',e=>{
  const d=guideCarousel.drag;if(!d||d.id!==e.pointerId)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;
  if(!d.moved){if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){guideCarousel.drag=null;return;}if(Math.abs(dx)<8)return;d.moved=true;guideCarousel.tapPending=false;d.viewport.setPointerCapture(e.pointerId);}
  e.preventDefault();guideCarousel.offset=Math.max(-1,Math.min(1,-dx/(d.viewport.clientWidth*.29)));paintGuideCarousel();
});
function endGuideDrag(e){
  const d=guideCarousel.drag;if(!d||d.id!==e.pointerId)return;guideCarousel.drag=null;
  if(d.viewport.hasPointerCapture(e.pointerId))d.viewport.releasePointerCapture(e.pointerId);
  if(!d.moved)return;
  guideCarousel.suppressUntil=performance.now()+400;
  settleGuideCarousel(e.type==='pointercancel'?0:Math.abs(guideCarousel.offset)>.25?Math.sign(guideCarousel.offset):0);
}
document.addEventListener('pointerup',endGuideDrag);document.addEventListener('pointercancel',endGuideDrag);
document.addEventListener('click',e=>{if(e.target.closest('.ai-character-viewport')&&performance.now()<guideCarousel.suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
window.addEventListener('hashchange',()=>{cancelAnimationFrame(guideCarousel.frame);clearGuideMotion();Object.assign(guideCarousel,{offset:0,frame:0,drag:null,queue:0});});
slideAdapters.push({
  selector:'.period-chart .month-bars',
  preview(direction){
    const previous=chartAnchor,selection=chartSelection,next=periodOffset(chartAnchor,direction*7);
    if(next>periodStart(dateKey())||next<'2000-01-01')return null;
    try{chartAnchor=next;chartSelection=null;return slideElement(periodChart(),'.month-bars');}
    finally{chartAnchor=previous;chartSelection=selection;}
  },
  commit(direction){chartAnchor=periodOffset(chartAnchor,direction*7);chartSelection=null;render();}
});
// Shared reveal motion for the comprehensive analysis and AI guide graphs.
function animateNutrientRows(body){
  const motionId=String(Number(body.dataset.motionId||0)+1);body.dataset.motionId=motionId;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  body.querySelectorAll('.care-nutrient,.ai-guide-nutrient').forEach(row=>{
    const meter=row.querySelector('[role="meter"]'),bar=meter?.querySelector('i'),rate=row.querySelector('.nutrient-rate,.ai-guide-rate');
    if(!meter||!bar||!rate)return;
    const value=Number(meter.getAttribute('aria-valuenow')),start=performance.now();
    bar.getAnimations().forEach(a=>a.cancel());rate.textContent=value+'%';
    if(reduced)return;
    rate.textContent='0%';
    bar.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:600,easing:'cubic-bezier(.22,1,.36,1)'});
    function tick(now){
      if(body.hidden||body.inert||!row.isConnected||body.dataset.motionId!==motionId)return;
      const t=Math.min(1,(now-start)/600);rate.textContent=Math.round(value*(1-Math.pow(1-t,3)))+'%';
      if(t<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
function openFinalGuide(id,jump=false){
  const target=document.getElementById('guide-'+id);if(!target)return;
  const opening=jump||target.querySelector('[data-ai-guide-toggle]').getAttribute('aria-expanded')!=='true';
  clearTimeout(finalGuideScrollTimer);stopGuideScroll();
  document.querySelectorAll('.ai-guide-card').forEach(card=>{
    // A direct toggle expands below its own header. Keep earlier cards open
    // so collapsing content above the viewport cannot pull this card upward.
    if(!jump&&card!==target)return;
    const expanded=card===target&&opening,body=card.querySelector('.ai-guide-reveal');
    card.querySelector('[data-ai-guide-toggle]').setAttribute('aria-expanded',String(expanded));
    card.classList.toggle('is-open',expanded);body.inert=!expanded;body.setAttribute('aria-hidden',String(!expanded));
    if(expanded)animateNutrientRows(body);
    else body.dataset.motionId=String(Number(body.dataset.motionId||0)+1);
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
  if(character)moveGuideCharacter(Number(character.dataset.aiCharacter));
  if(event.target.closest('[data-ai-tap]')&&!guideCarousel.frame)playGuideMotion('tap');
  if(event.target.closest('[data-ai-refresh]'))guideMessage(true);
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
  if(bar&&!bar.disabled){chartSelection=bar.dataset.periodBar;document.querySelector('.period-chart').outerHTML=periodChart();updateAnalysisScore();document.querySelector(`[data-period-bar="${chartSelection}"]`)?.focus({preventScroll:true});}
  if(add)addGuide(add.dataset.guideAdd);
  if(character){guideCharacter=(guideCharacter+1)%5;character.innerHTML=wellnessArt(guideCharacter);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)character.firstElementChild.animate([{transform:'scale(.55)',opacity:.4},{transform:'scale(1.12)',opacity:1},{transform:'scale(1)',opacity:1}],{duration:330,easing:'ease-out'});}
  if(e.target.closest('[data-period-info]'))modal('건강 관리 점수 안내','기간별 점수와 영양소 상태는 화면 체험용 예시입니다. 실제 복용 기록으로 계산한 결과나 의료 평가가 아닙니다.');
});
render();
