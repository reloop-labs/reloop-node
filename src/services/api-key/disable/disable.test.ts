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

test("disable: POST /api/api-key/v1/disable/:id", async () => {
	const payload = apiKeyFixture({ enabled: false, event: "evt_disable" });
	const fetchMock = mockFetch(jsonResponse(payload));

	const { apiKey, apiKeyError } = await createClient().apiKey.disable(KEY_ID);

	assert.equal(apiKeyError, null);
	assert.deepEqual(apiKey, payload);
	assert.equal(apiKey?.enabled, false);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/api-key/v1/disable/${KEY_ID}`);
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.equal(call.body, undefined);
});

test("disable: returns apiKeyError on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "Failed to disable API key" }, 500, "Error"),
	);

	const { apiKey, apiKeyError } = await createClient().apiKey.disable(KEY_ID);

	assert.equal(apiKey, null);
	assert.equal(apiKeyError?.status, 500);
	assert.equal(apiKeyError?.message, "Failed to disable API key");
});

test("disable: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.disable(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
