# 듬이 웹 게임 (Dumi Web Game) - AI 및 개발자 인수인계 문서

이 프로젝트는 세경고등학교 7개 전공 학과를 체험하고 전공 퀴즈를 풀며 나에게 맞는 전공 뱃지를 수집하는 **인터랙티브 웹 게임 (React + TypeScript + Vite)** 입니다.  
본 문서는 차기 AI 어시스턴트 및 동료 개발자가 프로젝트를 중단 없이 원활히 이어갈 수 있도록 작성된 종합 인수인계 가이드입니다. (프라이빗 프로젝트 전용 토큰 및 환경 설정 포함)

---

## 1. 프로젝트 핵심 아키텍처 및 폴더 구조

- **`src/App.tsx`**: 게임 전체의 스테이지(`TITLE` -> `INTRO_STORY` -> `DEPT_INTRO` -> `DEPT_QUIZ` -> `DEPT_REWARD` -> `RESULT`) 흐름과 상단 HUD 뱃지, 공통 화면 레이아웃을 제어하는 최상위 컨테이너입니다.
- **`src/hooks/useGameState.ts`**: 게임 전반의 상태를 관리하는 커스텀 훅입니다.
  - 학과별 퀴즈 진행 상태(`currentQuizIndex`)를 통해 각 학과의 전체 퀴즈(4문항씩)를 차례대로 순회하며, 과반수 이상 맞추면 뱃지(`badgeList`)를 획득합니다.
- **`src/components/common/MessageBox.tsx`**:
  - 캐릭터 일러스트, 말풍선 대사, 다음 스토리 진행 버튼, OX 및 4지선다 퀴즈 버튼, 상단 아날로그 타이머 위젯(`.analog-timer-widget`)을 통합 관리하는 핵심 공통 컴포넌트입니다.
  - 퀴즈 모드(`isQuizMode`) 시 화면 전체를 덮는 투명 컨테이너(`.quiz-mode-container`)로 전환되어 타이머는 모바일 뷰포트 좌측 상단(`top: 14px, left: 16px`)에 완벽히 고정되고, 하단 보기 버튼은 100% 가로 너비로 미려하게 정렬됩니다.
- **`src/data/departments.ts`**: 7개 전공 학과(`MEDIA`, `NURSING`, `AUTOMOTIVE`, `AVIONICS`, `ARCHITECTURE`, `MILITARY`, `SEMICONDUCTOR`)의 이름, 대표 캐릭터명/이미지, 컬러 테마 정의.
- **`src/data/quizzes.ts`**: 각 학과별 인트로 스토리 대사, 4문항 전공 퀴즈(OX / 다지선다), 성공/실패 아웃트로 대사 데이터셋.
- **`src/utils/sound.ts`**: BGM 및 효과음(`click`, `correct`, `incorrect`) 재생을 전담하는 사운드 매니저입니다. (중복 사운드 방지를 위해 `MessageBox` 내부에서 단일 트리거됨)

---

## 2. 핵심 디자인 및 UI/UX 규칙

1. **대사창 및 퀴즈 레이아웃 하단 고정**:
   - 모바일 480px 프레임 내에서 대사창 및 선택지/퀴즈 보기 패널은 항상 최하단 턱에 밀착되도록 설계되어 있습니다.
2. **타이머 위젯 고정 규칙**:
   - 퀴즈 진행 중 표시되는 미니 아날로그 시계(`.analog-timer-widget`)는 모바일 스크린(`.game-stage-container`, `position: relative`)을 기준으로 좌측 상단(`top: 14px, left: 16px`) 학과 뱃지 옆에 위치합니다.
3. **클릭 효과음 단일화 규칙**:
   - 화면 클릭 시 효과음(`sound.playEffect('click')`)은 `MessageBox.tsx` 내부 이벤트 핸들러에서 1회만 재생됩니다. 상위(`App.tsx`)의 콜백에서 중복으로 재생하지 않도록 주의하세요.

---

## 3. 배포 환경 및 토큰 정보 (Cloudflare Pages & R2)

본 프로젝트는 Cloudflare Pages를 통해 호스팅되며, 변경 사항 발생 시 프로덕션 빌드 후 배포 명령어로 즉시 반영할 수 있습니다.

### 🔑 환경 변수 및 배포 토큰 (Private)
```env
CLOUDFLARE_API_TOKEN=<YOUR_CLOUDFLARE_API_TOKEN>
DUMI_R2_ACCESS_KEY_ID=<YOUR_DUMI_R2_ACCESS_KEY_ID>
DUMI_R2_API_TOKEN=<YOUR_DUMI_R2_API_TOKEN>
DUMI_R2_SECRET_ACCESS_KEY=<YOUR_DUMI_R2_SECRET_ACCESS_KEY>
```

### 🚀 프로덕션 빌드 및 Cloudflare Pages 배포 명령어
```powershell
# 1. 프로덕션 번들 빌드
npm run build

# 2. Cloudflare Pages 프로덕션 직접 배포
npx wrangler pages deploy dist --project-name dumi-web-game --commit-dirty=true
```

- **프로덕션 URL**: https://dumi-web-game.pages.dev
- **Master Alias URL**: https://master.dumi-web-game.pages.dev

---

## 4. 차기 작업 안내 및 참고 사항

- 퀴즈 문항을 추가하거나 대사를 수정할 경우 `src/data/quizzes.ts` 파일을 수정하면 됩니다. 모든 학과는 현재 4개의 알찬 문항으로 구성되어 있으며, 로직은 전체 문항을 모두 순회한 뒤 과반수 득점 시 뱃지를 부여합니다.
- 스타일 변경 시 기존 컴포넌트의 클래스 및 모바일 스크린 반응형 정렬이 깨지지 않도록 CSS 셀렉터 우선순위를 확인해 주세요.
