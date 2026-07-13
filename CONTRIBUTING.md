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
  index.ts               # Public entry: Reloop + selected types
  client.ts              # HTTP transport (internal)
  core/                  # Result types, client options
  services/
    api-key/
      create.ts          # validate + HTTP
      create.test.ts     # wire + validation (paired)
      list.ts + list.test.ts
      ...
      api-key.ts + api-key.test.ts
      test-helpers.ts    # fixtures (tests only)
    mail/
    domain/
    contacts/
    webhook/
tests/                   # cross-cutting package tests
  init.test.mjs
  exports.test.mjs
  mail.test.mjs
  domain.test.mjs
dist/
```

---

## Conventions

| Topic | Rule |
|-------|------|
| Init | `new Reloop({ apiKey, baseUrl? })` — `apiKey` required; no `key` / `url` aliases |
| HTTP errors | Return `{ response, error }` — do **not** throw for API/network failures |
| Input validation | Throw `ReloopValidationError` before fetch (no network). Rules match backend (name 1–255, page ≥ 1, limit 1–100, non-empty ids) |
| Api-key layout | **Colocate** `create.ts` + `create.test.ts`. Validation lives in the op file; tests cover wire + validation. Shared field helpers in `fields.ts`; thin `api-key.ts` facade |
| Mail & domain requests | **snake_case** JSON (`reply_to`, `click_tracking`) |
| Contacts & API keys | camelCase in JSON bodies as the API expects |
| API key methods | 1:1 with backend: create, list, get, update, delete, rotate, enable, disable (no `pause`) |
| Types | Request/response interfaces in each service’s `types.ts` |
| Public exports | `Reloop` (+ default), options, Result/error types, api-key **types**, other resource modules as today. Do **not** export constructable `ReloopClient` or `ApiKeyService` |
| Tests | Prefer `foo.ts` + `foo.test.ts` next to source. Mock `fetch`; assert path, method, headers, body, success + error Result |
| README | Prerequisites, strict init, send example, api-key table, link to docs |

### Example: paired create test

```typescript
// src/services/api-key/create.test.ts  (next to create.ts)
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
} from "./test-helpers.ts";

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
- [ ] New routes have colocated `*.test.ts` (or tests under `tests/`)
- [ ] Types match the OpenAPI spec at [reloop.sh/docs](https://reloop.sh/docs)
- [ ] No API keys or secrets committed
- [ ] Public export surface unchanged unless intentional (see Conventions)
- [ ] Bump `package.json` version **only** when cutting a release (maintainers)

---

## Releasing

Version lives in **`package.json`** and **`package-lock.json`**.

### 1. Bump version (SemVer)

```bash
# Edit package.json → "version": "2.0.1"
npm install   # refreshes package-lock.json
git add package.json package-lock.json
git commit -m "chore: release v2.0.1"
git push origin main
```

### 2. Tag and push

Tag must match the manifest: `v` + version.

```bash
git tag v2.0.1
git push origin v2.0.1
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
| Release already exists | Bump patch version (e.g. `2.0.1`) and tag again |
