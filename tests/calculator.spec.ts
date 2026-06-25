import { expect, test } from "@playwright/test";

test("calculates from the browser", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("calculator-first-number").fill("15");
  await page.getByTestId("calculator-operator-subtract").click();
  await page.getByTestId("calculator-second-number").fill("4");
  await page.getByTestId("calculator-submit").click();

  await expect(page.getByTestId("calculator-result")).toHaveText("11");
});
