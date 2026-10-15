'use strict';
const careAsset=name=>`<img src="assets/care/${name}.svg" alt="">`;
const careScreens=['dose','archive','analysis'];
let doseCelebrationKey='',doseCelebrationComplete=false;
function updateDoseCompletionCelebration(){
  const today=dateKey(),onToday=route()==='dose'&&selectedDate===today;
  if(!onToday){doseCelebrationKey='';doseCelebrationComplete=false;return;}
  const total=state.supplements.length,complete=total>0&&completed(today)===total;
  const play=complete&&(doseCelebrationKey!==today||!doseCelebrationComplete);
  doseCelebrationKey=today;doseCelebrationComplete=complete;
  if(!play||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const count=document.querySelector('.dose-progress-summary strong');if(!count)return;
  count.insertAdjacentHTML('beforeend',completionCelebrationShapes('dose-completion-celebration initial-setup-complete'));
  const effect=count.querySelector('.dose-completion-celebration');
  const bounds=count.getBoundingClientRect(),app=document.querySelector('#app').getBoundingClientRect();
  effect.style.left=app.left+'px';effect.style.width=app.width+'px';
  effect.style.setProperty('--dose-pop-left',(bounds.left-app.left+bounds.width*.45)+'px');
  effect.style.setProperty('--dose-pop-top',bounds.top+'px');
  effect.style.setProperty('--celebration-rise',-Math.min(180,Math.max(40,bounds.top-18))+'px');
  effect.style.setProperty('--celebration-floor',Math.max(150,window.innerHeight-bounds.top-10)+'px');
  let remaining=5;
  effect.addEventListener('animationend',event=>{
    if(event.target.classList.contains('completion-pop')&&--remaining===0)effect.remove();
  });
}
const originalNutritionCard=nutritionCard;
nutritionCard=function(group){
  if(route()!=='analysis')return originalNutritionCard(group);
  const items=nutrients.filter(n=>n[2]===group.status),expanded=nutritionExpanded[group.tone];
  return `<section class="nutrition-panel ${group.tone}"><button class="nutrition-panel-toggle" data-nutrition-toggle="${group.tone}" aria-expanded="${expanded}" aria-controls="nutrition-${group.tone}"><span class="wellness-symbol">${careAsset(group.tone)}</span><span class="care-nutrition-title"><b>${group.status} 영양소</b><small>${group.description}</small></span><b class="care-nutrition-count">${items.length}개</b>${careAsset('chevron')}</button><div id="nutrition-${group.tone}" class="nutrition-panel-body" ${expanded?'':'hidden'}>${items.map(n=>`<div class="care-nutrient" data-status="${esc(n[2])}"><button class="care-nutrient-name" data-action="nutrient" data-name="${esc(n[0])}">${esc(n[0])}</button><span class="nutrient-track" role="meter" aria-label="${esc(n[0])} 섭취 비율" aria-valuenow="${n[1]}" aria-valuemin="0" aria-valuemax="${Math.max(100,n[1])}"><i style="width:${Math.min(n[1],100)}%"></i></span><span class="nutrient-rate">${n[1]}%</span><span class="nutrient-status">${n[2]}</span></div>`).join('')}</div><div class="nutrition-panel-chips" ${expanded?'hidden':''}>${items.slice(0,4).map(n=>`<span>${esc(n[0])}</span>`).join('')}${items.length>4?`<span>+ 외 ${items.length-4}개</span>`:''}</div></section>`;
};
const doseBeforeCare=dose;
dose=function(){
  const t=document.createElement('template');t.innerHTML=doseBeforeCare();
  t.content.querySelector('.dose-swipe-hint')?.remove();
  t.content.querySelectorAll('.dose-swipe-row').forEach((row,i)=>{
    row.querySelector('.dose-item-edit').innerHTML=careAsset('edit-action');
    row.querySelector('.dose-delete').innerHTML=careAsset('archive-action');
    const check=row.querySelector('.check');if(check)check.innerHTML='<img src="assets/home/check.svg" alt="">';
    row.querySelector('small').textContent=state.supplements[i].time;
    if(i===0&&!doseEditing)row.querySelector('.dose-row').insertAdjacentHTML('beforeend','<span class="care-swipe-hint">좌우로 스와이프 해보세요</span>');
  });
  const sort=t.content.querySelector('[data-dose-sort]');if(sort)sort.innerHTML=careAsset('sort')+'시간순 정렬';
  const edit=t.content.querySelector('[data-dose-edit]');if(edit)edit.innerHTML=careAsset('edit')+(doseEditing?'완료':'편집');
  t.content.querySelector('.dose-add-action button').textContent='영양제 등록하기';
  return t.innerHTML;
};
function careArchive(){
  const entries=state.archivedSupplements||[];
  return `<header class="top"><button class="icon-btn" data-go="dose" aria-label="복용 관리로 돌아가기"><img src="assets/scan/back.svg" alt=""></button><h2>아카이브</h2></header><main class="content archive-content"><div class="care-archive-copy"><h3>복용을 중단한 영양제를 보관하고 있어요.</h3><p>스와이프해서 다시 복용하거나 삭제할 수 있어요.</p></div><div class="care-archive-list">${entries.map(({item:s})=>{
    const last=Object.keys(state.records).filter(d=>state.records[d]?.[s.id]).sort().pop();
    return `<section class="dose-swipe-row archived-supplement" data-row-id="${esc(s.id)}" data-archived-id="${esc(s.id)}"><button class="dose-item-edit" data-restore-supplement="${esc(s.id)}" aria-label="${esc(s.name)} 복용 목록 복원">${careAsset('restore')}</button><button class="dose-delete" data-delete-archived="${esc(s.id)}" aria-label="${esc(s.name)} 삭제">${careAsset('trash')}</button><div class="dose-row-front"><div class="care-archive-row"><span class="pill p${s.colorIndex??0}"></span><b>${esc(s.name)}</b><small>${last?'마지막 복용 · '+Number(last.slice(5,7))+'월 '+Number(last.slice(8))+'일':'복용 기록 없음'}</small></div></div></section>`;
  }).join('')||'<p class="care-archive-empty">보관한 영양제가 없어요.</p>'}</div></main>`;
}
const renderBeforeCare=render;
let carePreviousRoute='';
render=function(){
  const r=route(),enteringAnalysis=r==='analysis'&&carePreviousRoute!=='analysis';
  if(r==='analysis'&&carePreviousRoute!=='analysis')Object.keys(nutritionExpanded).forEach(k=>nutritionExpanded[k]=false);
  carePreviousRoute=r;
  if(r==='archive'){
    clearTimeout(introTimer);document.body.dataset.screen=r;document.title='아카이브 · VITAME';$('#app').innerHTML=careArchive();return;
  }
  renderBeforeCare();if(!careScreens.includes(r))return;
  const header=document.querySelector('.top');
  header.querySelector('.icon-btn[data-go="home"]')?.remove();
  if(r==='dose')header.querySelector('.top-actions').innerHTML=`<button class="icon-btn" data-go="scan" aria-label="영양제 스캔"><img src="assets/home/scan.svg" alt=""></button><button class="icon-btn" data-go="archive" aria-label="영양제 아카이브">${careAsset('archive')}</button>`;
  if(r==='analysis'){
    const cta=document.querySelector('.analysis-guide-cta');
    cta.querySelector('button').insertAdjacentHTML('beforebegin',`<div class="care-guide-character">${initialCharacter('normal')}${characterShadow('normal', 'care-character-shadow')}</div>`);
    updateAnalysisScore(enteringAnalysis);
  }

};
// Tapping the non-interactive card area reuses the existing accordion handler.
document.addEventListener('click',e=>{
  if(route()!=='analysis'||e.target.closest('button,a'))return;
  e.target.closest('.nutrition-panel')?.querySelector('[data-nutrition-toggle]').click();
});
const renderBeforeCalendarMotion=render;
function archiveTransitionSnapshot(){
  const app=$('#app'),rect=app.getBoundingClientRect(),snapshot=app.cloneNode(true);
  const originals=[app,...app.querySelectorAll('*')],copies=[snapshot,...snapshot.querySelectorAll('*')];
  originals.forEach((node,index)=>{
    const computed=getComputedStyle(node);
    copies[index].style.cssText=Array.from(computed).map(property=>property+':'+computed.getPropertyValue(property)+';').join('');
    copies[index].removeAttribute('id');
    if(node.matches('.utility-order')){
      // A transformed snapshot makes fixed descendants use its full document
      // height. Pin the order footer to its measured viewport position instead.
      const footer=node.getBoundingClientRect();
      Object.assign(copies[index].style,{position:'absolute',left:(footer.left-rect.left)+'px',top:(footer.top+window.scrollY)+'px',bottom:'auto',right:'auto',width:footer.width+'px',height:footer.height+'px',transform:'none',margin:'0'});
    }
    if(node.matches('.dose-period-toolbar .segment,.wellness-tabs,.registration-tabs')){
      const pseudo=getComputedStyle(node,'::before');
      if(pseudo.content!=='none'&&pseudo.content!=='normal'){
        const capsule=document.createElement('span');capsule.setAttribute('aria-hidden','true');
        capsule.style.cssText=Array.from(pseudo).map(property=>property+':'+pseudo.getPropertyValue(property)+';').join('');
        copies[index].classList.add('transition-frozen-segment');copies[index].prepend(capsule);
      }
    }
  });
  // Keep the footer's containing block predictable even on long cart pages.
  snapshot.querySelector('.utility-order')&&snapshot.append(snapshot.querySelector('.utility-order'));
  const viewport=document.createElement('div');viewport.inert=true;viewport.setAttribute('aria-hidden','true');
  Object.assign(viewport.style,{position:'fixed',left:rect.left+'px',top:'0',width:rect.width+'px',height:'100dvh',overflow:'hidden',zIndex:'60',pointerEvents:'none'});
  Object.assign(snapshot.style,{position:'absolute',left:'0',top:-window.scrollY+'px',width:rect.width+'px',margin:'0',transform:'none',visibility:'visible'});
  viewport.append(snapshot);document.body.append(viewport);
  return {viewport,snapshot};
}
render=function(){
  const previous=document.body.dataset.screen,next=route(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const oldSegment=document.querySelector('.dose-period-toolbar .segment,.wellness-tabs');
  const oldSegmentColor=oldSegment?getComputedStyle(oldSegment).backgroundColor:null;
  const oldSelected=oldSegment?[...oldSegment.children].findIndex(el=>el.classList.contains('selected')):-1;
  const analysisSwitch=['analysis','guide'].includes(previous)&&['analysis','guide'].includes(next)&&previous!==next;
  let oldAnalysis;
  if(analysisSwitch&&!reduced){
    const tabs=document.querySelector('.wellness-tabs'),top=tabs.getBoundingClientRect().bottom+24,bottom=document.querySelector('.nav')?.getBoundingClientRect().top||innerHeight;
    oldAnalysis=archiveTransitionSnapshot();
    oldAnalysis.viewport.style.top=top+'px';oldAnalysis.viewport.style.height=Math.max(0,bottom-top)+'px';
    oldAnalysis.snapshot.style.top=-(window.scrollY+top)+'px';
    oldAnalysis.snapshot.querySelector('.top')?.remove();oldAnalysis.snapshot.querySelector('.nav')?.remove();
    // Preserve header space in the frozen snapshot while hiding fixed controls.
    oldAnalysis.snapshot.style.paddingTop='64px';
    oldAnalysis.snapshot.querySelector('.wellness-tabs').style.visibility='hidden';
  }
  const oldCalendar=document.querySelector('.dose-calendar'),oldMode=oldCalendar?.getAttribute('aria-label'),oldHeight=oldCalendar?.getBoundingClientRect().height;
  let ghost,underlay;
  // Utility pages own their entrance/exit outside the Shop/My render wrappers.
  const overlayScreens=['archive','scan'];
  const returningToScan=previous==='registration'&&next==='scan';
  const enteringOverlay=overlayScreens.includes(next)&&previous!==next&&!returningToScan;
  const leavingOverlay=returningToScan||(overlayScreens.includes(previous)&&previous!==next&&!enteringOverlay);
  if(enteringOverlay&&!reduced){
    underlay=archiveTransitionSnapshot();
    underlay.viewport.style.zIndex='59';
  }
  if(leavingOverlay&&!reduced){
    ghost=archiveTransitionSnapshot();
  }
  renderBeforeCalendarMotion();
  if(reduced)return;
  const calendar=document.querySelector('.dose-calendar');
  if(previous==='dose'&&next==='dose'&&calendar&&oldHeight&&oldMode!==calendar.getAttribute('aria-label')){
    calendar.animate([
      {height:oldHeight+'px',overflow:'hidden'},
      {height:calendar.getBoundingClientRect().height+'px',overflow:'hidden'}
    ],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  if(ghost)ghost.snapshot.animate([{transform:'translateX(0)'},{transform:'translateX(100%)'}],{duration:320,easing:'cubic-bezier(.4,0,.8,.6)'}).finished.finally(()=>ghost.viewport.remove());
  if(enteringOverlay){
    const entry=archiveTransitionSnapshot();
    entry.snapshot.animate([{transform:'translateX(100%)'},{transform:'translateX(0)'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'}).finished.finally(()=>{entry.viewport.remove();underlay?.viewport.remove();});
  }
  const segment=document.querySelector('.dose-period-toolbar .segment,.wellness-tabs');
  if(analysisSwitch&&segment&&oldSegmentColor){
    segment.animate([{backgroundColor:oldSegmentColor},{backgroundColor:getComputedStyle(segment).backgroundColor}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  if(segment&&oldSelected>=0){
    const selected=[...segment.children].findIndex(el=>el.classList.contains('selected'));
    segment.style.setProperty('--segment-index',selected);
    if(selected!==oldSelected)segment.animate([{transform:`translateX(${oldSelected*100}%)`},{transform:`translateX(${selected*100}%)`}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)',pseudoElement:'::before'});
  }
  if(oldAnalysis){
    const direction=next==='guide'?1:-1,content=document.querySelector('.content'),moving=document.createElement('div');
    moving.className='analysis-transition-content';
    [...content.children].filter(el=>!el.classList.contains('wellness-tabs')).forEach(el=>moving.append(el));content.append(moving);
    moving.animate([{transform:`translateX(${direction*100}%)`},{transform:'translateX(0)'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});
    oldAnalysis.snapshot.animate([{transform:'translateX(0)'},{transform:`translateX(${-direction*100}%)`}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'}).finished.finally(()=>{oldAnalysis.viewport.remove();if(moving.isConnected)moving.replaceWith(...moving.children);});
    const active=document.querySelector('.nav .active');
    active?.animate([{backgroundColor:previous==='guide'?'#43c982':'#ffc94a'},{backgroundColor:next==='guide'?'#43c982':'#ffc94a'}],{duration:320});
  }
};
render();
