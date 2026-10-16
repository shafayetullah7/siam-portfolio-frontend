import { expect, test } from "@playwright/test";

test("protected admin route redirects to login with returnUrl", async ({
  page,
}) => {
  await page.goto("/admin/pages");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page).toHaveURL(/returnUrl=/);
});
