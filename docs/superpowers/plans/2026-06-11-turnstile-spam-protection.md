# Cloudflare Turnstile Spam Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Cloudflare Turnstile verification to the contact, signup, login, and password-reset endpoints to stop spam that gets past the existing honeypot.

**Architecture:** A new Django middleware (`TurnstileMiddleware`), placed right after the existing `JsonHoneypotMiddleware`, verifies a `cf_turnstile_response` token from the request body against Cloudflare's siteverify API for a settings-defined list of protected paths. On the frontend, a shared `TurnstileWidget` React component (wrapping `@marsidev/react-turnstile`) is added to the four forms; the token gates the submit button and travels in the existing POST body. Fail-open if Cloudflare itself is unreachable; middleware inert when `TURNSTILE_SECRET_KEY` is unset.

**Tech Stack:** Django 6 middleware + urllib3 (already a dependency), React 18 + react-hook-form + zod, `@marsidev/react-turnstile` (new frontend dependency), Django unittest, vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-06-11-turnstile-spam-protection-design.md`

**Key facts an implementer needs:**

- Backend tests run with `uv run python manage.py test <app>` (Django test runner, not pytest). Frontend unit tests: `yarn vitest run <path>`. Lint: `yarn lint`. E2E: `docker compose up -d --build` then `yarn playwright test`.
- The existing honeypot middleware (`psychomodels/honeypot_middleware.py`) guards `/api/contact/` and the signup path and runs BEFORE the new Turnstile middleware. Direct POSTs to contact/signup must include `phone_number: ""` to get past it so a 400 is attributable to Turnstile.
- Both middlewares run BEFORE `CsrfViewMiddleware`, so direct POSTs in tests never hit CSRF errors.
- Cloudflare's official test keys: site key `1x00000000000000000000AA` (widget always passes), secret key `1x0000000000000000000000000000000AA` (siteverify accepts any token). These are used in dev/docker/e2e.
- `.env` is gitignored; settings load it via `python-dotenv`. `settings.py` already contains an `if "test" in sys.argv:` block precedent.
- vitest loads `.env` through Vite, so `import.meta.env.VITE_TURNSTILE_SITE_KEY` may be set during component tests — that's why the four form test files mock `@marsidev/react-turnstile`.

---

### Task 1: Shared body-parsing helper (refactor out of honeypot middleware)

The honeypot middleware has a private `_extract_body`; the Turnstile middleware needs identical parsing. Extract it to a shared module.

**Files:**
- Create: `psychomodels/body_parsing.py`
- Create: `psychomodels/tests.py`
- Modify: `psychomodels/honeypot_middleware.py`

- [ ] **Step 1: Write the failing tests**

Create `psychomodels/tests.py`:

```python
import json

from django.test import RequestFactory, SimpleTestCase

from psychomodels.body_parsing import extract_body


class ExtractBodyTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_json_body(self):
        request = self.factory.post(
            "/x/", data=json.dumps({"a": 1}), content_type="application/json"
        )
        self.assertEqual(extract_body(request), {"a": 1})

    def test_invalid_json_returns_none(self):
        request = self.factory.post(
            "/x/", data="not json", content_type="application/json"
        )
        self.assertIsNone(extract_body(request))

    def test_json_array_returns_none(self):
        request = self.factory.post(
            "/x/", data=json.dumps([1, 2]), content_type="application/json"
        )
        self.assertIsNone(extract_body(request))

    def test_form_encoded_body(self):
        request = self.factory.post("/x/", data={"a": "1"})
        self.assertEqual(extract_body(request).get("a"), "1")

    def test_unknown_content_type_returns_none(self):
        request = self.factory.post("/x/", data="a=1", content_type="text/plain")
        self.assertIsNone(extract_body(request))
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `uv run python manage.py test psychomodels -v 2`
Expected: ERROR — `ModuleNotFoundError: No module named 'psychomodels.body_parsing'`

- [ ] **Step 3: Create the helper module**

Create `psychomodels/body_parsing.py`:

