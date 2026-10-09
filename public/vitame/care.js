'use strict';
const careAsset=name=>`<img src="assets/care/${name}.svg" alt="">`;
const careScreens=['dose','archive','analysis'];
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
  const r=route();
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
    cta.querySelector('button').insertAdjacentHTML('beforebegin',`<div class="care-guide-character">${initialCharacter('normal')}${careAsset('shadow')}</div>`);
    document.querySelector('.analysis-month-score').innerHTML=document.querySelector('.analysis-month-score').textContent.replace('점','<small>점</small>');
  }
  document.querySelectorAll('.nav button').forEach(b=>{const key=b.dataset.go;b.innerHTML=`<span class="care-nav-icon">${careAsset('nav-'+key+(key===r?'-active':''))}</span><span>${({home:'홈',dose:'복용',analysis:'분석',shop:'쇼핑',my:'마이'})[key]}</span>`;});
};
// Tapping the non-interactive card area reuses the existing accordion handler.
document.addEventListener('click',e=>{
  if(route()!=='analysis'||e.target.closest('button,a'))return;
  e.target.closest('.nutrition-panel')?.querySelector('[data-nutrition-toggle]').click();
});
render();
