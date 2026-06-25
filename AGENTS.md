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

## 검증

- 변경사항을 검증할 때는 반드시 관련 테스트를 실행한다.
- 이 프로젝트에서는 Vitest/RTL 검증에 `npm run test:run`을 실행한다.
