import { test, expect } from "@playwright/test";

test("Login - wrong password", async ({ page }) => {
  await page.goto("/account/login/");
  await expect(
    page.getByRole("heading", { name: "Login to your account" }),
  ).toBeVisible();
  await page.getByPlaceholder("Email address").fill("user@psychomodels.org");
  await page.getByPlaceholder("Password").fill("WRONG_PASSWORD");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Error! The email address and/")).toBeVisible();
});

test("Successful signup and login flow", async ({ page }) => {
  const USER_NAME = `${(Math.random() + 1).toString(36).substring(7)}@psychomodels.org`;
  const PASSWORD = "6SXwmgtbvKNk&F";

  // Signup
  await page.goto("/account/login/");
  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByPlaceholder("Email address").fill(USER_NAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('input[name="repeatPassword"]').fill(PASSWORD);
  await page.getByRole("button", { name: "Sign up" }).click();

  // Complete profile
  await expect(
    page.getByRole("heading", { name: "Your profile" }),
  ).toBeVisible();
  await page.locator('input[name="first_name"]').fill("Abraham");
  await page.locator('input[name="last_name"]').fill("Maslow");
  await page.locator('input[name="university"]').fill("Columbia University");
  await page.locator('input[name="department"]').fill("Psychology");
  await page.locator('input[name="position"]').fill("Student");
  await page.getByLabel("Country*").selectOption("US");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText("Your profile has been")).toBeVisible();

  // Logout
  await page.goto("/account/login/");
  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByText("Are you sure you want to").click();
  await page.getByRole("button", { name: "Logout" }).click();

  // Login
  await page.goto("/account/login/");
  await page.getByPlaceholder("Email address").fill(USER_NAME);
  await page.getByPlaceholder("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();

  // should not show the profile form again
  await expect(page.getByText("You are logged in with e-mail")).toBeVisible();
});

test("Password forgotten", async ({ page }) => {
  await page.goto("/account/password/reset/");
  await page.getByPlaceholder("Email address").fill("user@psychomodels.org");
  await page.getByPlaceholder("Email address").press("Enter");
  await expect(page.getByText("A password reset link should")).toBeVisible();
});

test("Password reset", async ({ page }) => {
  const USER_NAME = `${(Math.random() + 1).toString(36).substring(7)}@psychomodels.org`;
  const PASSWORD = "6SXwmgtbvKNk&F";

  // Signup
  await page.goto("/account/login/");
  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByPlaceholder("Email address").fill(USER_NAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('input[name="repeatPassword"]').fill(PASSWORD);
  await page.getByRole("button", { name: "Sign up" }).click();

  // Complete profile
  await expect(
    page.getByRole("heading", { name: "Your profile" }),
  ).toBeVisible();
  await page.locator('input[name="first_name"]').fill("Abraham");
  await page.locator('input[name="last_name"]').fill("Maslow");
  await page.locator('input[name="university"]').fill("Columbia University");
  await page.locator('input[name="department"]').fill("Psychology");
  await page.getByLabel("Country*").selectOption("US");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText("Your profile has been")).toBeVisible();

  const NEW_PASSWORD = "ag3546o234nks4F";

  await page.goto("/account/change-password/");
  await page.getByPlaceholder("Current password").fill(PASSWORD);
  await page
    .getByPlaceholder("New password", { exact: true })
    .fill(NEW_PASSWORD);
  await page.getByPlaceholder("Repeat new password").fill(NEW_PASSWORD);
  await page.getByPlaceholder("Repeat new password").press("Enter");
  await expect(
    page.getByText("Your password has been successfully changed."),
  ).toBeVisible();

  // Logout
  await page.goto("/account/login/");
  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByText("Are you sure you want to").click();
  await page.getByRole("button", { name: "Logout" }).click();

  // Login with new password
  await page.goto("/account/login/");
  await page.getByPlaceholder("Email address").fill(USER_NAME);
  await page.getByPlaceholder("Password").fill(NEW_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();

  // should not show the profile form again
  await expect(page.getByText("You are logged in with e-mail")).toBeVisible();
});