```python
"""Shared POST-body parsing for the spam-protection middlewares."""

import json


def extract_body(request):
    """Return the request body as a dict-like object, or None if it can't
    be parsed for a known content type."""
    content_type = (request.content_type or "").lower()
    if "application/json" in content_type:
        try:
            parsed = json.loads(request.body or b"{}")
        except (json.JSONDecodeError, ValueError):
            return None
        return parsed if isinstance(parsed, dict) else None
    if (
        "application/x-www-form-urlencoded" in content_type
        or "multipart/form-data" in content_type
    ):
        return request.POST
    return None
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `uv run python manage.py test psychomodels -v 2`
Expected: 5 tests, OK

- [ ] **Step 5: Switch the honeypot middleware to the shared helper**

In `psychomodels/honeypot_middleware.py`:

1. Add import below the existing imports: `from psychomodels.body_parsing import extract_body`
2. In `__call__`, change `body = self._extract_body(request)` to `body = extract_body(request)`
3. Delete the entire `_extract_body` method (lines 49–62 in the current file).
4. Remove the now-unused imports `json` and `QueryDict` (keep `logging`, `settings`, `JsonResponse`).

- [ ] **Step 6: Run the full backend suite to verify nothing broke**

Run: `uv run python manage.py test`
Expected: all tests pass (api/contact/members suites unaffected)

- [ ] **Step 7: Commit**

```bash
git add psychomodels/body_parsing.py psychomodels/tests.py psychomodels/honeypot_middleware.py
git commit -m "refactor: extract shared POST body parsing from honeypot middleware"
```

---

### Task 2: TurnstileMiddleware (TDD)

**Files:**
- Create: `psychomodels/turnstile_middleware.py`
- Modify: `psychomodels/tests.py`

- [ ] **Step 1: Write the failing tests**

Append to `psychomodels/tests.py` (and extend the top-of-file imports to match):

```python
import json
from unittest import mock

import urllib3
from django.http import JsonResponse
from django.test import RequestFactory, SimpleTestCase, override_settings

from psychomodels.body_parsing import extract_body
from psychomodels.turnstile_middleware import TurnstileMiddleware


def siteverify_response(success, error_codes=None):
    response = mock.Mock()
    response.data = json.dumps(
        {"success": success, "error-codes": error_codes or []}
    ).encode()
    return response


@override_settings(
    TURNSTILE_SECRET_KEY="test-secret",
    TURNSTILE_PROTECTED_PATHS=["/api/contact/"],
)
class TurnstileMiddlewareTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.middleware = TurnstileMiddleware(
            lambda request: JsonResponse({"ok": True})
        )

    def post(self, body, path="/api/contact/"):
        return self.factory.post(
            path, data=json.dumps(body), content_type="application/json"
        )

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_valid_token_passes(self, request_mock):
        request_mock.return_value = siteverify_response(True)
        response = self.middleware(self.post({"cf_turnstile_response": "tok"}))
        self.assertEqual(response.status_code, 200)
        request_mock.assert_called_once()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_failed_verification_rejected(self, request_mock):
        request_mock.return_value = siteverify_response(
            False, ["invalid-input-response"]
        )
        response = self.middleware(self.post({"cf_turnstile_response": "tok"}))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            json.loads(response.content),
            {"errors": [{"code": "spam", "message": "Invalid request."}]},
        )

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_missing_token_rejected_without_api_call(self, request_mock):
        response = self.middleware(self.post({"email": "a@b.c"}))
        self.assertEqual(response.status_code, 400)
        request_mock.assert_not_called()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_empty_token_rejected_without_api_call(self, request_mock):
        response = self.middleware(self.post({"cf_turnstile_response": ""}))
        self.assertEqual(response.status_code, 400)
        request_mock.assert_not_called()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_unparseable_body_rejected(self, request_mock):
        request = self.factory.post(
            "/api/contact/", data="not json", content_type="application/json"
        )
        response = self.middleware(request)
        self.assertEqual(response.status_code, 400)
        request_mock.assert_not_called()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_siteverify_error_fails_open(self, request_mock):
        request_mock.side_effect = urllib3.exceptions.HTTPError("boom")
        response = self.middleware(self.post({"cf_turnstile_response": "tok"}))
        self.assertEqual(response.status_code, 200)

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_unprotected_path_ignored(self, request_mock):
        response = self.middleware(self.post({"x": 1}, path="/api/other/"))
        self.assertEqual(response.status_code, 200)
        request_mock.assert_not_called()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_get_request_ignored(self, request_mock):
        response = self.middleware(self.factory.get("/api/contact/"))
        self.assertEqual(response.status_code, 200)
        request_mock.assert_not_called()

    @override_settings(TURNSTILE_SECRET_KEY="")
    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_disabled_without_secret_key(self, request_mock):
        response = self.middleware(self.post({"email": "a@b.c"}))
        self.assertEqual(response.status_code, 200)
        request_mock.assert_not_called()

    @mock.patch("psychomodels.turnstile_middleware.http.request")
    def test_form_encoded_token_extracted(self, request_mock):
        request_mock.return_value = siteverify_response(True)
        request = self.factory.post(
            "/api/contact/", data={"cf_turnstile_response": "tok"}
        )
        response = self.middleware(request)
        self.assertEqual(response.status_code, 200)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `uv run python manage.py test psychomodels -v 2`
