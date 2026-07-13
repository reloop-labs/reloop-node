import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import {
	apiKeyFixture,
	assertAuthAndJson,
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

test("disable: POST /api/api-key/v1/disable/:id", async () => {
	const payload = apiKeyFixture({ enabled: false, event: "evt_disable" });
	const fetchMock = mockFetch(jsonResponse(payload));

	const { response, error } = await createClient().apiKey.disable(KEY_ID);

	assert.equal(error, null);
	assert.deepEqual(response, payload);
	assert.equal(response?.enabled, false);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/api-key/v1/disable/${KEY_ID}`);
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.equal(call.body, undefined);
});

test("disable: returns error on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "Failed to disable API key" }, 500, "Error"),
	);

	const { response, error } = await createClient().apiKey.disable(KEY_ID);

	assert.equal(response, null);
	assert.equal(error?.status, 500);
	assert.equal(error?.message, "Failed to disable API key");
});
