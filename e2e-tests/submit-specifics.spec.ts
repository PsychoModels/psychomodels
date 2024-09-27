import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Start the submission wizard and login
  await page.goto("/models/submission/");

  // Submission guidelines step
  await page.getByRole("button", { name: "Agree and continue" }).click();

  // Account step
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
});

test("Submission wizard - add new framework", async ({ page }) => {
  // Model summary step
  await page.locator('input[name="title"]').fill("Title");
  await page
    .locator('textarea[name="shortDescription"]')
    .fill("Short description");

  // create new framework
  await page.getByRole("button", { name: "Select framework" }).click();
  await page
    .getByRole("button", { name: "Create new modeling framework" })
    .click();
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill("New framework");
  await page.locator('input[name="name"]').press("Tab");
  await page
    .locator('textarea[name="description"]')
    .fill("Framework description");
  await page.locator('textarea[name="description"]').press("Tab");
  await page
    .locator('textarea[name="textarea"]')
    .fill("How does the framework works");

  await page.locator('input[name="publicationDOI"]').click();
  await page
    .locator('input[name="publicationDOI"]')
    .fill("https://doi.org/10.1080/2153599X.2022.2070255");
  await page.getByPlaceholder("https://").click();
  await page
    .getByPlaceholder("https://")
    .fill("https://www.tandfonline.com/doi/full/10.1080/2153599X.2022.2070255");
  await page.getByRole("button", { name: "Save" }).click();

  await page.getByRole("button", { name: "Model Details" }).click();

  //Model Details step
  await page.getByRole("button", { name: "Review" }).click();

  // Review step
  const reviewForm = await page.locator('[data-testid="review-form"]');
  await expect(
    reviewForm.getByRole("heading", { name: "New framework" }),
  ).toBeVisible();
  await expect(reviewForm.getByText("Framework description")).toBeVisible();

  await page.getByRole("button", { name: "Submit Psychology model" }).click();
  await expect(
    page.getByRole("heading", { name: "Submission complete" }),
  ).toBeVisible();
});

// TODO: there is an issue with the dropdown select on mobile, therefore this test is flaky. Fix this issue and enable the test.
test.skip("Submission wizard - select and add new discipline", async ({
  page,
}) => {
  // Model summary step
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

  await page.getByPlaceholder("Select or search for").click();
  await page.getByRole("option", { name: "Industrial-Organizational" }).click();

  await page.getByText("add new discipline").click();
  await page.getByRole("textbox").fill("New discipline");
  await page.getByRole("button", { name: "Save" }).click();

  const disciplineList = await page.locator(
    '[data-testid="psychologyDisciplineIds-multi-select-option-list"]',
  );

  await expect(
    disciplineList.getByText("Industrial-Organizational"),
  ).toBeVisible();

  await expect(disciplineList.getByText("New discipline")).toBeVisible();

  await page.getByRole("button", { name: "Model Details" }).click();

  //Model Details step
  await page.getByRole("button", { name: "Review" }).click();

  // Review step
  const reviewForm = await page.locator('[data-testid="review-form"]');
  await expect(
    reviewForm.getByText(
      "Psychology disciplinesIndustrial-Organizational Psychology, New discipline",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Submit Psychology model" }).click();
  await expect(
    page.getByRole("heading", { name: "Submission complete" }),
  ).toBeVisible();
});

test("Submission wizard - Publication DOI", async ({ page }) => {
  await page.route(
    "http://localhost:8000/doi/lookup/10.1080/2153599X.2022.20702551",
    async (route) => {
      await route.fulfill({ body: "Mocked Citation result" });
    },
  );

  await page.goto("/models/submission/publication-details");

  await page
    .locator('input[name="publicationDOI"]')
    .fill("https://doi.org/10.1080/2153599X.2022.20702551");
  await page.getByRole("button", { name: "Get details" }).click();
  await expect(page.getByText("Mocked Citation result")).toBeVisible();
});

test("Submission wizard - new programming language", async ({ page }) => {
  // Model summary step
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

  // Model Details step
  await page.getByText("add new language").click();
  await page.getByRole("textbox").fill("Haskell");
  await page.getByRole("button", { name: "Save" }).click();

  await page.getByRole("button", { name: "Review" }).click();

  // Review step
  const reviewForm = await page.locator('[data-testid="review-form"]');
  await expect(reviewForm.getByText("Haskell")).toBeVisible();

  await page.getByRole("button", { name: "Submit Psychology model" }).click();
  await expect(
    page.getByRole("heading", { name: "Submission complete" }),
  ).toBeVisible();
});

test("Submission wizard - add software package", async ({ page }) => {
  // Model summary step
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
  await page.getByRole("button", { name: "Add software package" }).click();
  await page.locator('input[name="name"]').fill("Django");
  await page
    .locator('textarea[name="description"]')
    .fill("Django: The web framework for perfectionists with deadlines");

  await page
    .locator('input[name="documentationUrl"]')
    .fill("https://www.djangoproject.com/");
  await page
    .getByTestId("modal-overlay")
    .locator('input[name="codeRepositoryUrl"]')
    .click();
  await page
    .getByTestId("modal-overlay")
    .locator('input[name="codeRepositoryUrl"]')
    .fill("https://github.com/django/django");
  await page
    .getByTestId("modal-overlay")
    .locator("#programmingLanguageId")
    .selectOption("1");
  await page.getByRole("button", { name: "Save" }).click();

  await page.getByRole("button", { name: "Review" }).click();

  // Review step
  const reviewForm = await page.locator('[data-testid="review-form"]');
  await expect(
    reviewForm.getByRole("heading", { name: "Django" }),
  ).toBeVisible();
  await expect(reviewForm.getByText("Software packages")).toBeVisible();

  await page.getByRole("button", { name: "Submit Psychology model" }).click();
  await expect(
    page.getByRole("heading", { name: "Submission complete" }),
  ).toBeVisible();
});

test("Submission wizard - select and add variables", async ({ page }) => {
  // Model summary step
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
  await page.getByRole("button", { name: "Add variable" }).click();
  await page.getByPlaceholder("Select a variable").click();
  await page.getByText("Reaction Time", { exact: true }).click();
  await page.locator('input[name="name"]').fill("X");
  await page.locator('textarea[name="details"]').fill("Details X");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Add variable" }).click();
  await page.getByText("create new variable").click();
  await page.locator('input[name="variableName"]').fill("Counter measure");
  await page
    .locator('textarea[name="variableDescription"]')
    .fill("Description");
  await page.locator('input[name="name"]').fill("Y");
  await page.locator('textarea[name="details"]').fill("Details Y");
  await page.getByRole("button", { name: "Save" }).click();

  await page.getByRole("button", { name: "Review" }).click();

  // Review step
  const reviewForm = await page.locator('[data-testid="review-form"]');
  await expect(reviewForm.getByText("Variables")).toBeVisible();
  await expect(reviewForm.getByRole("heading", { name: "X" })).toBeVisible();
  await expect(reviewForm.getByText("Variable: Counter measure")).toBeVisible();

  await page.getByRole("button", { name: "Submit Psychology model" }).click();
  await expect(
    page.getByRole("heading", { name: "Submission complete" }),
  ).toBeVisible();
});
