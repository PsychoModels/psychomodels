import { test, expect } from "@playwright/test";

// The e2e environment runs with Cloudflare's official test keys: the widget
// auto-passes in the browser and the test secret accepts any token. The
// middleware still rejects requests carrying no token at all — which is
// exactly what a bot POSTing the endpoints directly looks like.
//
// Contact and signup bodies include an empty phone_number so the request
// clears the honeypot middleware and the 400 is attributable to Turnstile.

test("Contact endpoint rejects direct POST without Turnstile token", async ({
  request,
}) => {
  const response = await request.post("/api/contact/", {
    data: {
      email: "bot@example.com",
      subject: "Buy cheap meds",
      message: "Visit http://spam.example.com",
      phone_number: "",
    },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ errors: [{ code: "spam" }] });
});

test("Signup endpoint rejects direct POST without Turnstile token", async ({
  request,
}) => {
  const response = await request.post("/_allauth/browser/v1/auth/signup", {
    data: {
      email: "bot@example.com",
      password: "6SXwmgtbvKNk&F",
      phone_number: "",
    },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ errors: [{ code: "spam" }] });
});

test("Login endpoint rejects direct POST without Turnstile token", async ({
  request,
}) => {
  const response = await request.post("/_allauth/browser/v1/auth/login", {
    data: { email: "bot@example.com", password: "whatever123" },
  });

  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ errors: [{ code: "spam" }] });
});

test("Password reset endpoint rejects direct POST without Turnstile token", async ({
  request,
}) => {
  const response = await request.post(
    "/_allauth/browser/v1/auth/password/request",
    {
      data: { email: "bot@example.com" },
    },
  );

  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ errors: [{ code: "spam" }] });
});

test("Contact form completes the Turnstile challenge and submits", async ({
  page,
}) => {
  await page.goto("/contact/");
  await expect(page.getByRole("heading", { name: "Contact us" })).toBeVisible();

  await page.locator('input[name="email"]').fill("vincent@verbrugh.nl");
  await page.locator('input[name="subject"]').fill("Turnstile e2e");
  await page.locator('textarea[name="message"]').fill("Test message");

  // The submit button stays disabled until the (auto-passing) test widget
  // produces a token; Playwright's click auto-waits for it to enable.
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByTestId("success-message")).toBeVisible();
});
