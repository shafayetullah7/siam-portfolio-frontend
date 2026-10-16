import { expect, test } from "@playwright/test";

test("unknown path shows branded 404", async ({ page }) => {
  await page.goto("/no-such-page");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
});