Expected: ERROR — `ModuleNotFoundError: No module named 'psychomodels.turnstile_middleware'`

- [ ] **Step 3: Implement the middleware**

Create `psychomodels/turnstile_middleware.py`:

```python
import json
import logging

import urllib3
from django.conf import settings
from django.http import JsonResponse

from psychomodels.body_parsing import extract_body

logger = logging.getLogger(__name__)

TOKEN_FIELD = "cf_turnstile_response"

http = urllib3.PoolManager()


class TurnstileMiddleware:
    """Verify a Cloudflare Turnstile token on POSTs to protected paths.

    The frontend forms render a Turnstile widget and include the resulting
    token in the request body as `cf_turnstile_response`; this middleware
    verifies it against Cloudflare's siteverify API. Rejections reuse the
    honeypot middleware's response shape so frontend error handling stays
    uniform.

    Fail-open: if siteverify itself is unreachable the request is allowed
    through (the honeypot remains as backstop) — spam protection must not
    take down signup/login during a Cloudflare outage.

    Inert when TURNSTILE_SECRET_KEY is unset (warning logged at startup).
    Settings are read per-request so override_settings works in tests.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        if not getattr(settings, "TURNSTILE_SECRET_KEY", ""):
            logger.warning(
                "TURNSTILE_SECRET_KEY is not set; Turnstile verification is disabled."
            )

    def __call__(self, request):
        secret_key = getattr(settings, "TURNSTILE_SECRET_KEY", "")
        protected_paths = getattr(settings, "TURNSTILE_PROTECTED_PATHS", [])
        if (
            secret_key
            and request.method == "POST"
            and any(request.path.startswith(path) for path in protected_paths)
        ):
            body = extract_body(request)
            if body is None:
                return self._reject(request, "unparseable")
            token = body.get(TOKEN_FIELD)
            if not token:
                return self._reject(request, "missing-token")
            if not self._verify(secret_key, token, request.META.get("REMOTE_ADDR")):
                return self._reject(request, "verification-failed")

        return self.get_response(request)

    def _verify(self, secret_key, token, remote_ip):
        verify_url = getattr(
            settings,
            "TURNSTILE_VERIFY_URL",
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        )
        payload = {"secret": secret_key, "response": token}
        if remote_ip:
            payload["remoteip"] = remote_ip
        try:
            response = http.request(
                "POST",
                verify_url,
                body=json.dumps(payload),
                headers={"Content-Type": "application/json"},
                timeout=urllib3.Timeout(total=5.0),
                retries=False,
            )
            result = json.loads(response.data)
        except Exception:
            logger.exception(
                "Turnstile siteverify request failed; allowing request (fail-open)."
            )
            return True
        if result.get("success"):
            return True
        logger.info(
            "Turnstile verification failed (error-codes: %s)",
            ",".join(result.get("error-codes", [])),
        )
        return False

    def _reject(self, request, reason):
        logger.warning(
            "Turnstile rejected request on %s (ip: %s, reason: %s, ct: %s)",
            request.path,
            request.META.get("REMOTE_ADDR"),
            reason,
            request.content_type,
        )
        return JsonResponse(
            {"errors": [{"code": "spam", "message": "Invalid request."}]},
            status=400,
        )
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `uv run python manage.py test psychomodels -v 2`
Expected: 15 tests (5 body-parsing + 10 turnstile), OK

- [ ] **Step 5: Commit**

```bash
git add psychomodels/turnstile_middleware.py psychomodels/tests.py
git commit -m "feat: add Cloudflare Turnstile verification middleware"
```

---

### Task 3: Settings wiring, middleware registration, integration tests

**Files:**
- Modify: `psychomodels/settings.py` (MIDDLEWARE list ~line 66; Turnstile block after `HONEYPOT_FIELD_NAME = "phone_number"` ~line 320)
- Modify: `psychomodels/tests.py`
- Modify: `.env` (local, gitignored)

- [ ] **Step 1: Write the failing integration tests**

Append to `psychomodels/tests.py`:

```python
@override_settings(TURNSTILE_SECRET_KEY="test-secret")
class TurnstileIntegrationTests(SimpleTestCase):
    """Exercise the registered middleware chain via the test client.

    Rejection happens in middleware, before any view or DB access, so
    SimpleTestCase is safe. Contact/signup bodies include an empty
    phone_number so the honeypot middleware lets them through and the 400
    is attributable to Turnstile.
    """

    def post_json(self, path, body):
        return self.client.post(
            path, data=json.dumps(body), content_type="application/json"
        )

    def assert_spam_rejection(self, response):
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            json.loads(response.content),
            {"errors": [{"code": "spam", "message": "Invalid request."}]},
        )

    def test_contact_without_token_rejected(self):
        response = self.post_json(
            "/api/contact/",
            {
                "email": "bot@example.com",
                "subject": "spam",
                "message": "spam",
                "phone_number": "",
            },
        )
        self.assert_spam_rejection(response)

    def test_signup_without_token_rejected(self):
        response = self.post_json(
            "/_allauth/browser/v1/auth/signup",
            {"email": "bot@example.com", "password": "x", "phone_number": ""},
        )
        self.assert_spam_rejection(response)

    def test_login_without_token_rejected(self):
        response = self.post_json(
            "/_allauth/browser/v1/auth/login",
            {"email": "bot@example.com", "password": "x"},
        )
        self.assert_spam_rejection(response)

    def test_password_reset_request_without_token_rejected(self):
        response = self.post_json(
            "/_allauth/browser/v1/auth/password/request",
            {"email": "bot@example.com"},
        )
        self.assert_spam_rejection(response)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `uv run python manage.py test psychomodels -v 2`
