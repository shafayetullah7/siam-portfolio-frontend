import { expect, test } from "@playwright/test";
import { CI_ADMIN_EMAIL, CI_ADMIN_PASSWORD } from "./admin-credentials";

test("successful login and logout", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(CI_ADMIN_EMAIL);
  await page.getByLabel("Password").fill(CI_ADMIN_PASSWORD);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/admin\/?$/);
  await expect(page.getByRole("link", { name: "SIAM Admin" })).toBeVisible();
  await page.getByRole("button", { name: /log out/i }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("invalid login shows error and stays on login", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("not-a-user@example.com");
  await page.getByLabel("Password").fill("wrong-password-1");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("alert")).toBeVisible();
});
