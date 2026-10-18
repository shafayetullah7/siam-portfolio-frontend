import { expect, test } from "@playwright/test";
import { DEV_ADMIN_EMAIL, DEV_ADMIN_PASSWORD } from "./admin-credentials";

test("login → guarded page → logout", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(DEV_ADMIN_EMAIL);
  await page.getByLabel("Password").fill(DEV_ADMIN_PASSWORD);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/admin\/?$/);

  await page.goto("/admin/pages");
  await expect(page).not.toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("link", { name: "SIAM Admin" })).toBeVisible();

  await page.getByRole("button", { name: /log out/i }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
});