Expected: the four integration tests FAIL (middleware not registered yet, so requests reach CSRF/views and return something other than the spam 400)

- [ ] **Step 3: Wire up settings**

In `psychomodels/settings.py`:

1. In `MIDDLEWARE`, directly after `"psychomodels.honeypot_middleware.JsonHoneypotMiddleware",` add:

```python
    "psychomodels.turnstile_middleware.TurnstileMiddleware",
```

2. Directly after `HONEYPOT_FIELD_NAME = "phone_number"` add:

```python
# Cloudflare Turnstile (anti-spam). Inert when TURNSTILE_SECRET_KEY is unset.
TURNSTILE_SECRET_KEY = os.getenv("TURNSTILE_SECRET_KEY", "")
TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
TURNSTILE_PROTECTED_PATHS = [
    "/api/contact/",
    "/_allauth/browser/v1/auth/signup",
    "/_allauth/browser/v1/auth/login",
    "/_allauth/browser/v1/auth/password/request",
]

# Local .env carries the Turnstile dev keys; keep unit tests deterministic by
# disabling verification — tests that exercise it use override_settings.
if "test" in sys.argv:
    TURNSTILE_SECRET_KEY = ""
```

(`sys` is already imported in settings.py — there is an existing `if "test" in sys.argv:` block at the bottom; keep the new block ABOVE it or merge them, either is fine.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `uv run python manage.py test psychomodels -v 2`
Expected: 19 tests, OK

- [ ] **Step 5: Run the full backend suite**

Run: `uv run python manage.py test`
Expected: all pass — the `if "test" in sys.argv` guard keeps existing api/contact/members tests unaffected even though `.env` will carry a Turnstile key.

- [ ] **Step 6: Add dev keys to local `.env`**

Append to `.env` (gitignored — these are Cloudflare's official always-pass test keys, not secrets):

```
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

- [ ] **Step 7: Commit**

```bash
git add psychomodels/settings.py psychomodels/tests.py
git commit -m "feat: enable Turnstile middleware for contact, signup, login and password reset"
```

---

### Task 4: Frontend — dependency, TurnstileWidget component, test mock

**Files:**
- Modify: `package.json` (via yarn)
- Create: `frontend_src/modules/shared/components/Form/TurnstileWidget.tsx`
- Create: `frontend_src/test-utils/turnstileMock.tsx`
- Create: `frontend_src/modules/shared/components/Form/TurnstileWidget.test.tsx`
- Modify: `frontend_src/vite-env.d.ts`

- [ ] **Step 1: Install the dependency**

Run: `yarn add @marsidev/react-turnstile`
Expected: package.json + yarn.lock updated, no peer-dependency warnings for React 18

- [ ] **Step 2: Add the env var type**

In `frontend_src/vite-env.d.ts`, inside `ImportMetaEnv`:

```ts
interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  // more env variables...
}
```

- [ ] **Step 3: Write the failing widget test**

Create `frontend_src/modules/shared/components/Form/TurnstileWidget.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi, afterEach } from "vitest";

vi.mock("@marsidev/react-turnstile", () =>
  import("../../../../test-utils/turnstileMock.tsx"),
);

