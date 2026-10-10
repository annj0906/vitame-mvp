'use strict';

// A local three-page viewport: both neighbours exist before the first drag frame.
// Adapters render previews with temporary state, then commit only after settling.
const slideAdapters=[];
const slideImageSources=new Set();
let liveSlide=null,slideClickUntil=0;
function slideElement(html,selector){
  const template=document.createElement('template');template.innerHTML=html;
  return template.content.querySelector(selector);
}
function prepareSlide(element,adapter){
  const neighbours=[adapter.preview(-1),adapter.preview(1)];
  neighbours.filter(Boolean).forEach(node=>node.querySelectorAll('img').forEach(img=>{
    if(slideImageSources.has(img.src))return;
    slideImageSources.add(img.src);const preload=new Image();preload.src=img.src;
    if(preload.decode)preload.decode().catch(()=>slideImageSources.delete(img.src));
  }));
  return {element,adapter,neighbours,width:element.getBoundingClientRect().width};
}
function mountSlide(s){
  const frame=document.createElement('div');frame.className='continuous-slide-viewport';
  const rect=s.element.getBoundingClientRect();s.originalStyle=s.element.getAttribute('style');
  frame.style.height=rect.height+'px';s.element.before(frame);frame.append(s.element);
  s.frame=frame;s.pages=[s.element];s.transforms=[getComputedStyle(s.element).transform];
  s.neighbours.forEach((node,i)=>{
    if(!node)return;
    node.inert=true;node.setAttribute('aria-hidden','true');node.classList.add('continuous-slide-preview');
    frame.append(node);s.pages.push(node);s.transforms.push(getComputedStyle(node).transform);
    node.dataset.slideSide=i===0?'-1':'1';
  });
  s.pages.forEach(node=>{node.style.width=s.width+'px';node.style.margin='0';node.style.transition='none';});
  // Reserve enough room for six-week months while dragging; never crop their last row.
  frame.style.height=Math.max(rect.height,...s.pages.map(node=>node.scrollHeight))+'px';
  moveSlide(s,0);
}
function moveSlide(s,dx){
  const direction=dx<0?1:-1;
  s.offset=s.neighbours[direction===1?1:0]?Math.max(-s.width,Math.min(s.width,dx)):dx*.2;
  s.pages.forEach((node,i)=>{
    const base=i===0?0:Number(node.dataset.slideSide)*s.width;
    node.style.transform=`translate3d(${base+s.offset}px,0,0) ${s.transforms[i]==='none'?'':s.transforms[i]}`;
  });
}
function cleanSlide(s){
  if(!s.frame)return;
  if(s.originalStyle===null)s.element.removeAttribute('style');else s.element.setAttribute('style',s.originalStyle);
  if(s.frame.isConnected)s.frame.replaceWith(s.element);
}
function settleSlide(s,direction){
  s.settling=true;
  if(!s.neighbours[direction===1?1:0])direction=0;
  const from=s.offset,to=-direction*s.width,duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:240;
  const started=performance.now();
  function tick(now){
    if(liveSlide!==s||!s.frame.isConnected)return;
    const t=duration?Math.min(1,(now-started)/duration):1;
    moveSlide(s,from+(to-from)*(1-Math.pow(1-t,3)));
    if(t<1)s.animation=requestAnimationFrame(tick);
    else{cleanSlide(s);liveSlide=null;if(direction){s.adapter.commit(direction);warmSlideImages();}}
  }
  s.animation=requestAnimationFrame(tick);
}
function animateSlide(element,adapter,direction){
  if(liveSlide)return;
  const s=prepareSlide(element,adapter);liveSlide=s;mountSlide(s);settleSlide(s,direction);
}
document.addEventListener('pointerdown',e=>{
  if(e.button!==0||!e.isPrimary)return;
  const adapter=slideAdapters.find(a=>e.target.closest(a.selector));if(!adapter)return;
  e.stopImmediatePropagation();if(liveSlide)return;
  const element=e.target.closest(adapter.selector),s=prepareSlide(element,adapter);
  Object.assign(s,{id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastTime:performance.now(),velocity:0,active:false,handle:!!e.target.closest('.calendar-handle')});
  liveSlide=s;
},true);
document.addEventListener('pointermove',e=>{
  const s=liveSlide;if(!s||s.settling||s.id!==e.pointerId)return;
  const dx=e.clientX-s.x,dy=e.clientY-s.y,now=performance.now();
  if(!s.active){
    if(Math.abs(dy)>6&&Math.abs(dy)>Math.abs(dx)){if(s.handle){s.vertical=true;return;}liveSlide=null;return;}
    if(Math.abs(dx)<6||Math.abs(dx)<=Math.abs(dy))return;
    s.active=true;mountSlide(s);s.frame.setPointerCapture(e.pointerId);
  }
  e.preventDefault();e.stopImmediatePropagation();
  s.velocity=(e.clientX-s.lastX)/Math.max(1,now-s.lastTime);s.lastX=e.clientX;s.lastTime=now;
  moveSlide(s,dx);
},{capture:true,passive:false});
function endLiveSlide(e){
  const s=liveSlide;if(!s||s.settling||s.id!==e.pointerId)return;
  if(!s.active){liveSlide=null;if(s.vertical&&e.type!=='pointercancel'&&Math.abs(e.clientY-s.y)>42){slideClickUntil=performance.now()+350;setCalendarOpen(e.clientY>s.y);}return;}
  e.stopImmediatePropagation();slideClickUntil=performance.now()+350;
  const dx=e.clientX-s.x,velocity=performance.now()-s.lastTime<100?s.velocity:0;
  const advance=e.type!=='pointercancel'&&(Math.abs(dx)>s.width*.22||(Math.abs(dx)>10&&Math.abs(velocity)>.45&&dx*velocity>0));
  settleSlide(s,advance?(dx<0?1:-1):0);
}
document.addEventListener('pointerup',endLiveSlide,true);
document.addEventListener('pointercancel',endLiveSlide,true);
document.addEventListener('click',e=>{
  if(performance.now()<slideClickUntil&&e.target.closest('.continuous-slide-viewport,'+slideAdapters.map(a=>a.selector).join(','))){e.preventDefault();e.stopImmediatePropagation();}
},true);
function cancelLiveSlide(){if(liveSlide){cancelAnimationFrame(liveSlide.animation);cleanSlide(liveSlide);liveSlide=null;}}
window.addEventListener('hashchange',cancelLiveSlide);
function warmSlideImages(){
  slideAdapters.forEach(adapter=>{const element=document.querySelector(adapter.selector);if(element)prepareSlide(element,adapter);});
}
window.addEventListener('hashchange',()=>requestAnimationFrame(warmSlideImages));
window.addEventListener('resize',cancelLiveSlide);
window.addEventListener('blur',cancelLiveSlide);
document.addEventListener('lostpointercapture',e=>{const s=liveSlide;if(s?.active&&!s.settling&&s.id===e.pointerId)settleSlide(s,0);},true);
document.addEventListener('dragstart',e=>{if(slideAdapters.some(a=>e.target.closest(a.selector)))e.preventDefault();});
let calendarOpen = false;
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
function homeCalendar() {
  const selected = new Date(selectedDate + 'T12:00:00');
  const start = new Date(selected);
  start.setDate(start.getDate() - start.getDay());
  const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cell = (day, weekly = false) => {
    const key = dateKey(day), picked = key === selectedDate;
    const recorded = Object.values(state.records[key] || {}).some(Boolean);
    return `<button class="calendar-day ${picked ? 'picked' : ''} ${key === dateKey() ? 'is-today' : ''}" data-cal="select" data-date="${key}" aria-label="${day.getFullYear()}년 ${day.getMonth()+1}월 ${day.getDate()}일 ${weekdays[day.getDay()]}요일${recorded ? ', 복용 기록 있음' : ''}" aria-pressed="${picked}" ${key > dateKey() ? 'disabled' : ''}>${weekly ? `<span class="day-label">${weekdays[day.getDay()]}</span>` : ''}<span class="day-number">${day.getDate()}</span><i class="record-dot ${recorded ? 'recorded' : ''}"></i></button>`;
  };
  return `<header class="home-calendar ${calendarOpen ? 'expanded' : ''}" aria-label="홈 달력"><div class="calendar-toolbar"><button class="calendar-date" data-cal="toggle" aria-expanded="${calendarOpen}" aria-controls="month-calendar">${selected.getMonth()+1}월 ${selected.getDate()}일(${weekdays[selected.getDay()]})</button><div class="calendar-actions"><button class="icon-btn" data-go="scan" aria-label="영양제 스캔"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3M7 12h10"/></svg></button><button class="icon-btn" data-go="analysis" aria-label="영양 분석">${icon('chart')}</button><button class="icon-btn" data-action="notifications" aria-label="알림">${icon('bell')}</button></div></div><div class="calendar-surface"><div class="calendar-week" ${calendarOpen ? 'hidden' : ''}>${Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return cell(d,true)}).join('')}</div><section id="month-calendar" ${calendarOpen ? '' : 'hidden'} aria-label="월간 달력"><div class="month-toolbar"><button class="icon-btn" data-cal="prev" aria-label="이전 달">${icon('back')}</button><h2 aria-live="polite">${first.getFullYear()}년 ${first.getMonth()+1}월</h2><button class="icon-btn" data-cal="next" aria-label="다음 달">${icon('arrow')}</button><button class="calendar-today" data-cal="today">오늘</button></div><div class="calendar-grid weekday-labels">${weekdays.map(d=>`<span>${d}</span>`).join('')}</div><div class="calendar-grid">${'<span></span>'.repeat(first.getDay())}${Array.from({length:count},(_,i)=>cell(new Date(first.getFullYear(),first.getMonth(),i+1))).join('')}</div></section><button class="calendar-handle" data-cal="toggle" aria-label="${calendarOpen ? '달력 접기' : '월간 달력 펼치기'}" aria-expanded="${calendarOpen}" aria-controls="month-calendar"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 8 5 5 5-5m-10 6 5 5 5-5"/></svg></button></div></header>`;
}
function setCalendarOpen(open) {
  calendarOpen = open;
  if (open) { const d = new Date(selectedDate + 'T12:00:00'); calendarMonth = new Date(d.getFullYear(), d.getMonth(), 1); }
  const el = document.querySelector('.home-calendar');
  if (el) el.outerHTML = homeCalendar();
}
document.addEventListener('click', event => {
  const b = event.target.closest('[data-cal]');
  if (!b || b.disabled) return;
  if (b.dataset.cal === 'toggle') setCalendarOpen(!calendarOpen);
  else if (b.dataset.cal === 'select') { selectedDate = b.dataset.date; render(); }
  else if (b.dataset.cal === 'today') { selectedDate = dateKey(); calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); render(); }
  else animateSlide(document.querySelector('.calendar-surface'),homeSlideAdapter,b.dataset.cal==='prev'?-1:1);
});

function shiftHomeSlide(direction){
  if(calendarOpen)calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+direction,1);
  else{const d=new Date(selectedDate+'T12:00:00');d.setDate(d.getDate()+direction*7);selectedDate=dateKey(d);}
}
const homeSlideAdapter={
  selector:'.calendar-surface',
  preview(direction){
    const month=calendarMonth,date=selectedDate;
    try{shiftHomeSlide(direction);return slideElement(homeCalendar(),'.calendar-surface');}
    finally{calendarMonth=month;selectedDate=date;}
  },
  commit(direction){shiftHomeSlide(direction);render();}
};
slideAdapters.push(homeSlideAdapter);
