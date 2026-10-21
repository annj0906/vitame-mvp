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
      .desktop-intro{display:none;position:fixed;right:calc(50% + 279px);top:50%;transform:translateY(-50%);width:240px;color:var(--vitame-color-neutral-black);text-align:left}
      .desktop-intro-logo{display:block;width:153px;height:44px;overflow:hidden;margin-bottom:32px}
      .desktop-intro-logo img{display:block;width:220px;height:auto;max-width:none;transform:translateX(-67px)}
      .desktop-intro h1{font:700 23px/1.5 var(--vitame-font-pretendard);letter-spacing:-.04em;margin:0 0 14px}
      .desktop-intro p{font:400 14px/1.8 var(--vitame-font-pretendard);letter-spacing:-.02em;color:#777;margin:0;word-break:keep-all}
      .desktop-intro small{display:block;margin-top:36px;font:400 11px/1.8 var(--vitame-font-pretendard);color:#999;letter-spacing:0}
      @media(min-width:1200px){.desktop-intro{display:block}}
    `;
    document.head.append(introStyle);
    const intro=document.createElement('aside');
    intro.className='desktop-intro';intro.setAttribute('aria-label','프로젝트 소개');
    intro.innerHTML='<span class="desktop-intro-logo"><img src="assets/onboarding/logo.png" alt="VITAME"></span><h1>영양제를 챙기는<br>작은 습관</h1><p>등록부터 복용 기록까지,<br>나만의 건강 루틴</p><small>개인 프로젝트<br>UX/UI Design &amp; Front-end</small>';
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