import { TurnstileWidget } from "./TurnstileWidget.tsx";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TurnstileWidget", () => {
  it("renders the widget and forwards the token when a site key is set", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "1x00000000000000000000AA");
    const onTokenChange = vi.fn();

    render(<TurnstileWidget onTokenChange={onTokenChange} />);

    expect(screen.getByTestId("turnstile-widget")).toBeInTheDocument();
    await waitFor(() => {
      expect(onTokenChange).toHaveBeenCalledWith("test-turnstile-token");
    });
  });

  it("renders nothing and emits a placeholder token when no site key is set", async () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "");
    const onTokenChange = vi.fn();

    render(<TurnstileWidget onTokenChange={onTokenChange} />);

    expect(screen.queryByTestId("turnstile-widget")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(onTokenChange).toHaveBeenCalledWith("turnstile-disabled");
    });
  });
});
```

Also create the shared mock `frontend_src/test-utils/turnstileMock.tsx` (used by this test and the four form tests later):

```tsx
import React from "react";

// Stand-in for @marsidev/react-turnstile in component tests: jsdom can't run
// Cloudflare's real challenge script, so this immediately "passes" the
// challenge, letting token-gated submit buttons enable.
interface MockProps {
  onSuccess?: (token: string) => void;
}

export const Turnstile = React.forwardRef<unknown, MockProps>(
  function TurnstileMock({ onSuccess }, _ref) {
    React.useEffect(() => {
      onSuccess?.("test-turnstile-token");
    }, [onSuccess]);
    return <div data-testid="turnstile-widget" />;
  },
);
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `yarn vitest run frontend_src/modules/shared/components/Form/TurnstileWidget.test.tsx`
Expected: FAIL — `TurnstileWidget.tsx` does not exist

- [ ] **Step 5: Implement the component**

Create `frontend_src/modules/shared/components/Form/TurnstileWidget.tsx`:

```tsx
import React from "react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

interface Props {
  onTokenChange: (token: string) => void;
}

// When no site key is configured (e.g. local dev without Turnstile), the
// backend middleware is inert too; emit a placeholder token so token-gated
// forms remain usable.
export const TurnstileWidget = React.forwardRef<TurnstileInstance, Props>(
  function TurnstileWidget({ onTokenChange }, ref) {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

    React.useEffect(() => {
      if (!siteKey) {
        onTokenChange("turnstile-disabled");
      }
    }, [siteKey, onTokenChange]);

    if (!siteKey) {
      return null;
    }

    return (
      <Turnstile
        ref={ref}
        siteKey={siteKey}
        onSuccess={onTokenChange}
        onExpire={() => onTokenChange("")}
        onError={() => onTokenChange("")}
      />
    );
  },
);
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `yarn vitest run frontend_src/modules/shared/components/Form/TurnstileWidget.test.tsx`
Expected: 2 tests pass

- [ ] **Step 7: Lint and commit**

```bash
yarn lint
git add package.json yarn.lock frontend_src/vite-env.d.ts \
  frontend_src/modules/shared/components/Form/TurnstileWidget.tsx \
  frontend_src/modules/shared/components/Form/TurnstileWidget.test.tsx \
  frontend_src/test-utils/turnstileMock.tsx
git commit -m "feat: add shared TurnstileWidget component"
```

---

### Task 5: Integrate Turnstile into ContactForm

**Files:**
- Modify: `frontend_src/modules/contact-form/components/ContactForm/index.tsx`
- Modify: `frontend_src/modules/contact-form/components/ContactForm/index.test.tsx`

- [ ] **Step 1: Add the Turnstile mock to the test file**

In `index.test.tsx`, directly after the existing imports (note: `vi` is already imported from vitest in this file):

```tsx
vi.mock("@marsidev/react-turnstile", () =>
  import("../../../../test-utils/turnstileMock.tsx"),
);
```

- [ ] **Step 2: Modify the component**

In `frontend_src/modules/contact-form/components/ContactForm/index.tsx`:

1. Add imports:

```tsx
import { TurnstileWidget } from "../../../shared/components/Form/TurnstileWidget.tsx";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
```

2. Extend the schema:

```tsx
const formSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  phone_number: z.string().optional(),
  cf_turnstile_response: z
    .string()
    .min(1, { message: "Please complete the anti-spam check" }),
});
```

3. Inside the component, add a ref and extend the `useForm` destructuring/defaults:

```tsx
  const turnstileRef = React.useRef<TurnstileInstance>(null);

  const { control, handleSubmit, register, setValue, watch } =
    useForm<ValidationSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: initialEmail || "",
        subject: "",
        message: "",
        phone_number: "",
        cf_turnstile_response: "",
      },
    });
  const turnstileToken = watch("cf_turnstile_response");
```

4. Add an `onError` handler to the mutation (tokens are single-use — a failed submit needs a fresh one):

```tsx
  const mutation = useMutation({
    mutationFn: (data: ValidationSchema) => {
      return axios.post("/api/contact/", data, {
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
      });
    },
    onSuccess: () => {
      setIsDone(true);
      window.scrollTo(0, 0);
    },
    onError: () => {
      turnstileRef.current?.reset();
      setValue("cf_turnstile_response", "");
    },
  });
