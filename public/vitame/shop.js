'use strict';
// Shopping presentation catalog: Figma prices/tags, original supplied WebP files.
// Keep it separate from the legacy nutrition and cart catalogs.
const shoppingProducts=[
  ...eyeGuideProducts.map(p=>({...p,image:p.id==='eye-berry'?'assets/shop/eye-berry.webp':p.image,health:p.id==='eye-berry'?['eyes','immune']:p.id==='eye-care'?['eyes','circulation']:['eyes'],original:p.id==='eye-berry'?24000:null})),
  {id:'daily-energy',name:'데일리 에너지 비타민B 콤플렉스',price:18900,discount:20,health:['energy','brain']},
  {id:'goodnight',name:'굿나잇 마그네슘 스틱 (30포)',price:16900,discount:15,health:['sleep','bones']},
  {id:'gut-health',name:'장 건강 프로바이오틱스 (30일분)',price:23900,discount:24,health:['gut']},
  {id:'daily-balance',name:'데일리 멀티비타민 미네랄 (30일분)',price:17500,original:25000,discount:30,health:['immune','energy']},
  {id:'night-balance',name:'나이트 밸런스 마그네슘 구미 (30일분)',price:15900,original:22000,discount:28,health:['bones','sleep']}
].map(p=>({brand:'VITAME',image:`assets/registration/${p.id}.webp`,...p}));
const shoppingBanners=[['나를 돌보는\n하루의 시작','작은 습관으로 만들어가는 건강한 일상'],['매일 챙기는 영양제,\n부담은 가볍게','데일리 영양제 최대 30%'],['새롭게 만나는\n나의 건강 루틴','VITAME의 새로운 제품을 만나보세요']];
const shoppingNotes=[['영양제, 언제 먹는 게\n좋을까요?','영양소별 복용 시 알아두면 좋은 팁'],['좋은 영양제 선택,\n성분표부터 알아볼까요?','함량과 영양 성분을 쉽게 읽는 방법'],['영양제 고르기 전\n확인할 세 가지','함량부터 복용 방법까지 꼼꼼하게']];
let shoppingCategory='',shoppingQuery='',shoppingFavorites=false,shoppingTimer;
const shoppingAsset=name=>`<img src="assets/shop/${name}.svg" alt="" draggable="false">`;
const shoppingLiked=id=>Array.isArray(state.shopLikes)&&state.shopLikes.includes(id);
function shoppingHeart(p){return `<button type="button" class="shop-heart" data-shop-like="${p.id}" aria-label="${esc(p.name)} 찜하기" aria-pressed="${shoppingLiked(p.id)}">${shoppingAsset(shoppingLiked(p.id)?'heart-active':'heart')}</button>`;}
function shoppingHealth(id){const g=wellnessGuides.find(g=>g.id===id);let html=finalGuideIcon(g);if(['brain','bones','skin','circulation','muscles'].includes(id))html=html.replace(/src="[^"]+"/,`src="assets/shop/${id}.svg"`);return `<span class="shop-health shop-health-${id}" title="${esc(g.title)}">${html}</span>`;}
function shoppingCard(p,deal=false){
  // Adapt the existing guide product component without changing its other callers.
  const template=document.createElement('template');template.innerHTML=guideProductCard({...p,tags:null,designOnly:true});
  const card=template.content.firstElementChild;card.querySelector('.ai-product-heart').remove();
  const art=card.querySelector('.ai-product-art'),name=card.querySelector('.ai-product-name');
  if(p.id==='eye-berry'){
    art.innerHTML=`<a href="#shop-eye-berry" aria-label="${esc(p.name)} 상세">${art.innerHTML}</a>`;
    name.innerHTML=`<a href="#shop-eye-berry">${esc(p.name)}</a>`;
  }
  art.insertAdjacentHTML('beforeend',shoppingHeart(p));
  if(deal&&p.original)card.querySelector('.ai-product-price').insertAdjacentHTML('beforeend',`<del>${money(p.original)}</del>`);
  card.querySelector('.ai-product-info').insertAdjacentHTML('beforeend',`<span class="ai-product-tags">${p.health.map(shoppingHealth).join('')}</span>`);
  return `<article class="shop-product ai-product${deal?' shop-deal':''}" data-shop-product="${p.id}">${card.innerHTML}</article>`;
}
function shoppingHeading(title,subtitle='',more='all'){return `<div class="shop-section-heading"><div><h2>${esc(title)}</h2>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div>${more?`<button data-shop-filter="${more}">전체보기 <span aria-hidden="true">›</span></button>`:''}</div>`;}
function shoppingRail(label,content,cls=''){return `<div class="shop-rail ${cls}" tabindex="0" aria-label="${label}" data-shop-rail>${content}</div>`;}
function shoppingPhotoCarousel(type,slides){return `<div class="shop-photo-carousel shop-${type}">${shoppingRail(type==='hero'?'메인 광고 배너':'비타미 건강 노트',slides.map(([title,subtitle],i)=>`<article class="shop-photo-slide"><img src="assets/shop/${type}-${i+1}.webp" alt="" draggable="false" ${type==='note'?'loading="lazy"':''}><div><h2>${esc(title).replace(/\n/g,'<br>')}</h2><p>${esc(subtitle)}</p></div></article>`).join(''),'shop-pages')}<div class="shop-dots" aria-label="${type==='hero'?'배너':'건강 노트'} 선택">${slides.map((_,i)=>`<button data-shop-slide="${i}" aria-label="${i+1}번 슬라이드" aria-pressed="${i===0}"></button>`).join('')}</div></div>`;}
function shoppingResults(){
  const active=shoppingCategory||shoppingQuery||shoppingFavorites;
  if(!active)return '';
  const found=shoppingProducts.filter(p=>(!shoppingCategory||p.health.includes(shoppingCategory))&&(!shoppingFavorites||shoppingLiked(p.id))&&(`${p.brand} ${p.name}`.toLocaleLowerCase().includes(shoppingQuery.trim().toLocaleLowerCase())));
  const title=shoppingFavorites?'찜한 상품':shoppingCategory?wellnessGuides.find(g=>g.id===shoppingCategory).title:'상품 검색';
  return `<div class="shop-section-heading"><h2>${title} <small>${found.length}</small></h2><button data-shop-reset>전체 상품</button></div><div class="shop-result-grid">${found.map(p=>shoppingCard(p)).join('')||'<p class="shop-empty">해당하는 상품이 없어요.</p>'}</div>`;
}
function shoppingNavigation(){return nav('shop');}
function shoppingHeader(detail=false){return `<header class="shop-header">${detail?'<button data-go="shop" aria-label="뒤로"><img src="assets/scan/back.svg" alt=""></button>':''}<h1>${detail?'제품 상세':'쇼핑'}</h1><div><button data-shop-favorites aria-label="찜한 상품" aria-pressed="${shoppingFavorites}">${shoppingAsset('header-heart')}</button><button data-go="cart" aria-label="장바구니">${shoppingAsset('bag')}</button></div></header>`;}
function shoppingScreen(){
  const categories=['eyes','energy','sleep','brain','gut','bones','immune','skin','circulation','muscles'];
  const curations=[['very-bad','eyes','요즘 눈이 쉽게 피로한가요?','화면을 오래 보는 날을 위한 눈 건강 제품 모음'],['good','sleep','푹 쉬어도 개운하지 않다면?','편안한 하루의 끝을 위한 수면 제품 모음'],['very-good','energy','오후만 되면 금방 지치시나요?','활력을 채워주는 에너지 제품 모음']];
  return `<div class="shopping-page">${shoppingHeader()}<main><form class="shop-search" role="search"><input type="search" aria-label="쇼핑 상품 검색" placeholder="나를 위한 영양제 찾기" value="${esc(shoppingQuery)}"><button aria-label="검색">${shoppingAsset('search')}</button></form>${shoppingPhotoCarousel('hero',shoppingBanners)}
    ${shoppingRail('건강 카테고리',categories.map(id=>`<button class="shop-category" data-shop-filter="${id}" aria-pressed="${shoppingCategory===id}">${shoppingHealth(id)}<span>${id==='eyes'?'눈':esc(wellnessGuides.find(g=>g.id===id).title)}</span></button>`).join(''),'shop-categories')}
    <section id="shop-results" class="shop-results" ${shoppingCategory||shoppingQuery||shoppingFavorites?'':'hidden'}>${shoppingResults()}</section>
    <section class="shop-section">${shoppingHeading(`${state.name} 님을 위한 추천 제품`,'현재 부족한 영양소를 바탕으로 추천했어요.','eyes')}${shoppingRail('추천 제품',shoppingProducts.slice(0,3).map(p=>shoppingCard(p)).join(''))}</section>
    <section class="shop-section">${shoppingHeading('요즘 많이 찾는 영양제','지금 가장 많은 관심을 받고 있어요.')}${shoppingRail('인기 영양제',shoppingProducts.slice(3,6).map(p=>shoppingCard(p)).join(''))}</section>
    <section class="shop-section shop-curations" aria-label="상황별 큐레이션">${shoppingRail('상황별 큐레이션',curations.map(([character,id,title,subtitle])=>`<article class="shop-curation"><div><span class="shop-curation-character">${initialCharacter(character)}</span><button data-shop-filter="${id}">전체보기 <span aria-hidden="true">›</span></button></div><h2>${title}</h2><p>${subtitle}</p></article>`).join(''),'shop-pages')}</section>
    <section class="shop-section shop-deals"><p class="shop-countdown" role="timer" aria-label="오늘의 특가 남은 시간"></p>${shoppingHeading('오늘만 이 가격에 살 수 있어요.','', 'deals')}<div class="shop-deal-list">${shoppingProducts.slice(6).map(p=>shoppingCard(p,true)).join('')}</div></section>
    <section class="shop-section shop-notes">${shoppingHeading('비타미 건강 노트','알아두면 좋은 영양제 이야기','')}${shoppingPhotoCarousel('note',shoppingNotes)}</section>
  </main>${shoppingNavigation()}</div>`;
}
function shoppingDetail(){const p=shoppingProducts[0];return `<div class="shopping-page shop-detail">${shoppingHeader(true)}<main><img class="shop-detail-hero" src="assets/shop/berry-hero.webp" alt="VITAME 아이 베리 루테인 구미"><section class="shop-detail-info"><p>VITAME</p><h2>${p.name}</h2><p class="shop-detail-price"><b>${p.discount}%</b> <strong>${money(p.price)}</strong> <del>${money(p.original)}</del></p><div class="ai-product-tags">${p.health.map(shoppingHealth).join('')}</div></section><div class="shop-detail-tabs"><a href="#shop-berry-story" data-shop-story>상세정보</a><button data-shop-unavailable="리뷰">리뷰</button><button data-shop-unavailable="Q&A">Q&A</button><button data-shop-unavailable="판매자 정보">판매자 정보</button></div>
    <section id="shop-berry-story" class="shop-berry-story"><div class="shop-berry-hand"><img src="assets/shop/berry-hand.webp" alt="손끝에 올린 블루 구미"><h2>Suger - Free,<br><strong>daily gummies.</strong></h2></div><div class="shop-berry-message"><h2>매일 바라보는 세상,<br>눈 건강도 가볍게.</h2><p>바쁜 일상 속 눈 건강 관리, 이제 말랑한<br>구미로 간편하게 시작해보세요.</p></div><div class="shop-berry-jar"><img src="assets/shop/berry-jar.webp" alt="아이 베리 구미 용기"><p class="shop-annotation-one">간편하게 챙기는<br>구미 타입</p><p class="shop-annotation-two">하루 한 구미로<br>만드는 건강 루틴</p><p class="shop-annotation-three">루테인·지아잔틴을<br>담은 배합</p></div><img class="shop-berry-pouch" src="assets/shop/berry-pouch.webp" alt="아이 베리 구미 파우치"></section><section class="shop-section">${shoppingHeading('함께 담으면 좋은 상품','','')}${shoppingRail('함께 담으면 좋은 상품',shoppingProducts.slice(3,6).map(p=>shoppingCard(p)).join(''))}</section></main><div class="shop-detail-actions">${shoppingHeart(p)}<button data-shop-unavailable="장바구니 담기" aria-label="아이 베리 장바구니 담기">${shoppingAsset('bag')}</button><button class="shop-buy" data-shop-unavailable="구매">바로 구매하기</button></div></div>`;}
function updateShoppingResults(scroll=false){
  const target=$('#shop-results');if(!target)return;
  target.innerHTML=shoppingResults();target.hidden=!target.innerHTML;
  document.querySelectorAll('.shop-category').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shopFilter===shoppingCategory)));
  document.querySelectorAll('[data-shop-favorites]').forEach(b=>b.setAttribute('aria-pressed',String(shoppingFavorites)));
  if(scroll&&!target.hidden)target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}
