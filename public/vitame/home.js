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
  if (alert) alert.outerHTML = `<section class="home-alert-wrap home-scan-banner"><button class="alert-close" data-dismiss-alert aria-label="스캔 안내 닫기">${homeAsset('close')}</button><h2>스캔 한 번으로<br>비타미와 오늘을 시작해요</h2><button class="home-scan-link" data-go="scan">영양제 스캔하러 가기${homeAsset('banner-arrow')}</button><div class="home-banner-character">${initialCharacter('very-good')}<span class="home-banner-shadow">${homeAsset('shadow')}</span></div></section>`;
  const banner = template.content.querySelector('.home-scan-banner');
  if (banner) template.content.prepend(banner);
  template.content.querySelector('.footer-note')?.remove();
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
    toggle.innerHTML = homeAsset('grid') + homeAsset('list');
    toggle.classList.toggle('home-list-selected', homeDoseList);
  }
  document.querySelectorAll('.nav button[data-go]').forEach(button => {
    const destination = button.dataset.go;
    button.innerHTML = `<span class="home-nav-icon">${homeAsset(destination)}</span><span>${({home:'홈',dose:'복용',analysis:'분석',shop:'쇼핑',my:'마이'})[destination]}</span>`;
  });
};

render();
