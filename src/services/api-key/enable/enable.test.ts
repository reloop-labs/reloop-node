import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
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
} from "@/services/api-key/test-helpers";

afterEach(() => {
	mock.restore();
});

test("enable: POST /api/api-key/v1/enable/:id", async () => {
	const payload = apiKeyFixture({ enabled: true, event: "evt_enable" });
	const fetchMock = mockFetch(jsonResponse(payload));

	const { apiKey, apiKeyError } = await createClient().apiKey.enable(KEY_ID);

	assert.equal(apiKeyError, null);
	assert.deepEqual(apiKey, payload);
	assert.equal(apiKey?.enabled, true);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/api-key/v1/enable/${KEY_ID}`);
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.equal(call.body, undefined);
});

test("enable: returns apiKeyError on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "Failed to enable API key" }, 500, "Error"),
	);

	const { apiKey, apiKeyError } = await createClient().apiKey.enable(KEY_ID);

	assert.equal(apiKey, null);
	assert.equal(apiKeyError?.status, 500);
	assert.equal(apiKeyError?.message, "Failed to enable API key");
});

test("enable: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.enable(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
