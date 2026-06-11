# Cloudflare Turnstile Spam Protection — Design

**Date:** 2026-06-11
**Status:** Approved

## Problem

The site receives high volumes of spam contact messages and spam signups. An
existing honeypot (`psychomodels/honeypot_middleware.py`, hidden `phone_number`
field) is not stopping the spam. We will add Cloudflare Turnstile verification
on top of the honeypot.

## Decisions made

| Decision | Choice |
|---|---|
| Protected endpoints | Contact, signup, login, password-reset request |
| Widget mode | Managed (configured in Cloudflare dashboard) |
| Backend approach | Dedicated middleware, mirroring the honeypot middleware |
| Honeypot | Kept as-is (defense in depth) |
| siteverify outage behavior | Fail-open: allow the request, log an error |
| Token field name | `cf_turnstile_response` (request body) |

## Architecture

```
Browser form (React)                        Django
┌──────────────────────┐   POST body incl.  ┌─────────────────────────────┐
│ TurnstileWidget      │   cf_turnstile_    │ JsonHoneypotMiddleware      │
│ (managed challenge)  │──response token──▶ │ TurnstileMiddleware  ◀─ new │
│ token → form field   │                    │   └─ siteverify API call    │
└──────────────────────┘                    │ ... rest of stack / view    │
                                            └─────────────────────────────┘
```

## Backend: `TurnstileMiddleware`

New file `psychomodels/turnstile_middleware.py`, registered in `MIDDLEWARE`
immediately after `psychomodels.honeypot_middleware.JsonHoneypotMiddleware`.

Behavior for POST requests whose path is in the protected list:

1. Parse the request body (JSON or form-encoded, same approach as the honeypot
   middleware) and extract `cf_turnstile_response`.
2. Missing or empty token → reject.
3. Verify the token via `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`
   with `secret`, `response`, and `remoteip` (client IP), using `urllib3`
   (already a direct dependency — no new backend dependency) with a 5-second
   timeout.
4. `success: false` from Cloudflare → reject, logging Cloudflare's
   `error-codes`.
5. Network error or timeout reaching siteverify → **fail-open**: allow the
   request and log an error. Rationale: a Cloudflare outage must not take down
   login/signup; the honeypot remains as a backstop.

Rejections return HTTP 400 with the existing honeypot error shape:

```json
{"errors": [{"code": "spam", "message": "Invalid request."}]}
```

and log a warning containing client IP, path, and rejection reason.

Protected paths come from a settings list:

```python
TURNSTILE_PROTECTED_PATHS = [
    "/api/contact/",
    "/_allauth/browser/v1/auth/signup",
    "/_allauth/browser/v1/auth/login",
    "/_allauth/browser/v1/auth/password/request",
]
```

If `TURNSTILE_SECRET_KEY` is unset/empty, the middleware is inert and a
warning is logged at startup. Normal local development instead uses
Cloudflare's official always-pass test keys so the real code path stays
exercised.

Notes:

- Turnstile tokens are single-use and expire after 300 seconds; verification
  happens exactly once per request, in this middleware.
- The extra `cf_turnstile_response` body field is ignored by downstream
  consumers — the existing honeypot `phone_number` field already demonstrates
  that allauth headless and the contact serializer tolerate extra fields.
- Social OAuth flows (GitHub, Google, ORCID) do not pass through these paths
  and are unaffected.

## Frontend

- New dependency: `@marsidev/react-turnstile` (React 18 compatible wrapper).
- New shared component `TurnstileWidget` (placed consistently with existing
  shared component structure) wrapping the library widget:
  - Site key from `import.meta.env.VITE_TURNSTILE_SITE_KEY`.
  - `onSuccess(token)` → writes token into the host form's
    `cf_turnstile_response` field via react-hook-form `setValue`.
  - `onExpire`/`onError` → clears the field.
  - Exposes a reset handle so forms can force a fresh token after a failed
    submission (tokens are single-use).
- Integrated into four forms, rendered above the submit button:
  - `frontend_src/modules/contact-form/components/ContactForm/index.tsx`
  - `frontend_src/modules/account/components/SignupForm/index.tsx`
  - `frontend_src/modules/account/components/LoginForm/index.tsx`
  - `frontend_src/modules/account/components/ForgotPasswordForm/index.tsx`
- Each form's Zod schema gains a required non-empty `cf_turnstile_response`
  string, so submission is blocked until the challenge completes. The token is
  sent in the existing POST body (axios for contact, `lib/allauth.ts` helpers
  for the auth endpoints).
- On any failed submission (4xx/5xx), the form resets the widget to obtain a
  fresh token before retry.

## Configuration

`.env` additions (following existing conventions):

```
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA   # dev: always-pass test secret
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA           # dev: always-pass test site key
```

`settings.py` reads `TURNSTILE_SECRET_KEY` via `os.getenv` and defines
`TURNSTILE_PROTECTED_PATHS` and `TURNSTILE_VERIFY_URL`.

### Production setup (manual, Cloudflare dashboard)

1. Create a Turnstile widget at dash.cloudflare.com → Turnstile.
2. Mode: **Managed**. Hostnames: the production domain(s).
3. Set the real `TURNSTILE_SECRET_KEY` and `VITE_TURNSTILE_SITE_KEY` in the
   deployment environment (site key is needed at frontend build time).

## Testing

**Django unit tests** (mocked siteverify HTTP call):

- Valid token → request passes through.
- `success: false` → 400 with spam error shape.
- Missing/empty token → 400.
- siteverify timeout/network error → request passes (fail-open) and error
  logged.
- Non-protected path / non-POST → middleware does not interfere.
- Empty `TURNSTILE_SECRET_KEY` → middleware inert.

**Playwright e2e** (new `e2e-tests/turnstile.spec.ts`, mirroring
`honeypot.spec.ts`, running against the always-pass test keys):

- Contact form and signup form submit successfully with the widget token.
- Direct API POST without `cf_turnstile_response` → 400 spam error, for all
  four protected endpoints.

## Out of scope

- Rate limiting / IP blocking.
- Turnstile on other endpoints (the settings list makes later additions a
  one-line change).
- Removing the honeypot.
