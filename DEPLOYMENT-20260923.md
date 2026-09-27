# VITAME 배포 — 2026-09-23

- 대상: https://vitame-beryl.vercel.app
- 연결 저장소: annj0906/vitame-mvp, main
- 커밋: 05d685bc0d3ce1a10ce2478054d31120973af2de
- Vercel 배포: DWJkaCFhQ1LeZNsDUvjSmYYXxHLJ (Ready 확인)
- 반영 파일: public/vitame/index.html, revision.css, welcome.js, scanner.js, scanner.css
- 로컬 PRD 및 테스트 SVG는 배포하지 않음.

## 검증

- JavaScript 구문 검사 통과.
- 브라우저에서 온보딩 중앙 로고와 페이지 표시 확인.
- 슬라이더 다섯 지점과 라벨 중심 차이 0.01px 미만 확인.
- tests/label-ocr.svg를 사진 선택으로 입력, 실제 Tesseract 한국어+영어 모델로 인식. Vitamin D3 50 μg, Vitamin C 500 mg, Magnesium 100 mg, Zinc 10 mg 결과 및 수정 폼 확인. 테스트 데이터는 등록/저장하지 않음.
- 물리 카메라 및 실물 라벨 정확도는 미검증. HTTPS 및 카메라 권한 필요. 첫 인식은 CDN 엔진/언어 파일 다운로드 필요.

## 주의

GitHub 브라우저 업로드로 배포했으므로 로컬 git HEAD는 자동 동기화되지 않음. 다음 git 작업 전 원격 변경을 확인할 것. 오래된 배포 ZIP은 이 수정본을 포함하지 않음.
