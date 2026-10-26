# Local dependency security remediation — 26 October 2026

The working tree on `NNNvD-patch-1`, based on commit `ee1d953c41aae89e2cfc32b29d9099ca008ed50f`, contains local dependency security changes. No commit, push, PR, merge, release, deployment or alert dismissal was performed. The branch history was preserved, including its existing divergence from main.

All 122 original critical/high alert IDs were reconciled with the live open-alert API. Every locked copy for 121 rows is now outside its registered affected range: all 8 critical rows and 113 high rows. Alert **#308 remains unresolved**. These are branch findings; the GitHub alerts retain their last verified open state and production has not changed. The adjacent CSV records every original alert, all current locked versions and local verification separately.

The review gate for the remaining image, authentication and Zod changes was completed in this chat after explicit user authorization. The changes from the earlier local maintenance pass were preserved.

| Remaining unit | Local result |
| --- | --- |
| B1-image — 38 rows | Pillow 12.2.0 → 13.0.0; direct minimum raised. MarkdownX JPEG, RGB/RGBA/16-bit PNG and GIF behavior verified, with invalid-data and resource/type/byte-limit rejection tests. |
| B1-auth — 9 rows | PyJWT 2.11.0 → 2.15.1; cryptography 46.0.5 → 50.0.2. Local allauth certificate/JWKS verification, invalid claims/signatures, public-key/HMAC confusion, empty JWK keys and redirect rejection tested. Installed cryptography reports OpenSSL 4.0.3. |
| B3-zod — 1 row | Zod 3.23.8 → 4.6.7, resolver 3.9.0 → 5.9.2 and React Hook Form 7.53.0 → 7.55.0. No Zod 3 package remains in the lock. |
| B5-review — 1 row | http-cache-semantics 4.2.0 retained; no verified upstream fix for #308. Evidence and follow-up are below. |

Zod 4 needs a compatible resolver. Its stronger types exposed a variable-form submit handler that incorrectly required both alternative schemas' fields. The handler now accepts the validated union and chooses the matching output shape. Both submission alternatives have regression coverage. The previous “Invalid email” text is explicit in signup, login and password-reset-request forms. Other existing validation tests pass. The Zod 4 collection preflight is exercised through the actual form resolver, ensuring an oversized bounded collection does not parse each element.

The exact old `@tanstack/router-generator@1.56.4` pin retained Zod 3. Repository scripts, config and source contain no generator use; both route trees are defined in code. It was removed. `@tanstack/react-router@1.56.5` misspells its optional-peer metadata as `@tanstack/react-generator`. A version-specific `.yarnrc.yml` package extension marks the real generator peer optional. This changes metadata only, avoids a router framework upgrade, and does not force Zod 4 into a Zod 3 consumer.

Two additional audit findings outside the original open-alert set were patched: certifi 2026.1.4 → 2026.10.23 and MSW's path-to-regexp 6.2.2 → 6.3.0. The certifi SSL trust store loads successfully. GitHub returned HTTP 410 for old repository alert #328, while the public certifi advisory remains active; the newer trusted bundle is installed regardless of that repository-alert state. The registered 122 IDs themselves exactly match the current live critical/high set.

Validation performed on Windows x64 with Python 3.12.10, Node 24.18.1 and Yarn 4.12.0:

- Frozen development installation and a separate `uv sync --frozen --no-dev` environment passed. The latter contains the patched runtime versions and excludes Black.
- All **67 Django tests passed**, including 11 new image/JWT regressions. Tests use a disposable SQLite database and `ALGOLIA_AUTO_INDEXING=False`. The previous 23 errors came from unconfigured outbound indexing; the existing environment switch removes those network calls without changing production settings.
- Immutable Yarn install, lint, TypeScript and all **129 Vitest tests passed** across 33 files. The variable-form toggle test now awaits its assertions, and two submission regressions were added.
- Vite production assets and Tailwind CSS built successfully. This checkout hard-codes `.venv/bin/python`; on Windows a temporary config copy used `.venv/Scripts/python.exe` and was removed afterward. The tracked Vite config is unchanged. Rollup emitted two non-fatal annotation warnings from Zod comments.
- Black reported all 107 Python files unchanged. The migration plan was inspected only against the disposable database.
- `makemigrations --check --dry-run` reports two DOI-validator alterations. An isolated environment made from the original HEAD manifests and lock, using Django 6.0.6, reports the same drift. This is a pre-existing consistency failure; no migration was generated or applied by this change.

Linux x86_64/aarch64 Python 3.12 wheel metadata is present for Pillow 13 and cryptography 50. Windows frozen installs passed; Linux/container and Mac installs were not executed. Cryptography 49 removed Intel Mac and 32-bit Windows wheel support. Existing Intel Mac users need a separately reviewed supported-platform/toolchain path; do not assume this branch was validated there. Real Google/GitHub/ORCID login flows and production settings were not exercised. Playwright browser binaries and Docker were unavailable locally, so browser e2e and visual review remain pending.

The final all-dependency audits have no critical matches. Yarn reports one high (#308), 20 moderate and 5 low advisories. The Python audit has six unique medium advisory matches in idna, multidict, oauthlib, python-dotenv, requests and tablib (11 raw duplicate records). Medium/low cleanup and Node/CI/Docker maintenance remain follow-up work. This report does not claim a clean audit across all severities.

For #308 (`GHSA-ch52-4w7c-c8xp`), the path is optional Darwin fsevents → node-gyp → make-fetch-happen → http-cache-semantics under Playwright, Tailwind and Vite/Rollup. No application shared Node response cache was found; Django uses LocMemCache. The upstream maintainer disputes the report and closed the issue as not planned; the GitHub advisory still lists no patched version. The published 4.2.0 and 4.3.0 `evaluateRequest` and `maxAge` function bodies have identical hashes, recorded in the evidence JSON. Version 4.3.0 changes other behavior, so moving outside the advisory's version range would not establish a fix for this claim. Keep the finding visible and track the upstream advisory review. Any eventual exception/dismissal requires a human maintainer's explicit decision.

References: [Pillow 13 release notes](https://pillow.readthedocs.io/en/stable/releasenotes/13.0.0.html), [PyJWT 2.15.1 changelog](https://github.com/jpadilla/pyjwt/blob/2.15.1/CHANGELOG.rst), [cryptography 50.0.2 changelog](https://github.com/pyca/cryptography/blob/50.0.2/CHANGELOG.rst), [Zod migration guide](https://zod.dev/v4/changelog), [Zod advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), [certifi advisory](https://github.com/advisories/GHSA-6q48-6c7w-9gw2), [path-to-regexp advisory](https://github.com/advisories/GHSA-9wv6-86v2-598j), [cache advisory](https://github.com/advisories/GHSA-ch52-4w7c-c8xp), [upstream cache issue](https://github.com/kornelski/http-cache-semantics/issues/56), [advisory review request](https://github.com/github/advisory-database/issues/10139).
