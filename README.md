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
- shadcn/ui
- TanStack Table
- Supabase PostgreSQL
- Drizzle ORM, Drizzle Kit
- Vitest, React Testing Library

## 로컬 실행

필요한 패키지를 설치합니다.

```bash
npm install
```

`.env.example`을 참고해 프로젝트 루트의 `.env.local`에 Supabase 연결 문자열을 설정합니다. 실제 연결 문자열은 Git에 커밋하지 않습니다.

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

Drizzle 마이그레이션을 데이터베이스에 적용하고 개발 서버를 실행합니다.

```bash
npm run db:migrate
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 `/calendar`로 이동합니다.

## 데이터 모델

`events` 테이블은 다음 정보를 저장합니다.

- 제목과 설명
- 시작 시각과 종료 시각
- 상태: 예정, 진행 중, 완료, 취소
- 카테고리: 미팅, 업무, 개인, 집중
- 장소와 종일 일정 여부
- 생성 시각과 수정 시각

시간 값은 PostgreSQL `timestamptz`로 저장하고 화면에서 사용자 로컬 시간대로 표시합니다.

## 명령어

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
npm run test:run     # Vitest/RTL 일괄 실행
npm run db:generate  # 스키마 변경 마이그레이션 생성
npm run db:migrate   # 데이터베이스에 마이그레이션 적용
npm run db:studio    # Drizzle Studio
```

Vercel의 Production과 Preview 환경에도 각각 `DATABASE_URL`을 등록해야 합니다.
