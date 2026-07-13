import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { ReloopValidationError } from "../../dist/index.js";
import {
	apiKeyFixture,
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	errorJsonResponse,
	getCall,
	jsonResponse,
	KEY_ID,
	mockFetch,
} from "./_helpers.mjs";

afterEach(() => {
	mock.restoreAll();
});

// --- wire ---

test("get: GET /api/api-key/v1/:id", async () => {
	const payload = apiKeyFixture({
		createdBy: {
			id: "user_1",
			name: "Ada",
			image: null,
			email: "ada@example.com",
		},
	});
	const fetchMock = mockFetch(jsonResponse(payload));

	const { response, error } = await createClient().apiKey.get(KEY_ID);

	assert.equal(error, null);
	assert.deepEqual(response, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/api-key/v1/${KEY_ID}`);
	assert.equal(call.method, "GET");
	assertAuthAndJson(call.headers);
	assert.equal(call.body, undefined);
});

test("get: encodes id in path", async () => {
	const id = "key_with-special.chars";
	const fetchMock = mockFetch(jsonResponse(apiKeyFixture({ id })));

	await createClient().apiKey.get(id);

	assert.equal(getCall(fetchMock).url, `https://reloop.sh/api/api-key/v1/${id}`);
});

test("get: returns error on 404", async () => {
	mockFetch(
		errorJsonResponse({ message: "API key not found" }, 404, "Not Found"),
	);

	const { response, error } = await createClient().apiKey.get("key_missing");

	assert.equal(response, null);
	assert.equal(error?.status, 404);
	assert.equal(error?.message, "API key not found");
});

// --- validation (no fetch) ---

test("get: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.get(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("get: non-string id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.get(null),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
