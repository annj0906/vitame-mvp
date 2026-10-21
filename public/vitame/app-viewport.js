'use strict';
// The desktop host has no app runtime: the frame owns state, scrolling and overlays.
(async function(){
  const desktop=window.top===window&&matchMedia('(min-width: 768px)').matches;
  if(desktop){
    const style=document.createElement('style');
    style.textContent='html,body{margin:0;width:100%;height:100%;overflow:hidden}body{display:grid;place-items:center;background:#ededf0}iframe.app-viewport{display:block;width:min(430px,100vw);height:min(900px,calc(100dvh - 32px));border:1px solid #dedee3;border-radius:24px;background:#fcfcfc;box-shadow:0 12px 40px #00000012;box-sizing:border-box}';
    document.head.append(style);
    const frame=document.createElement('iframe');
    frame.className='app-viewport';frame.title='VITAME 앱';
    frame.allow='camera';frame.src=location.href;
    document.body.replaceChildren(frame);
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
