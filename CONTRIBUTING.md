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
tests/
  init.test.mjs          # client construction
  mail.test.mjs
  domain.test.mjs
  api-key/               # one file per endpoint
    _helpers.mjs
    create.test.mjs
    list.test.mjs
    get.test.mjs
    ...
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
| Tests | Mock `fetch`; assert path, method, headers, body, success + error Result |
| API key tests | One `tests/api-key/<endpoint>.test.mjs` per route; share fixtures in `_helpers.mjs` |
| README | Keep minimal: prerequisites (API key + verified domain), send example, link to docs |

### Example: adding an API key endpoint test

```javascript
// tests/api-key/create.test.mjs
import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import {
  apiKeyWithKeyFixture,
  assertAuthAndJson,
  createClient,
  getCall,
  jsonResponse,
  mockFetch,
  parseBody,
} from "./_helpers.mjs";

afterEach(() => mock.restoreAll());

test("create: POST /api/api-key/v1/ with name body", async () => {
  const payload = apiKeyWithKeyFixture();
  const fetchMock = mockFetch(jsonResponse(payload, 201));

  const { response, error } = await createClient().apiKey.create({ name: "Production Key" });

  assert.equal(error, null);
  assert.deepEqual(response, payload);
  const call = getCall(fetchMock);
  assert.equal(call.url, "https://reloop.sh/api/api-key/v1/");
  assert.equal(call.method, "POST");
  assertAuthAndJson(call.headers);
  assert.deepEqual(parseBody(call.body), { name: "Production Key" });
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