function updateShoppingTimer(){const el=$('.shop-countdown');if(!el)return;const now=new Date(),end=new Date(now);end.setHours(24,0,0,0);const seconds=Math.max(0,Math.floor((end-now)/1000));el.textContent=`${[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':')} 남았어요`;}
function bindShoppingRails(){
  document.querySelectorAll('[data-shop-rail]').forEach(rail=>{
    const dots=rail.parentElement.querySelector('.shop-dots');
    rail.addEventListener('scroll',()=>{if(!dots)return;const step=rail.children[1]?.offsetLeft-rail.children[0]?.offsetLeft||rail.clientWidth;const i=Math.round(rail.scrollLeft/step);dots.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));},{passive:true});
    // Touch stays native for simultaneous slide movement, momentum and vertical scrolling.
    let drag=null,suppress=false;
    rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,start:rail.scrollLeft,moved:false};});
    rail.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(!drag.moved&&Math.abs(dx)>5){drag.moved=true;rail.setPointerCapture(e.pointerId);rail.classList.add('shop-dragging');}if(drag.moved){e.preventDefault();rail.scrollLeft=drag.start-dx;}});
    const release=e=>{if(!drag)return;if(drag.moved){suppress=true;rail.classList.remove('shop-dragging');if(rail.hasPointerCapture(e.pointerId))rail.releasePointerCapture(e.pointerId);const step=rail.children[1]?.offsetLeft-rail.children[0]?.offsetLeft||rail.clientWidth;rail.scrollTo({left:Math.round(rail.scrollLeft/step)*step,behavior:'smooth'});setTimeout(()=>suppress=false,0);}drag=null;};
    rail.addEventListener('pointerup',release);rail.addEventListener('pointercancel',release);rail.addEventListener('pointerleave',e=>{if(drag&&!drag.moved)release(e);});
    rail.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopPropagation();}},true);
    rail.addEventListener('keydown',e=>{if(e.target!==rail||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();rail.scrollBy({left:(e.key==='ArrowRight'?1:-1)*(rail.children[1]?.offsetLeft-rail.children[0]?.offsetLeft||rail.clientWidth),behavior:'smooth'});});
  });
}
const beforeShopping=render;
render=function(){
  clearInterval(shoppingTimer);const r=route();if(!['shop','shop-eye-berry'].includes(r)){beforeShopping();return;}
  clearTimeout(introTimer);document.body.dataset.screen=r;document.title=(r==='shop'?'쇼핑':'아이 베리 루테인 구미')+' · VITAME';$('#app').innerHTML=r==='shop'?shoppingScreen():shoppingDetail();bindShoppingRails();
  if(r==='shop'){updateShoppingTimer();shoppingTimer=setInterval(updateShoppingTimer,1000);}
};
document.addEventListener('submit',e=>{if(!e.target.matches('.shop-search'))return;e.preventDefault();shoppingQuery=e.target.querySelector('input').value;shoppingCategory='';shoppingFavorites=false;updateShoppingResults(true);});
document.addEventListener('input',e=>{if(!e.target.matches('.shop-search input'))return;shoppingQuery=e.target.value;shoppingCategory='';shoppingFavorites=false;updateShoppingResults();});
document.addEventListener('click',e=>{
  const heart=e.target.closest('[data-shop-like]');if(heart){const id=heart.dataset.shopLike;state.shopLikes=shoppingLiked(id)?state.shopLikes.filter(x=>x!==id):[...(Array.isArray(state.shopLikes)?state.shopLikes:[]),id];save();document.querySelectorAll(`[data-shop-like="${id}"]`).forEach(b=>{b.setAttribute('aria-pressed',String(shoppingLiked(id)));b.innerHTML=shoppingAsset(shoppingLiked(id)?'heart-active':'heart');});if(shoppingFavorites)updateShoppingResults();return;}
  const filter=e.target.closest('[data-shop-filter]');if(filter){shoppingCategory=['all','deals'].includes(filter.dataset.shopFilter)?'':filter.dataset.shopFilter;shoppingQuery='';shoppingFavorites=false;const input=$('.shop-search input');if(input)input.value='';if(filter.dataset.shopFilter==='all'){shoppingQuery='VITAME';if(input)input.value=shoppingQuery;}if(filter.dataset.shopFilter==='deals'){$('.shop-deal-list')?.scrollIntoView({behavior:'smooth'});}else updateShoppingResults(true);return;}
  if(e.target.closest('[data-shop-reset]')){shoppingCategory='';shoppingQuery='';shoppingFavorites=false;$('.shop-search input').value='';updateShoppingResults();return;}
  if(e.target.closest('[data-shop-favorites]')){shoppingFavorites=!shoppingFavorites;shoppingCategory='';shoppingQuery='';if(route()!=='shop'){go('shop');}else{const input=$('.shop-search input');if(input)input.value='';updateShoppingResults(true);}return;}
  const dot=e.target.closest('[data-shop-slide]');if(dot){const rail=dot.closest('.shop-photo-carousel').querySelector('[data-shop-rail]'),slide=rail.children[Number(dot.dataset.shopSlide)];rail.scrollTo({left:slide.offsetLeft-rail.children[0].offsetLeft,behavior:'smooth'});return;}
  if(e.target.closest('[data-shop-story]')){e.preventDefault();$('#shop-berry-story').scrollIntoView({behavior:'smooth'});return;}
  const unavailable=e.target.closest('[data-shop-unavailable]');if(unavailable)toast(`${unavailable.dataset.shopUnavailable} 기능은 아직 준비 중이에요.`);
});
render();
