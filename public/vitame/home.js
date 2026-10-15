'use strict';

// Home-only presentation; calendar, records, score and route handlers stay shared.
const homeAsset = name => `<img src="assets/home/${name}.svg" alt="">`;
const calendarBeforeFinalHome = homeCalendar;
homeCalendar = function() {
  const template = document.createElement('template');
  template.innerHTML = calendarBeforeFinalHome();
  template.content.querySelector('.calendar-actions [data-go="analysis"]')?.remove();
  template.content.querySelector('[data-go="scan"]').innerHTML = homeAsset('scan');
  template.content.querySelector('[data-action="notifications"]').innerHTML = homeAsset('bell');
  template.content.querySelector('.calendar-handle').innerHTML = '<span class="home-calendar-grip"></span>';
  return template.innerHTML;
};

const homeBeforeFinalDesign = home;
home = function() {
  const template = document.createElement('template');
  template.innerHTML = homeBeforeFinalDesign();
  const alert = template.content.querySelector('.home-alert-wrap');
  // Reuse the existing session-only dismissal state and handler.
  if (alert) {
    // Older WebKit throws when outerHTML replaces a DocumentFragment child.
    const replacement = document.createElement('template');
    replacement.innerHTML = `<section class="home-alert-wrap home-scan-banner"><button class="alert-close" data-dismiss-alert aria-label="스캔 안내 닫기">${homeAsset('close')}</button><h2>스캔 한 번으로<br>비타미와 오늘을 시작해요</h2><button class="home-scan-link" data-go="scan">영양제 스캔하러 가기${homeAsset('banner-arrow')}</button><div class="home-banner-character">${initialCharacter('very-good')}${characterShadow('very-good', 'home-banner-shadow')}</div></section>`;
    alert.replaceWith(replacement.content);
  }
  const banner = template.content.querySelector('.home-scan-banner');
  if (banner) template.content.prepend(banner);
  template.content.querySelector('.footer-note')?.remove();
  template.content.querySelector('.home-dose .empty')?.remove();
  return template.innerHTML;
};

const renderBeforeFinalHome = render;
render = function() {
  renderBeforeFinalHome();
  if (route() !== 'home') return;
  const card = document.querySelector('.health-score-link');
  card.querySelector('.icon-btn').innerHTML = homeAsset('arrow');
  card.querySelector('.ring small')?.remove();
  card.querySelector('.score-copy>p').textContent = '복용을 유지해보세요';
  document.querySelectorAll('.home-dose .check').forEach(el => el.innerHTML = homeAsset('check'));
  const toggle = document.querySelector('[data-home-view]');
  if (toggle) {
    // Both design icons operate the existing single layout toggle.
    toggle.outerHTML = `<div class="home-view-toggle"><button data-home-view="grid" aria-label="카드형으로 보기" aria-pressed="${!homeDoseList}">${homeAsset('grid')}</button><button data-home-view="list" aria-label="목록형으로 보기" aria-pressed="${homeDoseList}">${homeAsset('list')}</button></div>`;
  }
};

const renderBeforeHomeCounts=render;
let homeCountsEntered=false;
render=function(){
  renderBeforeHomeCounts();
  if(route()!=='home'){homeCountsEntered=false;return;}
  if(homeCountsEntered||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  homeCountsEntered=true;
  const numbers=[...document.querySelectorAll('.score-stat-count b')].map(el=>({el,value:Number(el.textContent)}));
  const start=performance.now();
  function tick(now){const t=Math.min(1,(now-start)/700),ease=1-Math.pow(1-t,3);numbers.forEach(({el,value})=>{if(el.isConnected)el.textContent=Math.round(value*ease)});if(t<1&&numbers.some(n=>n.el.isConnected))requestAnimationFrame(tick);}
  requestAnimationFrame(tick);
};

render();
document.addEventListener('click',event=>{
  const banner=event.target.closest('.home-scan-banner');
  if(banner&&!event.target.closest('.alert-close,button,a'))go('scan');
});
