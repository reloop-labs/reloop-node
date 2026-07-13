import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { ReloopValidationError } from "reloop-email";
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
} from "#src/services/api-key/test-helpers";

afterEach(() => {
	mock.restoreAll();
});

test("enable: POST /api/api-key/v1/enable/:id", async () => {
	const payload = apiKeyFixture({ enabled: true, event: "evt_enable" });
	const fetchMock = mockFetch(jsonResponse(payload));

	const { response, error } = await createClient().apiKey.enable(KEY_ID);

	assert.equal(error, null);
	assert.deepEqual(response, payload);
	assert.equal(response?.enabled, true);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/api-key/v1/enable/${KEY_ID}`);
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.equal(call.body, undefined);
});

test("enable: returns error on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "Failed to enable API key" }, 500, "Error"),
	);

	const { response, error } = await createClient().apiKey.enable(KEY_ID);

	assert.equal(response, null);
	assert.equal(error?.status, 500);
	assert.equal(error?.message, "Failed to enable API key");
});

test("enable: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.enable(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
