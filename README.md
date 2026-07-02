# 한판

여러 사람이 가볍게 함께 즐길 수 있는 웹 게임을 모아가는 Next.js 사이드 프로젝트입니다.

## 배포 주소

- prod: [kwonja-fe-test.vercel.app](https://kwonja-fe-test.vercel.app/)
- dev: [dev-kwonja-fe-test.vercel.app](https://dev-kwonja-fe-test.vercel.app/)

## 주요 기능

- `/`: 플레이할 게임을 선택하는 게임 허브
- `/games/ladder`: 3~10명이 참여하는 격자 기반 사다리 타기
- 참가자와 결과 편집, 사다리 무작위 생성, 경로 애니메이션과 결과 공개
- 일정 캘린더와 테이블 UI 코드는 `features/schedule`에 보존하며 현재 페이지 라우트에는 연결하지 않음
- `/api/events`: 일정 조회와 생성을 위한 Route Handler
- `/api/events/[id]`: 일정 수정과 삭제를 위한 Route Handler
- 캘린더와 테이블은 동일한 Supabase 데이터를 사용

## 기술 스택

- Next.js 16 App Router
- React 19, TypeScript, Tailwind CSS 4
- shadcn/ui, TanStack Table
- Supabase PostgreSQL
- Drizzle ORM, Drizzle Kit
- Vitest, React Testing Library

## 폴더 구조

프로젝트는 Feature-based layered 구조를 사용합니다.

```text
app/                         # 라우팅, 레이아웃, API 진입점
features/
├─ game-hub/                 # 게임 목록과 허브 화면
├─ ladder-game/
│  ├─ components/            # 게임 설정과 SVG 사다리 보드
│  ├─ model/                 # 사다리 타입과 인원 제한
│  └─ utils/                 # 사다리 생성과 경로 계산
├─ schedule/
│  ├─ components/            # 캘린더와 테이블 화면
│  ├─ hooks/                 # 일정 API 상태 관리
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
├─ lib/                      # 도메인을 모르는 공통 유틸리티
├─ server/                   # PostgreSQL 연결 등 공통 서버 인프라
└─ ui/                       # shadcn 공통 UI
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

## 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint와 레이어 의존성 검사
npm run test:run     # Vitest/RTL 일괄 실행
npm run db:generate  # 스키마 변경 마이그레이션 생성
npm run db:migrate   # 데이터베이스에 마이그레이션 적용
npm run db:studio    # Drizzle Studio
```

Vercel의 Production과 Preview 환경에도 각각 `DATABASE_URL`을 등록해야 합니다.
