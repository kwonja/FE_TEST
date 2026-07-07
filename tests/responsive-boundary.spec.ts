import { expect, test } from "@playwright/test";

import { responsiveViewports } from "./support/responsive-viewports";

const routes = ["/", "/games/ladder", "/games/random-draw"] as const;

for (const viewport of responsiveViewports) {
  test.describe(`${viewport.width}px 반응형 경계`, () => {
    test.use({ viewport });

    for (const route of routes) {
      test(`${route}에 가로 overflow가 없다`, async ({ page }) => {
        await page.goto(route);

        const dimensions = await page.locator("html").evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));

        expect(dimensions.scrollWidth).toBeLessThanOrEqual(
          dimensions.clientWidth,
        );
      });
    }

    test("홈 헤더가 breakpoint에서 전환된다", async ({ page }) => {
      await page.goto("/");

      const slogan = page.getByText("PLAY WITHOUT A PLAN", { exact: true });
      if (viewport.width <= 500) {
        await expect(slogan).toBeHidden();
      } else {
        await expect(slogan).toBeVisible();
      }
    });

    if (viewport.width === 370 || viewport.width === 501) {
      test("10명 사다리의 출발점이 겹치지 않는다", async ({ page }) => {
        await page.goto("/games/ladder");

        const addButton = page.getByRole("button", {
          name: "참가자 추가",
        });
        for (let count = 0; count < 6; count += 1) {
          await addButton.click();
        }

        const layout = await page
          .getByTestId("ladder-board-scroll")
          .evaluate((scrollContainer) => {
            const buttons = Array.from(
              scrollContainer.querySelectorAll<HTMLButtonElement>(
                '[aria-label$="경로 확인"]',
              ),
            );
            const rectangles = buttons.map((button) =>
              button.getBoundingClientRect(),
            );

            return {
              buttonCount: buttons.length,
              hasHorizontalScroll:
                scrollContainer.scrollWidth > scrollContainer.clientWidth,
              hasOverlap: rectangles.some(
                (rectangle, index) =>
                  index < rectangles.length - 1 &&
                  rectangle.right > rectangles[index + 1].left,
              ),
            };
          });

        expect(layout.buttonCount).toBe(10);
        expect(layout.hasHorizontalScroll).toBe(true);
        expect(layout.hasOverlap).toBe(false);
      });
    }
  });
}
