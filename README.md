# Dayline

Supabase PostgreSQL에 저장한 일정을 월간 캘린더와 데이터 테이블 두 가지 방식으로 관리하는 Next.js 사이드 프로젝트입니다.

## 배포 주소

- prod: [kwonja-fe-test.vercel.app](https://kwonja-fe-test.vercel.app/)
- dev: [dev-kwonja-fe-test.vercel.app](https://dev-kwonja-fe-test.vercel.app/)

## 주요 기능

- `/calendar`: 월 이동, 날짜별 일정 확인, 일정 추가
- `/table`: 일정 검색, 정렬, 페이지 이동, 수정, 삭제
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
├─ schedule/
│  ├─ components/            # 캘린더와 테이블 화면
│  ├─ hooks/                 # 일정 API 상태 관리
│  ├─ model/                 # 일정 타입, 상수, 검증
│  └─ server/
│     ├─ db.ts               # PostgreSQL 연결
│     ├─ schema.ts           # Drizzle 테이블 정의
│     └─ repositories/       # 일정 데이터 접근
├─ calculator/
│  ├─ components/            # 계산기 화면
│  ├─ model/                 # 연산자 타입
│  └─ utils/                 # 계산과 결과 변환 순수 함수
├─ practice-inputs/          # 입력 연습 기능
└─ todo/                     # Todo 연습 기능과 스키마
shared/
├─ lib/                      # 도메인을 모르는 공통 유틸리티
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

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 `/calendar`로 이동합니다.

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
