# Contributing to the Reloop Node.js SDK

Official npm package: **`reloop-email`**. This SDK is the **reference implementation** for the Reloop API — implement new endpoints here first, then port to other languages.

**License:** [Apache License 2.0](./LICENSE) with additional use restrictions from Reloop Labs.

**API reference:** [reloop.sh/docs](https://reloop.sh/docs)

---

## Development setup

```bash
git clone git@github.com:reloop-labs/reloop-node.git
cd reloop-node
npm install
npm test
npm run build
```

Requires **Node.js 20+** (CI uses Node 22).

---

## Project layout

```
src/
  client.ts              # HTTP client
  core/                  # Result types, shared types
  services/
    mail/                # POST /api/mail/v1/send
    domain/              # Domain routes (snake_case bodies)
    api-key/
    contacts/
    webhook/
tests/                   # node:test route tests (*.test.mjs)
dist/                    # Build output (tsup)
```

---

## Conventions

| Topic | Rule |
|-------|------|
| HTTP errors | Return `{ response, error }` — do **not** throw for API/network failures |
| Mail & domain requests | **snake_case** JSON (`reply_to`, `click_tracking`) |
| Contacts & API keys | camelCase in JSON (handled by the client layer) |
| Types | Add request/response interfaces in each service’s `types.ts` |
| Exports | Export services and types from `src/index.ts` |
| Tests | Mock `fetch`; assert URL path, method, and JSON body |
| README | Keep minimal: prerequisites (API key + verified domain), send example, link to docs |

### Example: adding a route test

```javascript
import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { Reloop } from "../dist/index.js";

test("send posts to /api/mail/v1/send", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () =>
    Response.json({ success: true, messageId: "msg_1", status: "sent", timestamp: "...", id: "log_1" }),
  );

  const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
  await reloop.mail.send({ from: "a@b.com", to: "c@d.com", subject: "Hi" });

  assert.equal(fetchMock.mock.calls[0]?.arguments[0], "https://reloop.sh/api/mail/v1/send");
});
```

Run tests: `npm test`

---

## Pull request checklist

- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] New routes have tests under `tests/`
- [ ] Types match the OpenAPI spec at [reloop.sh/docs](https://reloop.sh/docs)
- [ ] No API keys or secrets committed
- [ ] Bump `package.json` version **only** when cutting a release (maintainers)

---

## Releasing

Version lives in **`package.json`** and **`package-lock.json`** (currently aligned with other Reloop SDKs).

### 1. Bump version (SemVer)

```bash
# Edit package.json → "version": "1.9.0"
npm install   # refreshes package-lock.json
git add package.json package-lock.json
git commit -m "chore: release v1.9.0"
git push origin main
```

### 2. Tag and push

Tag must match the manifest: `v` + version.

```bash
git tag v1.9.0
git push origin v1.9.0
```

### 3. GitHub Release (automatic)

Pushing `v*` runs [`.github/workflows/release.yml`](./.github/workflows/release.yml), which:

1. Verifies the tag matches `package.json`
2. Runs `npm test` and `npm run build`
3. Runs `npm pack`
4. Creates a GitHub Release with:
   - `reloop-node-{version}-source.zip`
   - `reloop-email-{version}.tgz`

You can also run the workflow manually: **Actions → Release → Run workflow**.

### 4. Publish to npm (optional)

Registry publish uses [`.github/workflows/sdk-node-publish.yml`](./.github/workflows/sdk-node-publish.yml) or:

```bash
npm publish --provenance
```

Requires `NPM_TOKEN` (or OIDC) in repository secrets.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Tag ≠ `package.json` version | Align both, then recreate the tag |
| `npm ci` fails in CI | Commit an updated `package-lock.json` |
| Release already exists | Bump patch version (e.g. `1.8.1`) and tag again |
