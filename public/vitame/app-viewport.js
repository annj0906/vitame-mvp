'use strict';
const portfolioSections={
  onboarding:{color:null,title:['영양제 관리,','더 쉽고 꾸준하게'],copy:['영양제 등록부터 복용 기록,','영양 분석과 맞춤 가이드까지.']},
  home:{color:'blue',title:['오늘의 건강을','한눈에 확인해요'],copy:['건강 점수와 복용 현황을','하나의 화면에서 확인해요.']},
  dose:{color:'orange',title:['작은 체크로 만드는','꾸준한 복용 습관'],copy:['복용 시간을 관리하고,','매일의 기록을 쌓아가요.']},
  analysis:{color:'yellow',title:['쌓인 기록으로','살펴보는 나의 영양 상태'],copy:['영양소별 섭취 현황과','관리 상태를 확인해요.']},
  guide:{color:'green',title:['나에게 맞는 건강 관리,','비타미가 함께해요'],copy:['영양 상태에 맞춘 조언을','다섯 캐릭터의 개성으로 전해요.']},
  shop:{color:'pink',title:['나에게 필요한 영양제를','더 쉽게 찾아요'],copy:['건강 관심사와 영양 분석을 바탕으로','맞춤 제품을 추천해요.']},
  my:{color:'purple',title:['나만의 건강 루틴을','한곳에서 관리해요'],copy:['관심 건강부터 복용 알림까지,','나에게 맞게 설정해요.']}
};
function portfolioSection(screen,active,previous='onboarding'){
  if(/^(intro|onboarding|login|signup|health-interests|setup-|registration-complete)/.test(screen))return 'onboarding';
  if(screen==='guide')return 'guide';
  if(portfolioSections[active])return active;
  if(portfolioSections[screen])return screen;
  if(screen==='archive'||screen==='manage')return 'dose';
  if(/^(shop-|cart$|likes$|detail$)/.test(screen))return 'shop';
  if(/^(my|profile|interest-settings)/.test(screen))return 'my';
  if(screen==='nutrients')return 'analysis';
  return previous;
}
// The desktop host has no app runtime: the frame owns state, scrolling and overlays.
(async function(){
  const desktop=window.top===window&&matchMedia('(min-width: 768px)').matches;
  if(desktop){
    const style=document.createElement('style');
    style.textContent='html,body{margin:0;width:100%;height:100%;overflow:hidden}body{display:grid;place-items:center;background:#ededf0}iframe.app-viewport{display:block;width:min(430px,100vw);height:min(900px,calc(100dvh - 32px));border:1px solid #dedee3;border-radius:24px;background:#fcfcfc;box-shadow:0 12px 40px #00000012;box-sizing:border-box}';
    document.head.append(style);
    const introStyle=document.createElement('style');
    introStyle.textContent=`
      .desktop-intro{display:none;position:fixed;right:calc(50% + 407px);top:50%;transform:translateY(-50%);width:320px;color:var(--vitame-color-neutral-black);text-align:left}
      .desktop-intro-logo{display:block;width:270px;margin-bottom:56px}
      .desktop-intro-logo img{display:block;width:100%;height:auto;max-width:none}
      .desktop-intro h1{font:800 29px/1.3 var(--vitame-font-nanum-square-round);letter-spacing:-.035em;margin:0 0 24px}
      .desktop-intro p{font:400 18px/1.6 var(--vitame-font-nanum-square-round);letter-spacing:-.025em;color:#777;margin:0;word-break:keep-all}
      .desktop-intro small{display:block;margin-top:64px;font:400 13px/1.9 var(--vitame-font-pretendard);color:#999;letter-spacing:-.01em}
      @media(min-width:1520px){.desktop-intro{display:block}}
      body{transition:background-color 500ms ease}
      .desktop-intro-copy{height:176px}
      .desktop-intro h1{font-size:28px;height:74px}
      .desktop-intro p{font-size:17px}
      @media(prefers-reduced-motion:reduce){body{transition:none}}
    `;
    document.head.append(introStyle);
    const intro=document.createElement('aside');
    intro.className='desktop-intro';intro.setAttribute('aria-label','프로젝트 소개');
    intro.innerHTML='<span class="desktop-intro-logo"><img src="assets/onboarding/logo.png" alt="VITAME"></span><h1>영양제 관리,<br>더 쉽고 꾸준하게</h1><p>영양제 등록부터 복용 기록,<br>영양 분석과 맞춤 가이드까지.</p><small>개인 프로젝트 · 2026.09.21 — 2026.10.21<br>UX/UI Design &amp; Front-end Development</small>';
    const copy=document.createElement('div');copy.className='desktop-intro-copy';
    copy.append(intro.querySelector('h1'),intro.querySelector('p'));
    intro.querySelector('small').before(copy);
    let section='',copyVersion=0;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    async function updatePortfolio(){
      const doc=frame.contentDocument;if(!doc?.body)return;
      const next=portfolioSection(doc.body.dataset.screen||frame.contentWindow.location.hash.slice(1),doc.querySelector('.nav')?.dataset.active,section||'onboarding');
      if(next===section)return;
      section=next;document.body.dataset.portfolioSection=next;
      const info=portfolioSections[next],version=++copyVersion;
      document.body.style.backgroundColor=info.color?`var(--vitame-color-accent-${info.color}-light)`:'#ededf0';
      const opacity=getComputedStyle(copy).opacity;
      copy.getAnimations().forEach(a=>a.cancel());
      if(!reduced.matches){
        const out=copy.animate([{opacity},{opacity:0}],{duration:110,fill:'forwards'});
        try{await out.finished;}catch{return;}
      }
      if(version!==copyVersion)return;
      copy.querySelector('h1').innerHTML=info.title.join('<br>');
      copy.querySelector('p').innerHTML=info.copy.join('<br>');
      copy.getAnimations().forEach(a=>a.cancel());
      if(!reduced.matches)copy.animate([{opacity:0},{opacity:1}],{duration:180,easing:'ease-out'});
    }
    const frame=document.createElement('iframe');
    frame.className='app-viewport';frame.title='VITAME 앱';
    frame.allow='camera';frame.src=location.href;
    document.body.replaceChildren(intro,frame);
    let child;
    frame.addEventListener('load',()=>{
      child=frame.contentWindow;
      const observer=new MutationObserver(updatePortfolio);
      observer.observe(frame.contentDocument.body,{subtree:true,childList:true,attributes:true,attributeFilter:['data-screen','data-active']});
      updatePortfolio();
      child.addEventListener('hashchange',()=>{
        if(location.hash!==child.location.hash)history.replaceState(null,'',location.pathname+location.search+child.location.hash);
      });
    });
    window.addEventListener('hashchange',()=>{if(child&&child.location.hash!==location.hash)child.location.hash=location.hash;});
    return;
  }
  if(window.top!==window){
    const style=document.createElement('style');
    style.textContent='html,body{scrollbar-width:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none;width:0;height:0}';
    document.head.append(style);
  }
  const files=['home-calendar','app','revision','welcome','onboarding','setup','scanner','analysis','home','care','registration','shop','my-pages','onboarding-flow','utility-pages'];
  for(const file of files){
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=file+'.js';script.onload=resolve;script.onerror=reject;document.body.append(script);
    });
  }
})();