```

5. In the JSX, directly above the `<Button>`:

```tsx
        <TurnstileWidget
          ref={turnstileRef}
          onTokenChange={(token) =>
            setValue("cf_turnstile_response", token, { shouldValidate: true })
          }
        />
```

6. Gate the submit button (Playwright auto-waits for enabled buttons, which makes e2e robust against widget latency):

```tsx
          disabled={mutation.isPending || !turnstileToken}
```

- [ ] **Step 3: Run the component tests**

Run: `yarn vitest run frontend_src/modules/contact-form/components/ContactForm/index.test.tsx`
Expected: all 4 existing tests pass (the mock supplies a token on mount, enabling the button)

- [ ] **Step 4: Commit**

```bash
git add frontend_src/modules/contact-form/components/ContactForm/
git commit -m "feat: require Turnstile verification on contact form"
```

---

> **ERRATUM (applies to Tasks 6–8):** Task 5 revealed that `watch("cf_turnstile_response")` can miss the token when it's emitted from a child mount effect (child effects run before the parent's form subscription attaches). Follow the pattern actually shipped in ContactForm instead: a local `const [turnstileToken, setTurnstileToken] = React.useState("")` gates the submit button; `onTokenChange` sets BOTH the form field (`setValue(..., { shouldValidate: true })`) and the state; the mutation's `onError` resets the widget and clears both. Do not destructure `watch`.

### Task 6: Integrate Turnstile into SignupForm

**Files:**
- Modify: `frontend_src/modules/account/components/SignupForm/index.tsx`
- Modify: `frontend_src/modules/account/components/SignupForm/index.test.tsx`

- [ ] **Step 1: Add the Turnstile mock to the test file**

In `index.test.tsx`, directly after the existing imports (add `vi` to the vitest import if it isn't there):

```tsx
vi.mock("@marsidev/react-turnstile", () =>
  import("../../../../test-utils/turnstileMock.tsx"),
);
```

- [ ] **Step 2: Modify the component**

In `frontend_src/modules/account/components/SignupForm/index.tsx`:

1. Add imports:

```tsx
import { TurnstileWidget } from "../../../shared/components/Form/TurnstileWidget.tsx";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
```

2. Extend the schema (inside the `z.object({...})`, before `.refine`):

```tsx
const formSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "The password must contain at least 8 characters" }),
    repeatPassword: z
      .string()
      .min(8, { message: "The password must contain at least 8 characters" }),
    phone_number: z.string().optional(),
    cf_turnstile_response: z
      .string()
      .min(1, { message: "Please complete the anti-spam check" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"], // This indicates which field the error message will be associated with
    message: "Passwords do not match",
  });
```

3. Inside the component, add the ref (before the mutation), extend the mutation with `onError`, and extend `useForm`:

```tsx
  const turnstileRef = React.useRef<TurnstileInstance>(null);

  const mutation = useMutation({
    mutationFn: (signupData: ValidationSchema) => {
      return signUp(signupData);
    },
    onSuccess: () => {
      onSignupSuccess();

      queryClient.invalidateQueries({
        queryKey: ["auth", "session", "status"],
      });
    },
    onError: () => {
      turnstileRef.current?.reset();
      setValue("cf_turnstile_response", "");
    },
  });

  const formMethods = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
      phone_number: "",
      cf_turnstile_response: "",
    },
  });
  const { control, handleSubmit, register, setValue, watch } = formMethods;
  const turnstileToken = watch("cf_turnstile_response");
```

(Note: `setValue` is referenced by the mutation's `onError` but destructured after it — that's fine, the closure runs long after both exist.)

4. In the JSX, directly above the `<Button>`:

```tsx
        <TurnstileWidget
          ref={turnstileRef}
          onTokenChange={(token) =>
            setValue("cf_turnstile_response", token, { shouldValidate: true })
          }
        />
```

5. Gate the submit button:

```tsx
          disabled={mutation.isPending || !turnstileToken}
