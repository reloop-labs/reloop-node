import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
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
} from "@/services/api-key/test-helpers";

afterEach(() => {
	mock.restore();
});

test("rotate: POST /api/api-key/v1/rotate/:id and returns new secret", async () => {
	const payload = apiKeyWithKeyFixture({
		key: "rl_live_rotated_secret",
		event: "evt_rotate",
	});
	const fetchMock = mockFetch(jsonResponse(payload));

	const { apiKey, apiKeyError } = await createClient().apiKey.rotate(KEY_ID);

	assert.equal(apiKeyError, null);
	assert.deepEqual(apiKey, payload);
	assert.equal(apiKey?.key, "rl_live_rotated_secret");

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/api-key/v1/rotate/${KEY_ID}`);
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.equal(call.body, undefined);
});

test("rotate: returns apiKeyError on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "Failed to rotate API key" }, 500, "Error"),
	);

	const { apiKey, apiKeyError } = await createClient().apiKey.rotate(KEY_ID);

	assert.equal(apiKey, null);
	assert.equal(apiKeyError?.status, 500);
	assert.equal(apiKeyError?.message, "Failed to rotate API key");
});

test("rotate: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.rotate(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
