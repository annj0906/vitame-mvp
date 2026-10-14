'use strict';

// Keep the preview's running character/decorations when it becomes the current slide.
const onboardingPreviewNodes=new Map();
const previewBeforeOnboardingFlow=onboardingPreview;
onboardingPreview=function(index){
  const node=previewBeforeOnboardingFlow(index);
  if(node)onboardingPreviewNodes.set(index,node);
  return node;
};
function commitOnboardingSlide(index){
  const preview=onboardingPreviewNodes.get(index);
  introPage=index;render();
  if(!preview)return;
  preview.removeAttribute('style');preview.removeAttribute('aria-hidden');
  preview.inert=false;preview.classList.remove('continuous-slide-preview');
  delete preview.dataset.slideSide;
  document.querySelector('.onboarding-panel')?.replaceWith(preview);
}
onboardingSlideAdapter.commit=direction=>commitOnboardingSlide(introPage+direction);
changeOnboarding=function(index){
  index=Math.max(0,Math.min(2,index));
  const panel=document.querySelector('.onboarding-panel');
  if(index===introPage||!panel)return;
  const direction=index>introPage?1:-1;
  animateSlide(panel,{...onboardingSlideAdapter,preview:side=>side===direction?onboardingPreview(index):null,commit:()=>commitOnboardingSlide(index)},direction);
};

const onboardingFlowRoutes=['onboarding','health-interests','setup-frequency','setup-difficulty','setup-register','setup-complete'];
let onboardingFlowPrevious=route(),onboardingFlowAnimations=[],onboardingFlowOutgoing=null;
function clearOnboardingTransition(){
  onboardingFlowAnimations.forEach(animation=>animation.cancel());
  onboardingFlowAnimations=[];onboardingFlowOutgoing?.remove();onboardingFlowOutgoing=null;
  const app=document.querySelector('#app');
  app.classList.remove('onboarding-transition');
  app.querySelector('.onboarding-flow-enter')?.classList.remove('onboarding-flow-enter');
}
const renderBeforeOnboardingFlow=render;
render=function(){
  const next=route(),previous=onboardingFlowPrevious;
  const app=document.querySelector('#app');
  clearOnboardingTransition();
  const outgoing=app.firstElementChild;
  renderBeforeOnboardingFlow();onboardingFlowPrevious=next;
  if(next==='onboarding')document.title='온보딩 · VITAME';
  if(next===previous||!outgoing||!onboardingFlowRoutes.includes(previous)||!onboardingFlowRoutes.includes(next)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const incoming=app.firstElementChild,direction=onboardingFlowRoutes.indexOf(next)>onboardingFlowRoutes.indexOf(previous)?1:-1;
  outgoing.inert=true;outgoing.setAttribute('aria-hidden','true');outgoing.classList.add('onboarding-flow-exit');
  incoming.classList.add('onboarding-flow-enter');app.classList.add('onboarding-transition');
  app.append(outgoing);onboardingFlowOutgoing=outgoing;
  const options={duration:320,easing:'cubic-bezier(.22,.75,.2,1)'};
  const exit=outgoing.animate([{transform:'translateX(0)'},{transform:`translateX(${-direction*100}%)`}],options);
  const enter=incoming.animate([{transform:`translateX(${direction*100}%)`},{transform:'translateX(0)'}],options);
  onboardingFlowAnimations=[exit,enter];
  enter.finished.then(()=>{if(onboardingFlowAnimations.includes(enter))clearOnboardingTransition();}).catch(()=>{});
};