```

- [ ] **Step 3: Run the component tests**

Run: `yarn vitest run frontend_src/modules/account/components/SignupForm/index.test.tsx`
Expected: all existing tests pass

- [ ] **Step 4: Commit**

```bash
git add frontend_src/modules/account/components/SignupForm/
git commit -m "feat: require Turnstile verification on signup form"
```

---

### Task 7: Integrate Turnstile into LoginForm

**Files:**
- Modify: `frontend_src/modules/account/components/LoginForm/index.tsx`
- Modify: `frontend_src/modules/account/components/LoginForm/index.test.tsx`

- [ ] **Step 1: Add the Turnstile mock to the test file**

In `index.test.tsx`, directly after the existing imports (add `vi` to the vitest import if it isn't there):

```tsx
vi.mock("@marsidev/react-turnstile", () =>
  import("../../../../test-utils/turnstileMock.tsx"),
);
```

- [ ] **Step 2: Modify the component**

In `frontend_src/modules/account/components/LoginForm/index.tsx`:

1. Add imports:

```tsx
import { TurnstileWidget } from "../../../shared/components/Form/TurnstileWidget.tsx";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
```

2. Extend the schema:

```tsx
const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "The password must contain at least 8 characters" }),
  cf_turnstile_response: z
    .string()
    .min(1, { message: "Please complete the anti-spam check" }),
});
```

3. Inside the component, add the ref (before the mutation), extend the mutation with `onError` (a wrong password is the common case here — the widget must reset so the user can retry), and extend `useForm`:

```tsx
  const turnstileRef = React.useRef<TurnstileInstance>(null);

  const mutation = useMutation({
    mutationFn: (loginData: ValidationSchema) => {
      return login(loginData);
    },
    onSuccess: (data) => {
      onLoginSuccess(data);

      // invalidate session status query
      queryClient.invalidateQueries({
        queryKey: ["auth", "session", "status"],
      });

      window.scrollTo(0, 0);
    },
    onError: () => {
      turnstileRef.current?.reset();
      setValue("cf_turnstile_response", "");
    },
  });

  const formMethods = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      cf_turnstile_response: "",
    },
  });
  const { control, handleSubmit, setValue, watch } = formMethods;
  const turnstileToken = watch("cf_turnstile_response");
```

4. In the JSX, directly above the `<Button>`:

```tsx
        <TurnstileWidget
          ref={turnstileRef}
          onTokenChange={(token) =>
            setValue("cf_turnstile_response", token, { shouldValidate: true })
          }
        />
```

5. Gate the submit button:

```tsx
          disabled={mutation.isPending || !turnstileToken}
```

- [ ] **Step 3: Run the component tests**

Run: `yarn vitest run frontend_src/modules/account/components/LoginForm/index.test.tsx`
Expected: all existing tests pass

- [ ] **Step 4: Commit**

```bash
git add frontend_src/modules/account/components/LoginForm/
git commit -m "feat: require Turnstile verification on login form"
```

---

### Task 8: Integrate Turnstile into ForgotPasswordForm

**Files:**
- Modify: `frontend_src/modules/account/components/ForgotPasswordForm/index.tsx`
- Modify: `frontend_src/modules/account/components/ForgotPasswordForm/index.test.tsx`

- [ ] **Step 1: Add the Turnstile mock to the test file**

In `index.test.tsx`, directly after the existing imports (add `vi` to the vitest import if it isn't there):

```tsx
vi.mock("@marsidev/react-turnstile", () =>
  import("../../../../test-utils/turnstileMock.tsx"),
);
```

- [ ] **Step 2: Modify the component**

In `frontend_src/modules/account/components/ForgotPasswordForm/index.tsx`:

1. Add imports:

```tsx
import { TurnstileWidget } from "../../../shared/components/Form/TurnstileWidget.tsx";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
```

2. Extend the schema:

```tsx
const formSchema = z.object({
  email: z.string().email(),
  cf_turnstile_response: z
    .string()
    .min(1, { message: "Please complete the anti-spam check" }),
});
```

3. Inside the component, add the ref (before the mutation), extend the mutation with `onError`, and extend `useForm`:

```tsx
  const turnstileRef = React.useRef<TurnstileInstance>(null);

  const mutation = useMutation({
    mutationFn: (data: ValidationSchema) => {
      return requestPasswordReset(data);
    },
    onSuccess: () => {
      setIsDone(true);
      window.scrollTo(0, 0);
    },
    onError: () => {
      turnstileRef.current?.reset();
      setValue("cf_turnstile_response", "");
    },
  });

  const formMethods = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      cf_turnstile_response: "",
    },
  });
```

4. Extend the existing destructuring (it currently sits below the `isDone` early return):

```tsx
  const { control, handleSubmit, setValue, watch } = formMethods;
  const turnstileToken = watch("cf_turnstile_response");
```

(Note: `watch` must be called on every render path. The `isDone` early return happens above this line only AFTER submission succeeds, at which point the form unmounts — that's fine. Keep the destructuring exactly where the current one is.)

5. In the JSX, directly above the `<Button>`:

```tsx
        <TurnstileWidget
          ref={turnstileRef}
          onTokenChange={(token) =>
            setValue("cf_turnstile_response", token, { shouldValidate: true })
          }
        />
