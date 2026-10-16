import { expect, test } from "@playwright/test";

test("invalid login shows error and stays on login", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("not-a-user@example.com");
  await page.getByLabel("Password").fill("wrong-password-1");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("alert")).toBeVisible();
});
