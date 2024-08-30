import { test, expect } from "@playwright/test";

test("About page", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "About us" })).toBeVisible();
});

test("Privacy policy page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Privacy policy" }).click();
  await expect(
    page.getByRole("heading", { name: "Privacy policy" }),
  ).toBeVisible();
});

test("Terms & Conditions", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Terms & Conditions" }).click();
  await expect(
    page.getByRole("heading", { name: "Terms of Use" }),
  ).toBeVisible();
});
