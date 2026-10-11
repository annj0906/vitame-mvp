'use strict';
// Registration owns its draft; the existing OCR draft and supplement store remain shared.
let registrationTab='search',registrationQuery='',registrationSelection=null,registrationDraft=null;
let registrationSource='search',registrationOcrDraft=null;
const registrationDays=['일','월','화','수','목','금','토'];
// Names/images come from the supplied WebP labels and Figma; no nutrition is inferred.
const registrationProducts=[...products,...[
  ['daily-balance','데일리 멀티비타민 미네랄 (30일분)'],
  ['night-balance','나이트 밸런스 마그네슘 구미 (30일분)'],
  ['eye-berry','아이 베리 루테인 구미'],['eye-balance','아이 밸런스 루테인·지아잔틴'],
  ['eye-care','아이 케어 비타민 A·오메가3'],['daily-energy','데일리 에너지 비타민 B 콤플렉스'],
  ['goodnight','굿나잇 마그네슘 스틱'],['gut-health','장 건강 프로바이오틱스']
].map(([key,name])=>({id:'registration-'+key,name,brand:'VITAME',image:`assets/registration/${key}.webp`,ingredients:''}))];
const registrationAsset=name=>`<img src="assets/registration/${name}.svg" alt="">`;
function newRegistrationDraft(){return {name:'',brand:'',dose:1,doseUnit:'정',ingredients:[],times:['08:00'],days:[0,1,2,3,4,5,6],notifications:false,colorIndex:0};}
function ensureRegistrationDraft(){return registrationDraft ||=newRegistrationDraft();}
function validRegistrationDraft(d){return d.name.trim()&&Number.isFinite(d.dose)&&d.dose>0&&d.ingredients.every(n=>n.name.trim()&&Number.isFinite(n.amount)&&n.amount>0);}
function registrationHeader(title,back){return `<header class="registration-header"><button type="button" data-registration="${back}" aria-label="뒤로"><img src="assets/scan/back.svg" alt=""></button><h1>${title}</h1></header>`;}
function registrationProduct(p){const tags=p.id==='registration-daily-balance'?['immunity','energy']:p.id==='registration-night-balance'?['bone','sleep']:[];return `<span class="registration-product-art">${p.image?`<img src="${p.image}" alt="${esc(p.name)}">`:bottle(p.color)}</span><span class="registration-product-copy">${p.brand?`<b>${esc(p.brand)}</b>`:''}<span>${esc(p.name)}</span>${tags.length?`<span class="registration-tags">${tags.map(t=>`<span class="${t}" aria-label="${({immunity:'면역',energy:'에너지',bone:'뼈 건강',sleep:'수면'})[t]}">${registrationAsset(t)}</span>`).join('')}</span>`:p.tag?`<small>${esc(p.tag)}</small>`:''}</span>`;}
function registrationResults(){
  const q=registrationQuery.trim().toLocaleLowerCase();
  if(!q)return `<section class="registration-recents"><h2>최근 검색어</h2><div>${(state.registrationSearches||[]).map((q,i)=>`<span><button type="button" data-registration="recent" data-index="${i}">${esc(q)}</button><button type="button" data-registration="forget" data-index="${i}" aria-label="${esc(q)} 검색 기록 삭제">×</button></span>`).join('')||'<p>최근 검색어가 없어요.</p>'}</div></section>`;
  const found=registrationProducts.filter(p=>`${p.name} ${p.brand||''} ${p.nutrient||''}`.toLocaleLowerCase().includes(q));
  return `<div class="registration-results">${found.map(p=>`<button type="button" class="registration-product" data-registration="select" data-id="${esc(p.id)}">${registrationProduct(p)}</button>`).join('')||'<p>검색 결과가 없어요. 직접 입력으로 등록해주세요.</p>'}</div>`;
}
function registrationManual(){
  const d=ensureRegistrationDraft();
  return `<form id="registration-manual" class="registration-fields">
    ${scanText&&registrationSource==='ocr'?`<aside class="ocr-review"><strong>인식 결과를 원본과 확인해주세요.</strong><details><summary>인식 원문 보기</summary><pre>${esc(scanText)}</pre></details>${uploadURL?`<img class="upload-preview" src="${uploadURL}" alt="인식한 성분표">`:''}</aside>`:''}
    <label>영양제 이름 <em>*</em><input name="name" value="${esc(d.name)}" placeholder="예) 비타민 D3" maxlength="60" required></label>
    <label>브랜드<input name="brand" value="${esc(d.brand)}" placeholder="예) VITAME" maxlength="60"></label>
    <section><h2>영양 성분</h2><div class="registration-ingredients">${d.ingredients.map((n,i)=>`<div><input name="ingredient-${i}" aria-label="${i+1}번째 성분명" value="${esc(n.name)}" placeholder="성분명" maxlength="40" required><input name="amount-${i}" aria-label="${i+1}번째 함량" type="number" min="0.01" max="1000000" step="any" value="${esc(n.amount)}" placeholder="함량" required><select name="unit-${i}" aria-label="${i+1}번째 단위">${['mg','μg','IU','g'].map(u=>`<option ${u===n.unit?'selected':''}>${u}</option>`).join('')}</select><button type="button" data-registration="remove-ingredient" data-index="${i}" aria-label="${i+1}번째 성분 삭제">${registrationAsset('minus')}</button></div>`).join('')}</div><button type="button" class="registration-add" data-registration="add-ingredient">+ 성분 추가</button></section>
    <label>1회 복용량 <em>*</em><span class="registration-dose"><input name="dose" aria-label="1회 복용량" type="number" min="0.01" max="1000000" step="any" value="${d.dose}" required><select name="doseUnit" aria-label="복용 형태">${['정','캡슐','포','구미','방울','mL','g'].map(u=>`<option ${u===d.doseUnit?'selected':''}>${u}</option>`).join('')}</select></span></label>
    <button class="registration-primary" type="submit">복용 설정하기</button></form>`;
}
function registrationScreen(){
  return `<section class="registration-screen">${registrationHeader('영양제 등록','back-scan')}<main class="registration-content"><div class="registration-tabs" role="tablist" aria-label="등록 방법"><button id="registration-search-tab" role="tab" aria-selected="${registrationTab==='search'}" aria-controls="registration-panel" data-registration="search">영양제 검색</button><button id="registration-manual-tab" role="tab" aria-selected="${registrationTab==='manual'}" aria-controls="registration-panel" data-registration="manual">직접 입력</button></div><div id="registration-panel" role="tabpanel" aria-labelledby="registration-${registrationTab}-tab">${registrationTab==='manual'?registrationManual():`<form id="registration-search" class="registration-search"><input name="query" type="search" aria-label="영양제 검색" placeholder="제품명이나 브랜드명을 입력해보세요" value="${esc(registrationQuery)}"><button type="submit" aria-label="검색">${icon('arrow')}</button></form><div id="registration-results">${registrationResults()}</div>`}</div></main></section>`;
}
function readRegistrationForm(){
  const form=$('#registration-manual');if(!form)return;
  const f=new FormData(form),d=ensureRegistrationDraft();
  Object.assign(d,{name:String(f.get('name')||''),brand:String(f.get('brand')||''),dose:Number(f.get('dose')),doseUnit:f.get('doseUnit'),ingredients:d.ingredients.map((_,i)=>({name:String(f.get(`ingredient-${i}`)||''),amount:f.get(`amount-${i}`)===''?'':Number(f.get(`amount-${i}`)),unit:f.get(`unit-${i}`)}))});
}
function registrationTimeLabel(time){const [h,m]=time.split(':').map(Number);return `${h<12?'오전':'오후'} ${String(h%12||12).padStart(2,'0')}:${String(m).padStart(2,'0')}`;}
function registrationSettings(){
  const d=ensureRegistrationDraft();
  return `<section class="registration-screen">${registrationHeader('복용 설정','back-entry')}<form id="registration-settings" class="registration-content registration-settings"><section><h2>영양제 정보</h2><p>영양제 이름과 아이콘을 변경해보세요.</p><div class="registration-name"><button type="button" data-registration="icon" aria-label="영양제 아이콘 변경">${d.colorIndex===0?registrationAsset('edit-icon'):`<span class="pill p${d.colorIndex}"></span>`}</button><label><span>이름</span><input name="name" aria-label="영양제 이름" maxlength="60" value="${esc(d.name)}" required></label></div></section>
    <section><h2>복용 시간</h2><p>언제 챙겨드시나요?</p><div class="registration-times">${d.times.map((t,i)=>`<div><button type="button" data-registration="time" data-index="${i}">${registrationTimeLabel(t)}</button><button type="button" data-registration="remove-time" data-index="${i}" aria-label="${registrationTimeLabel(t)} 삭제">${registrationAsset('time-minus')}</button></div>`).join('')}</div><button type="button" class="registration-add" data-registration="add-time">+ 시간 추가</button></section>
    <section><h2>복용 요일</h2><div class="registration-days">${registrationDays.map((day,i)=>`<button type="button" data-registration="day" data-index="${i}" aria-pressed="${d.days.includes(i)}">${day}</button>`).join('')}</div></section>
    <section class="registration-notifications"><div><h2>복용 알림 받기</h2><p>설정한 시간에 알려드릴게요.</p></div><input type="checkbox" name="notifications" role="switch" aria-label="복용 알림 받기" ${d.notifications?'checked':''}></section>
    <button class="registration-primary" type="submit">등록하기</button></form></section>`;
}
function rememberRegistrationSearch(){const q=registrationQuery.trim();if(!q)return;state.registrationSearches=[q,...(state.registrationSearches||[]).filter(x=>x!==q)].slice(0,8);save();}
function registrationDialog(html){const dialog=$('#dialog');dialog.classList.add('registration-sheet');dialog.innerHTML=`<div class="registration-handle"></div>${html}`;dialog.showModal();}
function closeRegistrationDialog(){const dialog=$('#dialog');if(dialog.classList.contains('registration-sheet')){dialog.close();dialog.classList.remove('registration-sheet');dialog.innerHTML='';}}
function confirmRegistrationProduct(p){registrationSelection=p;rememberRegistrationSearch();registrationDialog(`<div class="registration-product">${registrationProduct(p)}</div><h2>이 영양제로 복용 설정을 이어갈까요?</h2>${!p.ingredients?'<p class="registration-missing">성분·함량 미등록 <button data-registration="review-product">직접 입력으로 확인</button></p>':''}<div class="registration-sheet-actions"><button data-registration="dismiss">다시 선택</button><button class="registration-primary" data-registration="confirm">복용 설정하기</button></div>`);}
function useRegistrationProduct(){const p=registrationSelection;if(!p)return false;if(registrationDraft?.productId!==p.id){const parsed=parseLabelText(p.ingredients||'');registrationDraft={...newRegistrationDraft(),name:p.name,brand:p.brand||'',productId:p.id,ingredients:parsed.ingredients.filter(n=>n.name&&n.amount)};}return true;}
function openRegistrationTime(index){
  const d=ensureRegistrationDraft(),time=d.times[index]||'08:00',[h,m]=time.split(':').map(Number);
  registrationDialog(`<h2>복용 시간</h2><div class="registration-wheel" data-time-index="${index}">${[['오전','오후'],Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')),Array.from({length:60},(_,i)=>String(i).padStart(2,'0'))].map((values,col)=>`<div class="registration-wheel-column" role="listbox" aria-label="${['오전·오후','시','분'][col]}" tabindex="0" data-wheel="${col}">${values.map((value,i)=>`<button type="button" role="option" aria-selected="false" data-wheel-value="${i}">${value}</button>`).join('')}</div>`).join('')}</div><div class="registration-sheet-actions"><button data-registration="dismiss">취소</button><button class="registration-primary" data-registration="save-time">확인</button></div>`);
  const values=[h<12?0:1,(h%12||12)-1,m];document.querySelectorAll('[data-wheel]').forEach((el,i)=>{el.scrollTop=values[i]*44;updateRegistrationWheel(el);});
}
function updateRegistrationWheel(el){const index=Math.max(0,Math.min(el.children.length-1,Math.round(el.scrollTop/44)));el.dataset.value=index;Array.from(el.children).forEach((b,i)=>b.setAttribute('aria-selected',String(i===index)));}
const beforeRegistration=render;
render=function(){
  const r=route();if(!['supplement-register','registration-settings','result'].includes(r)){beforeRegistration();return;}
  clearTimeout(introTimer);
  if(r==='result'){registrationTab='manual';registrationSource='ocr';if(draft&&registrationOcrDraft!==draft){registrationOcrDraft=draft;registrationDraft={...newRegistrationDraft(),...draft,times:[draft.time||'08:00'],ingredients:draft.ingredients.map(n=>({...n}))};}}
  document.body.dataset.screen='registration';document.title=(r==='registration-settings'?'복용 설정':'영양제 등록')+' · VITAME';$('#app').innerHTML=r==='registration-settings'?registrationSettings():registrationScreen();
};
document.addEventListener('input',e=>{
  if(e.target.closest('#registration-manual'))readRegistrationForm();
  if(e.target.closest('#registration-settings')){const d=ensureRegistrationDraft();if(e.target.name==='name')d.name=e.target.value;if(e.target.name==='notifications')d.notifications=e.target.checked;}
  if(e.target.matches('#registration-search input')){registrationQuery=e.target.value;$('#registration-results').innerHTML=registrationResults();}
});
document.addEventListener('change',e=>{if(e.target.closest('#registration-manual'))readRegistrationForm();if(e.target.matches('#registration-settings [name="notifications"]'))ensureRegistrationDraft().notifications=e.target.checked;});
document.addEventListener('click',e=>{
  const wheel=e.target.closest('[data-wheel-value]');if(wheel){wheel.parentElement.scrollTo({top:Number(wheel.dataset.wheelValue)*44,behavior:'smooth'});return;}
  const b=e.target.closest('[data-registration]');if(!b)return;
  const a=b.dataset.registration,i=Number(b.dataset.index),d=ensureRegistrationDraft();
  if(a==='start'){registrationTab='search';go('supplement-register');}
  else if(a==='back-scan'){readRegistrationForm();go('scan');}
  else if(a==='back-entry'){go(registrationSource==='ocr'?'result':'supplement-register');}
  else if(a==='search'||a==='manual'){readRegistrationForm();registrationTab=a;if(a==='manual'&&registrationSource!=='ocr')registrationSource='manual';render();}
  else if(a==='add-ingredient'){readRegistrationForm();d.ingredients.push({name:'',amount:'',unit:'mg'});render();}
  else if(a==='remove-ingredient'){readRegistrationForm();d.ingredients.splice(i,1);render();}
  else if(a==='recent'){registrationQuery=state.registrationSearches[i];render();}
  else if(a==='forget'){state.registrationSearches.splice(i,1);save();render();}
  else if(a==='select'){const p=registrationProducts.find(p=>p.id===b.dataset.id);if(p)confirmRegistrationProduct(p);}
  else if(a==='dismiss')closeRegistrationDialog();
  else if(a==='confirm'){
    if(!useRegistrationProduct())return;
    registrationSource='search';registrationTab='search';closeRegistrationDialog();go('registration-settings');
  }
  else if(a==='review-product'){if(!useRegistrationProduct())return;registrationSource='manual';registrationTab='manual';closeRegistrationDialog();render();}
  else if(a==='time')openRegistrationTime(i);
  else if(a==='add-time')openRegistrationTime(d.times.length);
  else if(a==='remove-time'){if(d.times.length===1){toast('복용 시간을 한 개 이상 설정해주세요.');return;}d.times.splice(i,1);render();}
  else if(a==='day'){d.days=d.days.includes(i)?d.days.filter(day=>day!==i):[...d.days,i].sort();b.setAttribute('aria-pressed',String(d.days.includes(i)));}
  else if(a==='icon')registrationDialog(`<h2>영양제 아이콘</h2><div class="registration-icons">${[0,1,2,3].map(i=>`<button data-registration="pick-icon" data-index="${i}" aria-label="아이콘 ${i+1}" aria-pressed="${d.colorIndex===i}"><span class="pill p${i}"></span></button>`).join('')}</div><button data-registration="dismiss">닫기</button>`);
  else if(a==='pick-icon'){d.colorIndex=i;closeRegistrationDialog();render();}
  else if(a==='save-time'){
    const cols=Array.from(document.querySelectorAll('[data-wheel]'));cols.forEach(updateRegistrationWheel);const [period,h,m]=cols.map(c=>Number(c.dataset.value));
    const time=`${String((h+1)%12+period*12).padStart(2,'0')}:${String(m).padStart(2,'0')}`,index=Number($('.registration-wheel').dataset.timeIndex);
    if(d.times.some((t,i)=>t===time&&i!==index)){toast('이미 추가한 시간이에요.');return;}d.times[index]=time;closeRegistrationDialog();render();
  }
});
document.addEventListener('scroll',e=>{if(e.target.matches?.('[data-wheel]'))updateRegistrationWheel(e.target);},true);
document.addEventListener('keydown',e=>{const c=e.target.closest?.('[data-wheel]');if(c&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();c.scrollTop+=(e.key==='ArrowUp'?-44:44);updateRegistrationWheel(c);}});
document.addEventListener('submit',e=>{
  if(e.target.id==='registration-search'){e.preventDefault();rememberRegistrationSearch();$('#registration-results').innerHTML=registrationResults();}
  if(e.target.id==='registration-manual'){e.preventDefault();readRegistrationForm();if(!e.target.reportValidity())return;if(!validRegistrationDraft(ensureRegistrationDraft())){toast('제품명과 성분 정보를 확인해주세요.');return;}registrationSource=route()==='result'?'ocr':'manual';go('registration-settings');}
  if(e.target.id==='registration-settings'){
    e.preventDefault();const d=ensureRegistrationDraft();if(!e.target.reportValidity())return;if(!validRegistrationDraft(d)){toast('제품명과 성분 정보를 확인해주세요.');return;}if(!d.days.length){toast('복용 요일을 선택해주세요.');return;}
    // Keep legacy time/frequency fields for existing list, edit and analysis consumers.
    state.supplements.push({...d,name:d.name.trim(),id:'s-'+Date.now(),time:d.times[0],frequency:d.days.length===7?'매일':d.days.map(i=>registrationDays[i]).join('·'),ingredientsStatus:d.ingredients.length?'registered':'unregistered',ingredients:d.ingredients.map(n=>({...n}))});
    state.started=true;save();registrationDraft=null;draft=null;registrationOcrDraft=null;registrationSelection=null;scanText='';if(uploadURL){URL.revokeObjectURL(uploadURL);uploadURL='';}go('dose');toast('영양제를 등록했어요.');
  }
});
window.addEventListener('hashchange',closeRegistrationDialog);
render();
