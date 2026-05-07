# 리믹스 발사대

새총으로 래퍼공을 쏴서 `REMIX SLOT`에 넣는 순수 `HTML/CSS/JavaScript` 기반 2D Canvas 미니게임입니다. 빌드 도구 없이 바로 실행되며, GitHub Pages에 그대로 배포할 수 있는 MVP 구조로 정리되어 있습니다.

## 1. 게임명

리믹스 발사대

## 2. 설명

플레이어는 화면 왼쪽 아래 새총에서 래퍼공을 당겨 발사합니다. 각 스테이지에는 1개에서 5개까지의 `REMIX SLOT`이 있으며, 주어진 공으로 모든 슬롯을 클리어하면 다음 스테이지로 넘어갑니다.

초반 1~3스테이지는 다섯 래퍼공이 각각 1개씩 자동 지급됩니다. 4스테이지 이후부터는 스테이지 진입 전에 `피처링으로 함께할 래퍼를 선택`하는 모달이 열리며, `구멍 수 + 2개`만큼 원하는 래퍼공을 조합해서 도전할 수 있습니다.

## 3. 조작법

- 데스크톱: 공 근처를 마우스로 누른 뒤 당기고, 놓아서 발사
- 모바일 Safari / Chrome: 공 근처를 터치해 당기고, 손을 떼서 발사
- 드래그 중: 예상 궤적 점선 표시
- 발사 중: 같은 공을 다시 드래그할 수 없음
- 4스테이지 이후: 모달에서 래퍼 얼굴을 눌러 공 추가, 위쪽 등록된 공을 눌러 제거

모바일 입력은 `pointer` 이벤트와 `preventDefault()`를 사용하고 있으며, 캔버스에 `touch-action: none`을 적용해 터치 스크롤이 발생하지 않도록 처리되어 있습니다.

## 4. 스테이지 구성

- 총 12개 스테이지
- 초반 스테이지: 낮고 가까운 슬롯 중심
- 중반 스테이지: 위쪽 슬롯, 가림 벽, 위치 분산
- 후반 스테이지: 작은 슬롯, 장거리 샷, 4~5개 슬롯 조합
- 실패 시 같은 스테이지를 즉시 재도전 가능

주요 스테이지 이름 예시:

- 리믹스 첫 장전
- 쇼츠 알고리즘
- 댓글창 폭발
- 차트 진입구
- A&R 회의실
- 피처링 대기열
- 최종 리믹스 슬롯

## 5. 발사체별 특성

- 토이고: 균형형
  - `powerMultiplier: 1.0`
  - `gravityMultiplier: 1.0`
  - `bounce: 0`
- YLN Foreign: 고속형
  - `powerMultiplier`가 높고 슬롯 판정 보너스가 있어 장거리 공략에 유리
- 플로우식: 중량형
  - 발사 파워가 낮고 중력이 강해 낮고 묵직한 포물선을 그림
- 트레이비: 튕김형
  - 벽 또는 바닥에 1회 반사 가능
- 박재범: 본인등판 특수공
  - 적중 시 전용 성공 문구 출력

## 6. 배포 방법

### 로컬 실행

정적 파일만으로 동작합니다.

1. 저장소를 그대로 내려받습니다.
2. `index.html`을 직접 열거나, 로컬 서버를 띄워 확인합니다.

```bash
python3 -m http.server 4173
```

브라우저에서 `http://localhost:4173`으로 접속하면 됩니다.

### GitHub Pages 배포

1. 저장소를 GitHub에 업로드합니다.
2. GitHub 저장소의 `Settings > Pages`로 이동합니다.
3. 배포 소스를 현재 브랜치의 `/ (root)`로 선택합니다.
4. 저장 후 Pages 주소로 접속합니다.

이 프로젝트는 상대 경로 기반으로 구성되어 있어 별도 빌드 없이 GitHub Pages에서 바로 동작합니다.

## 이미지 처리 방식

- `public/images/balls/`에 공 이미지를 넣으면 자동으로 해당 이미지를 공 텍스처로 사용합니다.
- 이미지가 없거나 로딩에 실패하면 Canvas 기본 원형 공으로 자동 대체됩니다.
- `public/images/bg/stage-bg.png`가 있으면 배경으로 사용하고, 없으면 CSS/Canvas 기본 배경으로 대체됩니다.
- `public/images/ui/slingshot.png`가 있으면 새총 이미지로 사용하고, 없으면 Canvas 도형 새총으로 대체됩니다.

즉, 이미지 파일이 전혀 없어도 게임은 플레이 가능해야 하며, 이미지가 추가되면 자동으로 비주얼만 강화되는 구조입니다.

## 파일 구조

```text
remix-launcher/
├─ index.html
├─ README.md
├─ package.json
├─ public/
│  ├─ images/
│  │  ├─ balls/
│  │  ├─ bg/
│  │  └─ ui/
│  └─ sounds/
├─ src/
│  ├─ assets.js
│  ├─ main.js
│  ├─ styles.css
│  └─ game/
│     ├─ config.js
│     ├─ state.js
│     ├─ stages.js
│     ├─ physics.js
│     ├─ input.js
│     ├─ renderer.js
│     ├─ collision.js
│     └─ ui.js
└─ docs/
   └─ dev-notes.md
```

### 파일 역할

- `index.html`: 게임 진입점과 HUD / 모달 마크업
- `src/main.js`: 초기화, 리사이즈, 자산 프리로드, 게임 루프
- `src/styles.css`: 레이아웃, 오버레이 UI, 선택 모달 스타일
- `src/assets.js`: 이미지 경로 정의
- `src/game/config.js`: 게임 수치, 공 특성, 새총 위치 등 설정값
- `src/game/state.js`: 스테이지 상태, 성공/실패, 공 선택 로직
- `src/game/stages.js`: 12개 스테이지 데이터
- `src/game/physics.js`: 포물선 이동, 중력, 충돌 전 이동 처리
- `src/game/input.js`: 마우스/터치/포인터 입력 처리
- `src/game/renderer.js`: Canvas 배경, 슬롯, 공, 새총 렌더링
- `src/game/collision.js`: 슬롯 충돌 판정
- `src/game/ui.js`: 상단 HUD와 선택 모달 업데이트

## 참고

- 빌드 도구 없음
- React / Vue 없음
- Matter.js 같은 외부 물리엔진 없음
- Canvas와 직접 구현한 포물선 물리만 사용
