'use strict';
// OCR runs locally in a worker. Only engine/language assets are downloaded.
let cameraStream=null,scanWorker=null,scanJob=0,scanBusy=false,scanText='',scanError='',ocrLibrary=null;
const scanRoutes=['scan','setup-register'];
function stopLabelCamera(){cameraStream?.getTracks().forEach(t=>t.stop());cameraStream=null;}
function cancelLabelScan(){scanJob++;scanBusy=false;stopLabelCamera();scanWorker?.terminate();scanWorker=null;}
function scanStatus(message){const el=document.querySelector('[data-scan-status]');if(el)el.textContent=message;}
function scanControls(){return `<div class="live-scanner"><video autoplay muted playsinline aria-label="영양제 라벨 카메라"></video><div class="live-scan-frame"></div><p data-scan-status role="status">카메라로 제품의 성분표를 비춰주세요.</p></div><div class="live-scan-buttons"><button class="secondary" data-label-photo>${icon('image')}<span>사진 선택</span></button><button class="secondary" data-action="manual">${icon('plus')}<span>직접 입력</span></button><button class="primary" data-label-scan>${icon('camera')}<span>스캔하기</span></button></div><div class="live-scan-links"><button class="text-btn" data-label-cancel hidden>스캔 취소</button></div><input type="file" id="label-photo" accept="image/*" hidden><p class="footer-note">카메라를 연결한 뒤 촬영하면 문자 인식을 시작해요.<br>사진은 서버로 전송하지 않습니다. 첫 인식에는 인터넷 연결이 필요해요.</p>`;}
scan=function(){return `<div class="step"><b>1 영양제 등록</b><span></span><span>2 결과 확인</span></div>${scanControls()}<button class="sample" data-action="sample-scan">샘플 라벨로 스캔 결과 확인하기</button><button class="sample" data-go="home">나중에 할게요</button>`;};
const renderBeforeScanner=render;
render=function(){
  renderBeforeScanner();
  if(route()==='setup-register'){
    const screen=document.querySelector('.step-4');
    screen.querySelector('.registration-preview')?.remove();screen.querySelector('.login-demo-note')?.remove();
    screen.querySelector('.registration-actions').outerHTML=`<div class="registration-actions">${scanControls()}<button class="sample" data-go="home">나중에 할게요</button></div>`;
  }
  const video=document.querySelector('.live-scanner video');if(video&&cameraStream)video.srcObject=cameraStream;
  if(route()==='result'&&scanText){
    const form=document.querySelector('#register-form');
    form.querySelector('.bottle')?.remove();
    form.insertAdjacentHTML('afterbegin',`<aside class="ocr-review"><strong>문자 인식 결과 · 원본과 대조해주세요</strong><p>인식한 성분·함량·단위는 틀릴 수 있어요. 빈 항목과 1일 섭취량을 직접 확인하고 수정한 뒤 등록해주세요.</p><details><summary>인식 원문 보기</summary><pre>${esc(scanText)}</pre></details></aside>`);
    const notice=form.querySelector('.row small');if(notice)notice.textContent='아래 원본 사진과 인식 결과를 확인해주세요.';
  }
};
async function openLabelCamera(){
  if(scanBusy)return;
  const token=++scanJob;
  document.querySelectorAll('.live-scanner>img').forEach(el=>el.remove());
  scanStatus('카메라 연결 중… 권한을 허용해주세요.');
  try{
    if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1440}},audio:false});
    if(token!==scanJob||!scanRoutes.includes(route())){stream.getTracks().forEach(t=>t.stop());return;}
    cameraStream=stream;const video=document.querySelector('.live-scanner video');video.srcObject=stream;await video.play();
    document.querySelector('[data-label-scan] span').textContent='촬영·인식';
    document.querySelector('[data-label-cancel]').hidden=false;
    scanStatus('성분표가 선명하게 보이면 촬영해주세요.');
  }catch(error){
    if(token!==scanJob)return;stopLabelCamera();
    scanStatus(error.name==='NotAllowedError'?'카메라 권한이 필요해요. 권한을 허용하거나 사진을 선택해주세요.':error.name==='NotFoundError'?'연결된 카메라가 없어요. 사진 선택을 이용해주세요.':'카메라를 열 수 없어요. HTTPS 접속과 권한을 확인하거나 사진을 선택해주세요.');
  }
}
function loadOcrLibrary(){
  if(window.Tesseract)return Promise.resolve(window.Tesseract);
  if(!ocrLibrary)ocrLibrary=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js';script.crossOrigin='anonymous';
    const timeout=setTimeout(()=>{script.remove();ocrLibrary=null;reject(new Error('인식 도구 다운로드 시간이 초과됐어요.'));},30000);
    script.onload=()=>{clearTimeout(timeout);resolve(window.Tesseract);};
    script.onerror=()=>{clearTimeout(timeout);script.remove();ocrLibrary=null;reject(new Error('인식 도구를 불러오지 못했어요. 인터넷 연결을 확인해주세요.'));};document.head.append(script);
  });return ocrLibrary;
}
function parseLabelText(text){
  // Keep unknown fields blank. Never infer a product, serving size, or dosage.
  const ingredients=[];
  for(const line of text.split(/\r?\n/)){
    const match=line.match(/^\s*([A-Za-z가-힣][A-Za-z가-힣0-9\s()·+\-]{1,45}?)\s+(\d+(?:[,.]\d+)*)\s*(mg|mcg|[μµu]g|IU|g)\b/i);
    if(!match||/serving|container|섭취량|내용량|총\s*중량/i.test(match[1]))continue;
    const amount=Number(match[2].replace(/,/g,''));if(!(amount>0&&amount<=1000000))continue;
    const unit=/^(mcg|[μµu]g)$/i.test(match[3])?'μg':/^iu$/i.test(match[3])?'IU':match[3].toLowerCase();
    ingredients.push({name:match[1].trim(),amount,unit});
  }
  return {name:'',dose:1,time:'08:00',frequency:'매일',ingredients:ingredients.length?ingredients:[{name:'',amount:'',unit:'mg'}]};
}
async function recognizeLabel(blob){
  if(scanBusy)return;stopLabelCamera();scanBusy=true;scanText='';const token=++scanJob;
  const button=document.querySelector('[data-label-scan]');button.disabled=true;
  document.querySelector('[data-label-cancel]').hidden=false;
  scanStatus('문자 인식 준비 중… 처음에는 잠시 걸릴 수 있어요.');
  if(uploadURL)URL.revokeObjectURL(uploadURL);uploadURL=URL.createObjectURL(blob);
  document.querySelectorAll('.live-scanner>img').forEach(el=>el.remove());
  const preview=document.createElement('img');preview.src=uploadURL;preview.alt='인식 중인 라벨';document.querySelector('.live-scanner').prepend(preview);
  let worker=null;
  const timeout=setTimeout(()=>{if(token===scanJob){cancelLabelScan();scanStatus('인식 시간이 초과됐어요. 다시 촬영하거나 직접 입력해주세요.');button.disabled=false;}},120000);
  try{
    await preview.decode();
    const canvas=document.createElement('canvas'),scale=Math.min(1,2400/Math.max(preview.naturalWidth,preview.naturalHeight));
    canvas.width=Math.round(preview.naturalWidth*scale);canvas.height=Math.round(preview.naturalHeight*scale);
    const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(preview,0,0,canvas.width,canvas.height);
    const raster=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!raster)throw new Error('이 이미지 형식을 읽을 수 없어요. JPG 또는 PNG를 선택해주세요.');
    const api=await loadOcrLibrary();if(token!==scanJob)return;
    worker=await api.createWorker('kor+eng',1,{logger:m=>{if(token===scanJob)scanStatus(m.status==='recognizing text'?`성분표 인식 중… ${Math.round(m.progress*100)}%`:'문자 인식 도구 준비 중…');}});
    if(token!==scanJob){await worker.terminate();return;}scanWorker=worker;
    const {data}=await worker.recognize(raster);if(token!==scanJob)return;
    if(!data.text.trim())throw new Error('읽을 수 있는 글자를 찾지 못했어요. 성분표를 가까이서 선명하게 촬영해주세요.');
    scanText=data.text;draft=parseLabelText(scanText);scanBusy=false;go('result');
  }catch(error){if(token===scanJob){scanStatus(error.message||'인식하지 못했어요. 다시 촬영하거나 직접 입력해주세요.');button.disabled=false;}}
  finally{clearTimeout(timeout);if(worker)await worker.terminate().catch(()=>{});if(scanWorker===worker)scanWorker=null;if(token===scanJob)scanBusy=false;}
}
async function captureLabel(){
  const video=document.querySelector('.live-scanner video');if(!video?.videoWidth){scanStatus('카메라 준비 후 다시 촬영해주세요.');return;}
  const canvas=document.createElement('canvas'),ratio=Math.min(1,2000/video.videoWidth);canvas.width=Math.round(video.videoWidth*ratio);canvas.height=Math.round(video.videoHeight*ratio);canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.95));if(blob)recognizeLabel(blob);
}
document.addEventListener('click',e=>{
  if(e.target.closest('[data-label-scan]')){if(cameraStream)captureLabel();else openLabelCamera();}
  if(e.target.closest('[data-label-photo]'))document.querySelector('#label-photo').click();
  if(e.target.closest('[data-label-cancel]')){cancelLabelScan();render();}
  if(e.target.closest('[data-action="manual"],[data-action="sample-scan"]')){cancelLabelScan();scanText='';}
},true);
document.addEventListener('change',e=>{if(e.target.id!=='label-photo')return;const file=e.target.files[0];if(!file)return;if(!file.type.startsWith('image/')||file.size>20*1024*1024){scanStatus('20MB 이하의 이미지 파일을 선택해주세요.');return;}recognizeLabel(file);e.target.value='';});
window.addEventListener('hashchange',()=>{if(!scanRoutes.includes(route()))cancelLabelScan();});
window.addEventListener('pagehide',cancelLabelScan);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopLabelCamera();});
render();
