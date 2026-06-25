# 테스트 지침

## 범위

- 이 지침은 `__tests__/` 아래의 Vitest 및 React Testing Library 테스트에 적용한다.

## 실행

- 테스트를 검증할 때는 `npm run test:run`을 실행한다.
- Playwright E2E는 사용자가 명시적으로 요청할 때만 실행한다.

## React Testing Library

- 사용자 상호작용은 `@testing-library/user-event`를 우선 사용한다.
- 학습용 테스트에서는 `data-testid` 기반 조회를 허용한다.
- 접근성 흐름을 확인하고 싶을 때는 `getByRole`, `getByLabelText`, `getByText`를 사용한다.

## 테스트 작성

- 새 UI 기능을 추가하면 가능한 한 해당 기능의 RTL 테스트도 함께 추가한다.
- 테스트는 사용자의 행동과 결과를 함께 검증한다.
  예: 입력, 버튼 클릭, 새 항목 표시, 입력값 초기화.

## 실패 분석

- 테스트 실패 로그를 볼 때는 `Expected`, `Received`, 파일명, 줄 번호를 우선 확인한다.
- 실패 원인을 설명할 때는 테스트가 기대한 값과 실제 화면 또는 함수 결과를 구분해서 설명한다.
