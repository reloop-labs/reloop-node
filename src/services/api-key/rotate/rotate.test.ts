import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { ReloopValidationError } from "../../../../dist/index.js";
import {
	apiKeyWithKeyFixture,
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	errorJsonResponse,
	getCall,
	jsonResponse,
	KEY_ID,
	mockFetch,
} from "../test-helpers.ts";

afterEach(() => {
	mock.restoreAll();
});

// --- wire ---

test("rotate: POST /api/api-key/v1/rotate/:id and returns new secret", async () => {
	const payload = apiKeyWithKeyFixture({
		key: "rl_live_rotated_secret",
		event: "evt_rotate",
	});
	const fetchMock = mockFetch(jsonResponse(payload));

	const { response, error } = await createClient().apiKey.rotate(KEY_ID);

	assert.equal(error, null);
	assert.deepEqual(response, payload);
	assert.equal(response?.key, "rl_live_rotated_secret");

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/api-key/v1/rotate/${KEY_ID}`);
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.equal(call.body, undefined);
});

test("rotate: returns error on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "Failed to rotate API key" }, 500, "Error"),
	);

	const { response, error } = await createClient().apiKey.rotate(KEY_ID);

	assert.equal(response, null);
	assert.equal(error?.status, 500);
	assert.equal(error?.message, "Failed to rotate API key");
});

// --- validation (no fetch) ---

test("rotate: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.rotate(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
