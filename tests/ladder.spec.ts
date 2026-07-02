import { expect, test } from "@playwright/test";

test("사다리를 타고 도착 결과를 표시한다", async ({ page }) => {
  await page.goto("/games/ladder");

  await page.getByRole("button", { name: "민준 경로 확인" }).click();

  await expect(page.getByTestId("ladder-result-message")).toHaveText(
    "민준이(가) 이동 중입니다.",
  );
  await expect(page.getByTestId("ladder-result-message")).toContainText(
    "민준이(가) 도착한 결과는",
  );
});
