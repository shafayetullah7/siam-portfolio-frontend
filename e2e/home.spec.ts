import { expect, test } from "@playwright/test";

test("home loads with portfolio shell", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  await expect(page.getByText("Portfolio", { exact: true })).toBeVisible();
});
