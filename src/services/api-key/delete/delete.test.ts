import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	deleteResponseFixture,
	errorJsonResponse,
	getCall,
	jsonResponse,
	KEY_ID,
	mockFetch,
} from "@/services/api-key/test-helpers";

afterEach(() => {
	mock.restore();
});

test("delete: DELETE /api/api-key/v1/:id", async () => {
	const payload = deleteResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { apiKey, apiKeyError } = await createClient().apiKey.delete(KEY_ID);

	assert.equal(apiKeyError, null);
	assert.deepEqual(apiKey, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/api-key/v1/${KEY_ID}`);
	assert.equal(call.method, "DELETE");
	assertAuthAndJson(call.headers);
	assert.equal(call.body, undefined);
});

test("delete: returns apiKeyError on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "API key not found" }, 404, "Not Found"),
	);

	const { apiKey, apiKeyError } = await createClient().apiKey.delete("key_missing");

	assert.equal(apiKey, null);
	assert.equal(apiKeyError?.status, 404);
	assert.equal(apiKeyError?.message, "API key not found");
});

test("delete: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.delete(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
