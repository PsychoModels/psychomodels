import { test, expect } from "@playwright/test";

test("Submission wizard - only required input", async ({ page }) => {
  await page.goto("/models/submission/");

  // Submission guidelines step
  await expect(
    page.getByRole("heading", { name: "Submission guidelines" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("1 of 5 complete");
  await page.getByRole("button", { name: "Continue" }).click();

  // Account step
  await expect(
    page.getByRole("heading", { name: "Login to your account" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("2 of 5 complete");

  const USER_NAME = `${(Math.random() + 1).toString(36).substring(7)}@psychomodels.org`;
  const PASSWORD = "6SXwmgtbvKNk&F";

  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByPlaceholder("Email address").fill(USER_NAME);

  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('input[name="repeatPassword"]').fill(PASSWORD);
  await page.getByRole("button", { name: "Sign up" }).click();

  await page.getByRole("heading", { name: "Complete profile" }).click();

  await page.locator('input[name="first_name"]').fill("Sigmund");
  await page.locator('input[name="last_name"]').fill("Freud");
  await page.locator('input[name="university"]').fill("Universität Wien");
  await page.locator('input[name="department"]').fill("Psychology");
  await page.getByLabel("Country*").selectOption("AT");
  await page.getByRole("button", { name: "Save profile" }).click();

  // Model summary step
  await expect(
    page.getByRole("heading", { name: "Model summary" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("3 of 5 complete");

  await page.locator('input[name="title"]').fill("Title");
  await page
    .locator('textarea[name="shortDescription"]')
    .fill("Short description");
  await page.getByRole("button", { name: "Select framework" }).click();

  await page
    .locator('[data-testid="framework-select-list"] div')
    .filter({ hasText: "Ising ModelSelect A" })
    .getByRole("button")
    .click();

  await page.getByRole("button", { name: "Model Details" }).click();

  //Model Details step
  await expect(
    page.getByRole("heading", { name: "Model Details" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("4 of 5 complete");
  // NO REQUIRED INPUTS IN THIS STEP

  await page.getByRole("button", { name: "Review" }).click();

  // Review step
  await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("5 of 5 complete");

  const reviewForm = await page.locator('[data-testid="review-form"]');

  await expect(
    reviewForm.getByRole("heading", { name: "Title" }),
  ).toBeVisible();
  await expect(reviewForm.getByText("Short description")).toBeVisible();
  await expect(
    reviewForm.getByRole("heading", { name: "Ising Model" }),
  ).toBeVisible();

  await page.getByRole("textbox").fill("Remarks");
  await page.getByLabel("Yes, I agree to release the").check();

  await page.getByRole("button", { name: "Submit Psychology model" }).click();
  await expect(
    page.getByRole("heading", { name: "Submission complete" }),
  ).toBeVisible();
});

test("Submission wizard - login", async ({ page }) => {
  // Create a new user and logout
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

  // Logout
  await page.goto("/account/login/");
  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByText("Are you sure you want to").click();
  await page.getByRole("button", { name: "Logout" }).click();

  await page.goto("/models/submission/");

  // Submission guidelines step
  await expect(
    page.getByRole("heading", { name: "Submission guidelines" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("1 of 5 complete");
  await page.getByRole("button", { name: "Continue" }).click();

  // Account step
  await expect(
    page.getByRole("heading", { name: "Login to your account" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("2 of 5 complete");

  await page.getByPlaceholder("Email address").fill(USER_NAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();

  // Model summary step
  await expect(
    page.getByRole("heading", { name: "Model summary" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("3 of 5 complete");

  await page.locator('input[name="title"]').fill("Title");
  await page
    .locator('textarea[name="shortDescription"]')
    .fill("Short description");
  await page.getByRole("button", { name: "Select framework" }).click();

  await page
    .locator('[data-testid="framework-select-list"] div')
    .filter({ hasText: "Ising ModelSelect A" })
    .getByRole("button")
    .click();

  await page.getByRole("button", { name: "Model Details" }).click();

  //Model Details step
  await expect(
    page.getByRole("heading", { name: "Model Details" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("4 of 5 complete");
  // NO REQUIRED INPUTS IN THIS STEP

  await page.getByRole("button", { name: "Review" }).click();

  // Review step
  await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("5 of 5 complete");

  const reviewForm = await page.locator('[data-testid="review-form"]');

  await expect(
    reviewForm.getByRole("heading", { name: "Title" }),
  ).toBeVisible();
  await expect(reviewForm.getByText("Short description")).toBeVisible();
  await expect(
    reviewForm.getByRole("heading", { name: "Ising Model" }),
  ).toBeVisible();

  await page.getByRole("textbox").fill("Remarks");
  await page.getByLabel("Yes, I agree to release the").check();
  await page.getByRole("button", { name: "Submit Psychology model" }).click();
  await expect(
    page.getByRole("heading", { name: "Submission complete" }),
  ).toBeVisible();
});

test("Submission wizard - skipped steps error messages", async ({ page }) => {
  await page.goto("/models/submission/review");
  await expect(
    page.getByText(
      "You have not completed the Submission guidelines step. Please go back to review",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "You have not completed the Login to your account step. Please go back to review",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "You have not completed the Model summary step. Please go back to review",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "You have not completed the Model Details step. Please go back to review",
    ),
  ).toBeVisible();
});

test("Submission wizard - jump over account step if already logged in", async ({
  page,
}) => {
  // Create a new user and logout
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

  await page.goto("/models/submission/");

  // Submission guidelines step
  await expect(
    page.getByRole("heading", { name: "Submission guidelines" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("1 of 5 complete");
  await page.getByRole("button", { name: "Continue" }).click();

  // Account step :: expect to be skipped

  // Model summary step
  await expect(
    page.getByRole("heading", { name: "Model summary" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("3 of 5 complete");

  await page.locator('input[name="title"]').fill("Title");
  await page
    .locator('textarea[name="shortDescription"]')
    .fill("Short description");
  await page.getByRole("button", { name: "Select framework" }).click();

  await page
    .locator('[data-testid="framework-select-list"] div')
    .filter({ hasText: "Ising ModelSelect A" })
    .getByRole("button")
    .click();

  await page.getByRole("button", { name: "Model Details" }).click();

  //Model Details step
  await expect(
    page.getByRole("heading", { name: "Model Details" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("4 of 5 complete");
  // NO REQUIRED INPUTS IN THIS STEP

  await page.getByRole("button", { name: "Review" }).click();

  // Review step
  await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
  await expect(
    page.locator('[data-testid="step-progress-indicator"]'),
  ).toHaveText("5 of 5 complete");

  const reviewForm = await page.locator('[data-testid="review-form"]');

  await expect(
    reviewForm.getByRole("heading", { name: "Title" }),
  ).toBeVisible();
  await expect(reviewForm.getByText("Short description")).toBeVisible();
  await expect(
    reviewForm.getByRole("heading", { name: "Ising Model" }),
  ).toBeVisible();

  await page.getByRole("textbox").fill("Remarks");
  await page.getByLabel("Yes, I agree to release the").check();
  await page.getByRole("button", { name: "Submit Psychology model" }).click();
  await expect(
    page.getByRole("heading", { name: "Submission complete" }),
  ).toBeVisible();
});
