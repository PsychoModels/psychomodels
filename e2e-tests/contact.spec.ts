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

test("When logged in the e-mail should already be filled in", async ({
  page,
}) => {
  const USER_NAME = `${(Math.random() + 1).toString(36).substring(7)}@psychomodels.org`;
  const PASSWORD = "6SXwmgtbvKNk&F";

  // Signup
  await page.goto("/account/login/");
  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByPlaceholder("Email address").fill(USER_NAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('input[name="repeatPassword"]').fill(PASSWORD);
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(
    page.getByRole("heading", { name: "Your profile" }),
  ).toBeVisible();

  await page.goto("/contact/");
  await expect(page.getByRole("heading", { name: "Contact us" })).toBeVisible();
  await expect(page.locator('input[name="email"]')).toHaveValue(USER_NAME);

  await page.locator('input[name="subject"]').fill("Test subject");
  await page.locator('textarea[name="message"]').fill("Test message");
  await page.getByRole("button", { name: "Send message" }).press("Enter");
  await expect(page.getByTestId("success-message")).toBeVisible();
});
