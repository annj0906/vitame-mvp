'use strict';

// Illustrative analysis only. These values are not calculated from health data.
let analysisMonth=dateKey().slice(0,7), selectedChartMonth=null;
const nutritionExpanded={low:true,high:true,ok:true};
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
function monthOffset(key,offset){const [year,month]=key.split('-').map(Number),date=new Date(year,month-1+offset,1);return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;}
function exampleMonthScore(key){
  const current=dateKey().slice(0,7),[year,month]=key.split('-').map(Number),[nowYear,nowMonth]=current.split('-').map(Number);
  const delta=(year-nowYear)*12+month-nowMonth;
  if(delta>0)return null;
  return ({0:78,'-1':66,'-2':57,'-3':72})[delta]??(60+((year*12+month)%19));
}
function monthComparison(key){const score=exampleMonthScore(key),previous=exampleMonthScore(monthOffset(key,-1));return {score,previous,points:score-previous,percent:Math.round((score-previous)/previous*100)};}
function monthLabel(key){const [year,month]=key.split('-');return `${year}년 ${Number(month)}월`;}
function monthTooltip(){
  if(!selectedChartMonth)return '';
  const {score,points,percent}=monthComparison(selectedChartMonth);
  return `<div class="month-comparison" role="status"><small>${monthLabel(selectedChartMonth)} · 지난달 대비</small><strong class="${points<0?'decline':''}">${points>0?'+':''}${percent}% ${wellnessIcon(points<0?'down':'up')}</strong><p>${score}점 · ${points===0?'지난달과 같아요.':`${Math.abs(points)}점 ${points>0?'높아졌어요!':'낮아졌어요.'}`}</p></div>`;
}
function monthlyChart(){
  return `<div class="monthly-chart"><div class="chart-scale" aria-hidden="true"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div class="month-bars" aria-label="월별 예시 건강 점수">${Array.from({length:7},(_,i)=>{
    const key=monthOffset(analysisMonth,i-3),score=exampleMonthScore(key),current=key===analysisMonth;
    return `<button class="month-bar ${current?'current':''} ${selectedChartMonth===key?'picked':''}" data-analysis-month-bar="${key}" aria-label="${monthLabel(key)} ${score===null?'기록 없음':`${score}점, 전월 대비 보기`}" aria-pressed="${selectedChartMonth===key}" ${score===null?'disabled':''}><span class="month-bar-track"><i style="--bar-height:${score===null?4:score}%"></i></span><span class="month-bar-label">${Number(key.slice(5))}월</span></button>`;
  }).join('')}</div><div class="month-tooltip-slot">${monthTooltip()}</div></div>`;
}
function nutritionCard(group){
  const items=nutrients.filter(n=>n[2]===group.status),expanded=nutritionExpanded[group.tone];
  return `<section class="nutrition-panel ${group.tone}"><button class="nutrition-panel-toggle" data-nutrition-toggle="${group.tone}" aria-expanded="${expanded}" aria-controls="nutrition-${group.tone}"><span class="wellness-symbol">${wellnessIcon(group.symbol)}</span><span><b>${group.title} ${items.length}개</b><small>${group.description}</small></span>${wellnessIcon('chevron')}</button><div id="nutrition-${group.tone}" class="nutrition-panel-body" ${expanded?'':'hidden'}>${items.map(n=>`<button class="analysis-nutrient" data-action="nutrient" data-name="${esc(n[0])}"><span class="nutrient-glyph" aria-hidden="true">${n[3]}</span><span>${esc(n[0])}</span><span class="nutrient-rate">${n[1]}%</span><span class="nutrient-track"><i style="width:${Math.min(n[1],100)}%"></i></span><span class="nutrient-status">${group.status}</span>${icon('arrow')}</button>`).join('')}</div><div class="nutrition-panel-chips" ${expanded?'hidden':''}>${items.slice(0,4).map(n=>`<span>${esc(n[0])}</span>`).join('')}${items.length>4?`<span>+ 외 ${items.length-4}개</span>`:''}</div></section>`;
}
analysis=function(){
  const {score,points}=monthComparison(analysisMonth);
  return `${analysisTabs()}<div class="analysis-overview"><label class="analysis-month-picker"><span>${monthLabel(analysisMonth)} ${wellnessIcon('chevron')}</span><input type="month" aria-label="분석 월 선택" value="${analysisMonth}" max="${dateKey().slice(0,7)}" min="2020-01"></label><p class="analysis-score-label">${analysisMonth===dateKey().slice(0,7)?'이번 달':'선택한 달'} 건강 관리 점수 <button data-analysis-info aria-label="건강 관리 점수 안내">${icon('info')}</button></p><h1 class="analysis-month-score">${score}점</h1><p class="analysis-month-description">나의 복용 루틴을 돌아보세요.<br>예시 점수가 <b>${Math.abs(points)}점</b> ${points===0?'유지됐어요.':points>0?'높아졌어요!':'낮아졌어요.'} <span class="${points<0?'decline':'rise'}">${points>0?'▲':points<0?'▼':'—'}</span></p>${monthlyChart()}<p class="chart-hint">막대를 누르면 전월 대비 변화를 볼 수 있어요.</p></div><div class="nutrition-panels">${analysisGroups.map(nutritionCard).join('')}</div><section class="analysis-guide-cta"><div class="wellness-cta-art" aria-hidden="true">${wellnessArt(4)}</div><h3>이제 관리 방법을 알아볼까요?</h3><p>나에게 맞는 관리 가이드를 살펴보세요.</p>${button('AI 가이드 보러가기','guide')}</section>${note()}`;
};
nutrientPage=analysis;

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
const mapGuideIds=['eyes','brain','gut','bones','energy','immune','sleep'];
function guideJumpChip(g,extra=''){return `<button class="guide-jump-chip tone-${g.color} ${extra}" data-guide-jump="${g.id}" aria-label="${g.title} 가이드로 이동"><span>${wellnessIcon(g.symbol)}</span>${g.title}</button>`;}
function guideSection(g,index){
  const current=g.names.map(name=>nutrients.find(n=>n[0]===name)).filter(Boolean);
  const related=products.filter(p=>g.names.includes(p.nutrient));
  return `<section id="guide-${g.id}" class="wellness-guide-section tone-${g.color}" aria-labelledby="guide-title-${g.id}"><header class="wellness-section-heading"><span class="wellness-section-number">${String(index+1).padStart(2,'0')}</span><div><h2 id="guide-title-${g.id}" tabindex="-1">${g.title} 가이드</h2><p>${g.description}</p></div></header><div class="wellness-current"><span class="wellness-symbol">${wellnessIcon(g.symbol)}</span><div><h3>현재 상태 <small>예시</small></h3>${current.map(n=>`<button data-action="nutrient" data-name="${esc(n[0])}" class="guide-nutrient"><span>${esc(n[0])}</span><span>${n[1]}%</span><b class="${n[2]==='부족'?'low':n[2]==='주의'?'high':'ok'}">${n[2]}</b></button>`).join('')}</div></div><div class="wellness-advice"><h3>이렇게 관리해보세요!</h3>${[
    ['pill','복용 관리','등록한 제품의 성분과 표시된 섭취량을 확인해보세요.','동일한 성분이 여러 제품에 포함되어 있는지 확인하고, 임의로 섭취량을 늘리지 마세요.'],
    ['meal','식습관 관리',g.food,'평소 식사를 기록해 나의 식사 패턴을 살펴보세요.'],
    ['clock','생활 습관',g.habit,'무리한 목표보다 일상에서 꾸준히 이어갈 수 있는 작은 습관부터 시작해보세요.']
  ].map(([symbol,title,copy,detail])=>`<details class="wellness-advice-row"><summary><span>${wellnessIcon(symbol)}</span><span><b>${title}</b><span>${copy}</span></span>${icon('arrow')}</summary><p>${detail}</p></details>`).join('')}<details class="guide-related"><summary>${icon('bag')}관련 제품 살펴보기 ${wellnessIcon('chevron')}</summary><div>${related.length?related.map(p=>`<button data-action="product" data-id="${p.id}"><span><b>${esc(p.name)}</b><small>${p.id==='o'?'주의 성분 · 비교용 제품':'체험용 예시 제품'}</small></span>${icon('arrow')}</button>`).join(''):'<p>이 영역의 예시 제품은 준비 중이에요.</p>'}${button('전체 제품 보기','shop','text-btn')}</div></details><div class="wellness-section-art" aria-hidden="true">${wellnessArt(g.art)}</div></div><button class="guide-back-top" data-guide-top>건강 영역 다시 선택 ${wellnessIcon('up')}</button></section>`;
}
guide=function(){
  const preferred=wellnessGuides.filter(g=>state.interests.includes(g.interest));
  const ordered=[...preferred,...wellnessGuides.filter(g=>!preferred.includes(g))];
  return `${analysisTabs(true)}<section class="wellness-guide-hero" id="guide-navigation"><span class="guide-hero-symbol">${wellnessIcon('sparkle')}</span><h1>내 몸에 맞는<br>관리 가이드를 찾아보세요</h1><p>관심 있는 건강 영역을 선택하면<br>AI 맞춤 가이드를 알려드려요.</p><div class="guide-health-map"><div class="guide-hero-art" aria-hidden="true">${wellnessArt(0)}</div>${mapGuideIds.map(id=>guideJumpChip(wellnessGuides.find(g=>g.id===id),'map-'+id)).join('')}</div><p class="guide-map-hint">${wellnessIcon('chevron')}영역을 선택하면 해당 가이드로 이동해요</p></section><section class="guide-interest-summary"><span class="wellness-symbol">${wellnessIcon('sparkle')}</span><div><h2>${preferred.length?`${esc(state.name)}님이 관심 있는 건강이에요!`:'어떤 건강에 관심이 있으신가요?'}</h2><p>${preferred.length?'선택한 관심 건강을 먼저 살펴보세요.':'MY에서 관심 건강을 선택할 수 있어요.'}</p></div><div class="guide-interest-art" aria-hidden="true">${wellnessArt(0)}</div><div class="guide-interest-chips">${preferred.length?preferred.map(g=>guideJumpChip(g)).join(''):button('관심 건강 선택하기','profile','text-btn')}</div></section>${ordered.map(guideSection).join('')}${note()}`;
};

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
  const bar=event.target.closest('[data-analysis-month-bar]');
  if(bar&&!bar.disabled){
    selectedChartMonth=bar.dataset.analysisMonthBar;
    document.querySelectorAll('[data-analysis-month-bar]').forEach(button=>{const selected=button===bar;button.classList.toggle('picked',selected);button.setAttribute('aria-pressed',String(selected));});
    document.querySelector('.month-tooltip-slot').innerHTML=monthTooltip();
  }
  if(event.target.closest('[data-analysis-info]'))modal('건강 관리 점수 안내','월별 점수와 전월 대비 변화는 화면 체험을 위한 예시 데이터입니다. 실제 복용 기록으로 계산한 결과나 의료 평가가 아닙니다.');
  const jump=event.target.closest('[data-guide-jump]'),top=event.target.closest('[data-guide-top]');
  if(jump||top){
    const target=document.getElementById(jump?'guide-'+jump.dataset.guideJump:'guide-navigation');if(!target)return;
    const focus=jump?target.querySelector('h2'):target.querySelector('[data-guide-jump]');
    focus?.focus({preventScroll:true});
    scrollToGuide(target);
  }
});
document.addEventListener('change',event=>{
  if(!event.target.matches('.analysis-month-picker input'))return;
  const value=event.target.value;if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)||value<'2020-01'||value>dateKey().slice(0,7)){event.target.value=analysisMonth;return;}
  analysisMonth=value;selectedChartMonth=null;render();
});
const renderBeforeWellness=render;
render=function(){renderBeforeWellness();if(['analysis','nutrients','guide'].includes(route())){document.querySelector('.top h2').textContent='분석';document.title=(route()==='guide'?'AI 가이드':'종합 분석')+' · VITAME';}};
render();