```

6. Gate the submit button:

```tsx
          disabled={mutation.isPending || !turnstileToken}
```

- [ ] **Step 3: Run the component tests, then the whole frontend suite**

Run: `yarn vitest run frontend_src/modules/account/components/ForgotPasswordForm/index.test.tsx`
Expected: all existing tests pass

Run: `yarn vitest run`
Expected: full frontend suite green

- [ ] **Step 4: Lint and commit**

```bash
yarn lint
git add frontend_src/modules/account/components/ForgotPasswordForm/
git commit -m "feat: require Turnstile verification on password reset form"
```

---

### Task 9: E2E environment (Docker) and Playwright spec

**Files:**
- Modify: `Dockerfile` (ARG/ENV block around lines 28–33)
- Modify: `docker-compose.yml` (django service)
- Create: `e2e-tests/turnstile.spec.ts`

- [ ] **Step 1: Pass the Turnstile test keys into the docker e2e environment**

In `Dockerfile`, extend the existing Vite build-arg block:

```dockerfile
ARG VITE_ALGOLIA_APP_ID
ARG VITE_ALGOLIA_PUBLIC_API_KEY
ARG VITE_TURNSTILE_SITE_KEY

# Build frontend (Vite embeds VITE_* vars into the JS bundle)
ENV VITE_ALGOLIA_APP_ID=$VITE_ALGOLIA_APP_ID
ENV VITE_ALGOLIA_PUBLIC_API_KEY=$VITE_ALGOLIA_PUBLIC_API_KEY
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY
```

(No default value in the Dockerfile: a baked-in test key silently reaching production would make verification fail for every user once a real secret key is set server-side.)

In `docker-compose.yml`, django service — add build args and runtime env (Cloudflare's always-pass test keys):

```yaml
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_TURNSTILE_SITE_KEY: 1x00000000000000000000AA
```

and in the `environment:` block add:

```yaml
      TURNSTILE_SECRET_KEY: 1x0000000000000000000000000000000AA
```

- [ ] **Step 2: Write the e2e spec**

Create `e2e-tests/turnstile.spec.ts`:

```ts
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
```

- [ ] **Step 3: Run the e2e suite against the docker environment**

```bash
docker compose up -d --build
# wait until http://localhost:8000 responds, then:
yarn playwright test
docker compose down
```

Expected: the new `turnstile.spec.ts` passes, AND the existing `honeypot.spec.ts`, `contact.spec.ts`, and `auth.spec.ts` still pass — their browser flows now also complete the (auto-passing) widget, which verifies the four form integrations end-to-end.

If the docker build is too slow locally, this can be left to CI (`playwright.yml` runs the same compose setup), but note the result honestly either way.

- [ ] **Step 4: Commit**

```bash
git add Dockerfile docker-compose.yml e2e-tests/turnstile.spec.ts
git commit -m "test: add Turnstile e2e coverage and docker test keys"
```

---

### Task 10: Documentation

**Files:**
- Modify: `README.md` (setup section, around the `.env` instructions near line 49)

- [ ] **Step 1: Document the env vars and production setup**

Add to the README's setup/environment section:

```markdown
### Cloudflare Turnstile (anti-spam)

The contact, signup, login and password-reset endpoints require a Cloudflare
Turnstile token. Two environment variables control it:

- `TURNSTILE_SECRET_KEY` — backend secret key, used server-side to verify
  tokens. When unset, verification is disabled.
- `VITE_TURNSTILE_SITE_KEY` — frontend site key, embedded into the JS bundle
  at build time.

For local development use Cloudflare's official test keys (always pass):

    TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
    VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA

For production, create a widget at <https://dash.cloudflare.com> → Turnstile
(mode: **Managed**, hostname: the production domain) and set both keys in the
deployment environment. The site key must be present when the frontend is
built; the secret key is read at runtime.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: document Cloudflare Turnstile configuration"
```

---

### Task 11: Final verification

- [ ] **Step 1: Full backend suite**

Run: `uv run python manage.py test`
Expected: OK

- [ ] **Step 2: Full frontend suite + lint**

Run: `yarn vitest run && yarn lint`
Expected: green, no lint errors

- [ ] **Step 3: Confirm production deploy checklist is communicated**

The deployment environment (wherever the production image is built) must set:
- `VITE_TURNSTILE_SITE_KEY` as a build arg/env at frontend build time
- `TURNSTILE_SECRET_KEY` as a runtime env var

Until those are set, production behavior is unchanged (middleware inert, widget hidden) — the rollout is safe but inactive. Surface this to the user at the end of implementation.
