'use strict';
function slideCalendar(selector,direction,update){
  const old=document.querySelector(selector);
  if(!old||matchMedia('(prefers-reduced-motion: reduce)').matches){update();return;}
  const rect=old.getBoundingClientRect(),ghost=old.cloneNode(true);
  ghost.setAttribute('aria-hidden','true');ghost.inert=true;
  const overlay=document.createElement('div');
  Object.assign(overlay.style,{position:'fixed',left:'0',top:rect.top+'px',width:'100%',height:rect.height+'px',overflow:'hidden',pointerEvents:'none',zIndex:'20'});
  Object.assign(ghost.style,{position:'absolute',left:rect.left+'px',top:'0',width:rect.width+'px',margin:'0',transform:'none',background:'#fff'});
  overlay.append(ghost);document.body.append(overlay);
  update();const next=document.querySelector(selector);
  const options={duration:320,easing:'cubic-bezier(.22,.7,.2,1)'};
  ghost.animate([{transform:'translateX(0)'},{transform:`translateX(${-direction*rect.width}px)`}],options).finished.finally(()=>overlay.remove());
  next?.animate([{transform:`translateX(${direction*rect.width}px)`},{transform:'translateX(0)'}],options);
}
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
  else { calendarMonth.setMonth(calendarMonth.getMonth() + (b.dataset.cal === 'prev' ? -1 : 1)); document.querySelector('.home-calendar').outerHTML = homeCalendar(); }
});
// Touch and mouse share the same pull gesture; only the calendar surface captures it.
let calendarDrag = null, suppressCalendarClick = false;
document.addEventListener('pointerdown', e => {
  const surface = e.target.closest('.calendar-surface');
  if (!surface || e.button !== 0) return;
  calendarDrag = {x:e.clientX,y:e.clientY,id:e.pointerId,surface};
});
document.addEventListener('pointermove', e => {
  if (!calendarDrag || e.pointerId !== calendarDrag.id) return;
  const dy=e.clientY-calendarDrag.y, dx=e.clientX-calendarDrag.x;
  calendarDrag.dx=dx;
  calendarDrag.dy=dy;
  if ((calendarOpen && Math.abs(dx)>12 && Math.abs(dx)>Math.abs(dy)) || (Math.abs(dy)>12 && Math.abs(dy)>Math.abs(dx))) {
    if (!calendarDrag.surface.hasPointerCapture(e.pointerId)) calendarDrag.surface.setPointerCapture(e.pointerId);
    if(Math.abs(dy)>Math.abs(dx)) calendarDrag.surface.style.setProperty('--pull', `${Math.max(-8, Math.min(24, dy/4))}px`);
    else calendarDrag.surface.style.transform=`translateX(${dx}px)`;
  }
});
document.addEventListener('pointerup', e => {
  if (!calendarDrag || e.pointerId!==calendarDrag.id) return;
  const drag=calendarDrag; calendarDrag=null;
  drag.surface.style.removeProperty('--pull');
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if (calendarOpen && Math.abs(dx)>42 && Math.abs(dx)>Math.abs(dy)) {
    suppressCalendarClick=true;
    slideCalendar('.calendar-surface',dx<0?1:-1,()=>{calendarMonth.setMonth(calendarMonth.getMonth()+(dx<0?1:-1));document.querySelector('.home-calendar').outerHTML=homeCalendar();});
    setTimeout(()=>{suppressCalendarClick=false},0);
  } else if (Math.abs(dy)>42 && Math.abs(dy)>Math.abs(dx)) {
    suppressCalendarClick=true;
    setCalendarOpen(dy>0);
    setTimeout(()=>{suppressCalendarClick=false},0);
  } else drag.surface.style.transform='';
});
document.addEventListener('pointercancel',()=>{if(calendarDrag){calendarDrag.surface.style.removeProperty('--pull');calendarDrag.surface.style.transform='';}calendarDrag=null;});
document.addEventListener('click', e=>{if(suppressCalendarClick){e.preventDefault();e.stopImmediatePropagation();}},true);
