import { test, expect } from "@playwright/test";

test("Successfully submit contact form", async ({ page }) => {
  await page.goto("/contact/");
  await expect(page.getByRole("heading", { name: "Contact us" })).toBeVisible();
  await page.locator('input[name="email"]').fill("vincent@verbrugh.nl");
  await page.locator('input[name="subject"]').fill("Test subject");
  await page.locator('textarea[name="message"]').fill("Test message");
  await page.getByRole("button", { name: "Send message" }).press("Enter");
  await expect(page.getByTestId("success-message")).toBeVisible();
});
