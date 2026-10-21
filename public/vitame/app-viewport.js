'use strict';
// The desktop host has no app runtime: the frame owns state, scrolling and overlays.
(async function(){
  const desktop=window.top===window&&matchMedia('(min-width: 768px)').matches;
  if(desktop){
    const style=document.createElement('style');
    style.textContent='html,body{margin:0;width:100%;height:100%;overflow:hidden}body{display:grid;place-items:center;background:#ededf0}iframe.app-viewport{display:block;width:min(430px,100vw);height:min(900px,calc(100dvh - 32px));border:1px solid #dedee3;border-radius:24px;background:#fcfcfc;box-shadow:0 12px 40px #00000012;box-sizing:border-box}';
    document.head.append(style);
    const introStyle=document.createElement('style');
    introStyle.textContent=`
      .desktop-intro{display:none;position:fixed;right:calc(50% + 343px);top:50%;transform:translateY(-50%);width:320px;color:var(--vitame-color-neutral-black);text-align:left}
      .desktop-intro-logo{display:block;width:300px;margin-bottom:56px}
      .desktop-intro-logo img{display:block;width:100%;height:auto;max-width:none}
      .desktop-intro h1{font:800 32px/1.3 var(--vitame-font-nanum-square-round);letter-spacing:-.035em;margin:0 0 24px}
      .desktop-intro p{font:400 18px/1.6 var(--vitame-font-nanum-square-round);letter-spacing:-.025em;color:#777;margin:0;word-break:keep-all}
      .desktop-intro small{display:block;margin-top:64px;font:400 13px/1.9 var(--vitame-font-pretendard);color:#999;letter-spacing:-.01em}
      @media(min-width:1400px){.desktop-intro{display:block}}
    `;
    document.head.append(introStyle);
    const intro=document.createElement('aside');
    intro.className='desktop-intro';intro.setAttribute('aria-label','프로젝트 소개');
    intro.innerHTML='<span class="desktop-intro-logo"><img src="assets/onboarding/logo.png" alt="VITAME"></span><h1>영양제 관리,<br>더 쉽고 꾸준하게</h1><p>영양제 등록부터 복용 기록,<br>영양 분석과 맞춤 가이드까지.</p><small>개인 프로젝트 · 2026.09.21 — 2026.10.21<br>UX/UI Design &amp; Front-end Development</small>';
    const frame=document.createElement('iframe');
    frame.className='app-viewport';frame.title='VITAME 앱';
    frame.allow='camera';frame.src=location.href;
    document.body.replaceChildren(intro,frame);
    let child;
    frame.addEventListener('load',()=>{
      child=frame.contentWindow;
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
