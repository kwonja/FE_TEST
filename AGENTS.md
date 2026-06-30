<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 프로젝트 공통 지침

## 언어

- 답변, 설명, 프로젝트 지침은 기본적으로 한국어로 작성한다.

## 지침 구조

- 루트 `AGENTS.md`에는 프로젝트 전체에 항상 적용되는 공통 지침만 둔다.
- UI, 컴포넌트, 디자인 관련 작업은 `app/AGENTS.md`를 따른다.
- 테스트 작성과 테스트 실패 분석은 `__tests__/AGENTS.md`를 따른다.
- 명령 실행 승인 정책은 `.codex/rules/default.rules`에서 관리한다.

## Next.js

- 이 프로젝트의 Next.js 버전은 기존 지식과 다를 수 있다.
- Next.js 관련 코드를 수정하기 전에는 `node_modules/next/dist/docs/`의 관련 문서를 먼저 확인한다.

## Feature-based layered 구조

- 소스 코드의 의존성 방향은 `shared` → `features` → `app` 순서를 따른다.
- `app`은 라우팅, 레이아웃, Route Handler 같은 애플리케이션 진입점만 담당한다.
- 기능과 도메인 코드는 `features/<feature-name>` 안에 둔다.
- 서로 다른 feature끼리는 직접 import하지 않는다.
- `shared`에는 여러 기능에서 재사용할 수 있는 UI와 유틸리티만 둔다.
- 도메인 타입, 상태, 검증, 비즈니스 규칙은 `shared`에 두지 않는다.
- feature 내부의 스키마, 타입, 상수는 `model`에 둔다.
- 입력값을 계산하거나 변환하는 순수 함수는 feature 내부의 `utils`에 둔다.
- Route Handler에서 ORM을 직접 호출하지 않고 feature의 `server/repositories`를 통해 DB에 접근한다.
- Repository는 범용 Base Repository보다 도메인별 메서드를 명시적으로 정의한다.
- DB 연결처럼 도메인을 모르는 서버 인프라는 `shared/server`에 둔다.
- `shared/server`의 DB 클라이언트는 feature의 스키마를 import하지 않는다.
- 두 화면이 같은 도메인 모델을 공유한다면 별도 feature로 나누기보다 하나의 feature 내부 모듈로 구성한다.
- 레이어 및 feature 간 import 제한은 ESLint 규칙을 따른다.

## Git Flow

- 이 프로젝트는 Git flow 방식으로 관리한다.
- `master`는 배포 가능한 안정 버전으로 유지한다.
- 개발 작업은 `develop` 브랜치를 기준으로 진행한다.
- 기능 작업은 `feature/<name>` 브랜치에서 진행한다.
- 버그 수정은 `fix/<name>` 브랜치에서 진행한다.
- 릴리스 준비는 `release/<version>` 브랜치에서 진행한다.
- 긴급 수정은 `hotfix/<name>` 브랜치에서 진행한다.
- 직접 `master`에 커밋하지 않는다.
- 작업 전 현재 브랜치를 확인하고, 필요한 경우 적절한 브랜치를 생성하거나 전환한다.
- 커밋 전 `npm run test:run`을 실행한다.
- 변경사항 검증을 통과하고 feature/fix/release/hotfix 브랜치에 push했다면 PR을 생성한다.
- PR 생성 도구(`gh`, 브라우저, MCP 등)가 없거나 인증이 부족하면 PR 생성 링크와 제목/본문 초안을 제공한다.

## 검증

- 변경사항을 검증할 때는 반드시 관련 테스트를 실행한다.
- 이 프로젝트에서는 Vitest/RTL 검증에 `npm run test:run`을 실행한다.
