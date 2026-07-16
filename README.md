# 한판

여러 사람이 가볍게 함께 즐길 수 있는 웹 게임을 모아가는 Next.js 사이드 프로젝트입니다.

## 배포 주소

- prod: [kwonja-fe-test.vercel.app](https://kwonja-fe-test.vercel.app/)
- dev: [dev-kwonja-fe-test.vercel.app](https://dev-kwonja-fe-test.vercel.app/)

## 주요 기능

- `/`: 플레이할 게임을 선택하는 게임 허브
- 게임 허브 첫 화면에 Three.js와 React Three Fiber 기반의 3D 태양계 배경 제공
- 셰이더 기반 태양 표면 질감과 흑점, 반투명 코로나 레이어로 태양을 표현
- 지구형·가스형·암석형·고리형 행성에 절차적 표면 질감과 필요한 대기·고리 레이어를 적용
- 모션 감소 설정에서는 정적 배경으로 전환하고, 화면 밖이나 비활성 탭에서는 3D 애니메이션을 멈춰 렌더링 부담을 줄임
- `/games/ladder`: 3~10명이 참여하는 격자 기반 사다리 타기
- 참가자와 결과 편집, 인원수의 1.5배를 올림한 level 수의 직사각형 사다리 생성, 경로 애니메이션과 결과 공개
- 마지막 level에는 가로 다리를 만들지 않고 결과까지 수직으로 이동
- `/games/random-draw`: 중복을 허용해 1~100 중 하나를 뽑고 최근 결과 5개를 표시
- 숫자가 빠르게 바뀌는 셔플 애니메이션과 결과 공개 연출(모션 감소 설정 지원)
- 랜덤 뽑기 완료 2회 후 5점 만점 별점 피드백 모달 표시
- `/games/reaction-speed`: 신호가 뜬 뒤 `pointerdown` 기준으로 반응속도를 ms 단위 측정
- 조기 입력 실격, 키보드 입력, 최근 기록 5개 표시를 지원
- `/games/seven-seven-timer`: `3.33초`에 최대한 가깝게 멈추는 스톱워치 게임
- 경과 초를 React state로 0.01초 단위 갱신하고, `performance.now()` 기준의 실제 시간 차이로 결과 오차를 계산
- 게임 허브, 사다리 타기, 랜덤 뽑기, 반응속도, 3.33 맞추기 게임은 최소 370px 너비부터 반응형 UI를 지원
- 서비스 워커가 방문한 게임 화면과 정적 리소스를 캐시해, 한 번 온라인으로 연 게임은 오프라인에서도 실행 가능
- Axios 공통 `httpClient`는 API 기본 경로와 타임아웃만 관리하고, `shared/api/network`의 `isOnline`·`assertOnline`으로 기능별 오프라인 정책을 명시
- 일정 API는 `features/schedule/client/events-api`에서 작업별 `OfflineError`와 Axios 오류를 정규화하고, 게임 클릭·별점 통계는 오프라인이면 전송을 조용히 생략
- 일정 Hook은 API 구현과 오류 정규화를 분리하고 로딩·오류·목록 등 UI 상태만 관리
- 서비스 워커의 방문 화면·정적 리소스 캐시는 API 통신과 독립적으로 유지
- 일정 캘린더와 테이블 UI 코드는 `features/schedule`에 보존하며 현재 페이지 라우트에는 연결하지 않음
- `/api/events`: 일정 조회와 생성을 위한 Route Handler
- `/api/events/[id]`: 일정 수정과 삭제를 위한 Route Handler
- `/api/analytics/game-click`: 게임 선택 클릭 이벤트 저장 Route Handler
- `/api/analytics/game-feedback`: 게임 별점 피드백 저장 Route Handler
- 캘린더와 테이블은 동일한 Supabase 데이터를 사용

## 반응형 정책

- 지원하는 최소 화면 너비는 370px입니다.
- 모바일은 370~500px, 일반 화면은 501px 이상으로 구분합니다.
- Tailwind `sm` breakpoint는 501px(`31.3125rem`)이며 `app/globals.css`에서 중앙 관리합니다.
- Playwright `responsive-boundary` 테스트는 게임 허브, 사다리 타기, 랜덤 뽑기의 370px·500px·501px 경계와 10명 사다리 출발점 겹침 방지를 검증합니다.

## 기술 스택

- Next.js 16 App Router
- React 19, TypeScript, Tailwind CSS 4
- Three.js, React Three Fiber(WebGL 기반 3D 배경)
- shadcn/ui, TanStack Table
- Axios
- Supabase PostgreSQL
- Drizzle ORM, Drizzle Kit
- Vitest, React Testing Library

## 폴더 구조

프로젝트는 Feature-based layered 구조를 사용합니다.

```text
app/                         # App Router 라우팅, 레이아웃, API 진입점
├─ api/
│  ├─ analytics/
│  │  ├─ game-click/         # 게임 선택 클릭 이벤트 저장 API
│  │  └─ game-feedback/      # 게임 별점 피드백 저장 API
│  └─ events/                # 일정 조회·생성·수정·삭제 API
├─ games/
│  ├─ ladder/                # 사다리 타기 페이지
│  ├─ random-draw/           # 랜덤 뽑기 페이지와 클라이언트 조합 컴포넌트
│  ├─ reaction-speed/        # 반응속도 게임 페이지
│  └─ seven-seven-timer/     # 3.33 맞추기 게임 페이지
├─ globals.css               # Tailwind 4, 전역 토큰, 반응형 breakpoint
├─ layout.tsx                # 루트 레이아웃
└─ page.tsx                  # 게임 허브 진입 페이지
features/
├─ game-hub/                 # 게임 목록, 허브 화면, 3D 태양계 배경
├─ game-analytics/
│  ├─ client/                # 클릭 이벤트 전송, 별점 피드백 모달과 localStorage 노출 상태
│  ├─ model/                 # 분석 이벤트와 피드백 타입·검증
│  └─ server/
│     ├─ schema.ts           # 클릭 이벤트와 별점 피드백 테이블 정의
│     └─ repositories/       # 분석 데이터 저장
├─ ladder-game/
│  ├─ components/            # 게임 설정과 SVG 사다리 보드
│  ├─ model/                 # 사다리 타입과 인원 제한
│  └─ utils/                 # 사다리 생성과 경로 계산
├─ random-draw/
│  ├─ components/            # 랜덤 뽑기 화면과 셔플·결과 연출
│  ├─ model/                 # 숫자 범위, 최근 결과 제한, 진행 상태
│  └─ utils/                 # 범위 내 무작위 정수 생성
├─ reaction-speed/
│  ├─ components/            # 반응속도 게임 화면과 입력 처리
│  ├─ model/                 # 대기 시간, 최근 기록 제한, 진행 상태
│  └─ utils/                 # 대기 시간 생성과 ms 표시 변환
├─ seven-seven-timer/
│  ├─ components/            # 3.33 맞추기 게임 화면과 타이머 제어
│  ├─ model/                 # 목표 시간, 갱신 간격, 진행 상태
│  └─ utils/                 # 초 표시 변환, 목표 시간 오차와 결과 문구 계산
├─ schedule/
│  ├─ client/                # 일정 API 요청, 작업별 오프라인 정책과 Axios 오류 정규화
│  ├─ components/            # 캘린더와 테이블 화면
│  ├─ hooks/                 # 일정 로딩·오류·목록 등 UI 상태 관리
│  ├─ model/                 # 일정 타입, 상수, 검증
│  └─ server/
│     ├─ schema.ts           # Drizzle 일정 테이블 정의
│     └─ repositories/       # 일정 데이터 접근
├─ calculator/
│  ├─ components/            # 계산기 화면
│  ├─ model/                 # 연산자 타입
│  └─ utils/                 # 계산과 결과 변환 순수 함수
├─ practice-inputs/          # 입력 연습 기능
└─ todo/                     # Todo 연습 기능과 스키마
shared/
├─ api/                      # Axios 기본 설정, OfflineError와 공통 네트워크 가드
├─ lib/                      # 도메인을 모르는 공통 유틸리티
├─ server/                   # PostgreSQL 연결 등 공통 서버 인프라
└─ ui/                       # shadcn/base-ui 기반 공통 UI와 앱 토스트
public/
└─ sw.js                     # 방문한 게임과 정적 파일을 캐시하는 서비스 워커
__tests__/                   # Vitest/RTL 단위·컴포넌트 테스트
```

의존성은 다음 방향으로만 흐릅니다.

```text
shared <- features <- app
```

- `shared`는 `features`와 `app`을 import할 수 없습니다.
- `features`는 `app`을 import할 수 없습니다.
- 서로 다른 feature끼리는 직접 import할 수 없습니다.
- 일정 타입과 비즈니스 규칙은 도메인 코드이므로 `shared`가 아닌 `features/schedule`에 둡니다.
- 스키마, 타입, 상수는 feature의 `model`에 두고 순수 계산·변환 함수는 `utils`에 둡니다.
- PostgreSQL 연결처럼 도메인을 모르는 서버 인프라는 `shared/server`에 둡니다.
- 공통 DB 클라이언트는 feature의 스키마를 import하지 않습니다.
- Route Handler는 ORM을 직접 호출하지 않고 도메인 Repository를 통해 DB에 접근합니다.
- 위 규칙은 `eslint.config.mjs`의 `architecture/layer-dependencies` 규칙으로 검사합니다.

## 로컬 실행

```bash
npm install
```

`.env.example`을 참고해 프로젝트 루트의 `.env.local`에 Supabase 연결 문자열을 설정합니다. 실제 연결 문자열은 Git에 커밋하지 않습니다.

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

```bash
npm run db:migrate
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 게임 허브를 확인할 수 있습니다.

스키마 변경 후에는 `npm run db:generate`로 생성된 SQL을 먼저 확인합니다. 기존 데이터를 보호하기 위해 `DROP`, `DELETE`, `TRUNCATE`가 포함됐는지 확인한 뒤 `npm run db:migrate`로 실제 DB에 반영합니다.

## 서브에이전트 협업 워크플로

기능 개발은 역할별 서브에이전트가 다음 순서로 협업합니다.

1. `ui-designer`와 `architect`가 병렬로 UI 방향과 기술 구조를 설계합니다.
2. `frontend`가 두 설계 결과를 취합해 기능을 구현하고 관련 테스트를 작성합니다.
3. `reviewer`가 구현 결과를 검토하고 발견된 문제를 수정 사항에 반영합니다.
4. 검토와 수정이 끝나면 `readme-writer`가 README를 포함한 관련 문서를 갱신합니다.
5. 각 단계의 진행 상태와 검증 결과를 사용자에게 보고합니다.

각 역할의 주요 책임은 다음과 같습니다.

- `ui-designer`: 화면 구성, 사용자 흐름, 반응형 동작, 접근성 기준 설계
- `architect`: feature 경계, 의존성 방향, 상태 및 데이터 흐름 설계
- `frontend`: 설계에 따른 React/Next.js 구현과 테스트 작성
- `reviewer`: 기능 정확성, 회귀 가능성, 접근성, 성능, 테스트 범위 검토
- `readme-writer`: 기능, 구조, 실행법 등 변경된 프로젝트 문서 정리

## 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint와 레이어 의존성 검사
npm run test:run     # Vitest/RTL 일괄 실행
npm run test:e2e     # Playwright E2E 및 반응형 경계 검사
npm run db:generate  # 스키마 변경 마이그레이션 생성
npm run db:migrate   # 데이터베이스에 마이그레이션 적용
npm run db:studio    # Drizzle Studio
```

Vercel의 Production과 Preview 환경에도 각각 `DATABASE_URL`을 등록해야 합니다.
