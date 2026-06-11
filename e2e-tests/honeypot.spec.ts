import { test, expect, Locator } from "@playwright/test";

// A real bot fills every input it can find in the DOM, including ones that are
// visually hidden to humans. These tests simulate that by writing into the
// hidden honeypot field and asserting the backend middleware rejects the
// submission.
//
// React tracks input values via a property setter, so `el.value = ...` is
// silently dropped by react-hook-form. We call the native HTMLInputElement
// setter directly and then fire an `input` event so RHF picks the value up.
async function fillHoneypot(locator: Locator, value: string) {
  await locator.evaluate((el, val) => {
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )!.set!;
    nativeSetter.call(el, val);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

test("Contact form rejects submission when honeypot is filled", async ({
  page,
}) => {
  await page.goto("/contact/");
  await expect(page.getByRole("heading", { name: "Contact us" })).toBeVisible();

  const honeypot = page.locator('input[name="phone_number"]');
  await expect(honeypot).toBeHidden();

  await page.locator('input[name="email"]').fill("vincent@verbrugh.nl");
  await page.locator('input[name="subject"]').fill("Test subject");
  await page.locator('textarea[name="message"]').fill("Test message");
  await fillHoneypot(honeypot, "http://spam.example.com");

  const responsePromise = page.waitForResponse(
    (resp) =>
      resp.url().includes("/api/contact/") &&
      resp.request().method() === "POST",
  );
  // click (unlike press) auto-waits for the button to enable, which happens
  // once the Turnstile test widget produces its token.
  await page.getByRole("button", { name: "Send message" }).click();

  const response = await responsePromise;
  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({
    errors: [{ code: "spam" }],
  });

  await expect(page.getByTestId("error-message")).toBeVisible();
  await expect(page.getByTestId("success-message")).not.toBeVisible();
});

test("Signup form rejects submission when honeypot is filled", async ({
  page,
}) => {
  const USER_NAME = `${(Math.random() + 1).toString(36).substring(7)}@psychomodels.org`;
  const PASSWORD = "6SXwmgtbvKNk&F";

  await page.goto("/account/login/");
  await page.getByRole("link", { name: "Sign up" }).click();

  const honeypot = page.locator('input[name="phone_number"]');
  await expect(honeypot).toBeHidden();

  await page.getByPlaceholder("Email address").fill(USER_NAME);
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('input[name="repeatPassword"]').fill(PASSWORD);
  await fillHoneypot(honeypot, "http://spam.example.com");

  const responsePromise = page.waitForResponse(
    (resp) =>
      resp.url().includes("/_allauth/browser/v1/auth/signup") &&
      resp.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Sign up" }).click();

  const response = await responsePromise;
  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({
    errors: [{ code: "spam" }],
  });

  await expect(page.getByTestId("error-message")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Your profile" }),
  ).not.toBeVisible();
});

// The two tests below simulate bots that POST directly to /api/contact/
// without rendering the React form. The contact endpoint is anonymous and
// doesn't require CSRF, so a bot can hit it with nothing but a payload —
// the honeypot middleware is the only thing standing between them and the
// ContactMessage table. These tests exercise the two bypasses the original
// JSON-only "filled-field" middleware missed.

test("Contact endpoint rejects direct POST that omits the honeypot field", async ({
  request,
}) => {
  // Bot scrapes the endpoint shape and POSTs only the fields it saw in the
  // visible form — `phone_number` is never included.
  const response = await request.post("/api/contact/", {
    data: {
      email: "bot@example.com",
      subject: "Buy cheap meds",
      message: "Visit http://spam.example.com",
    },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ errors: [{ code: "spam" }] });
});

test("Contact endpoint rejects form-encoded POST even with honeypot filled", async ({
  request,
}) => {
  // form-urlencoded was the original bypass: the old middleware only inspected
  // application/json bodies, so a bot using this content-type slipped through
  // regardless of whether the honeypot was filled.
  const response = await request.post("/api/contact/", {
    form: {
      email: "bot@example.com",
      subject: "Buy cheap meds",
      message: "Visit http://spam.example.com",
      phone_number: "http://spam.example.com",
    },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ errors: [{ code: "spam" }] });
});
