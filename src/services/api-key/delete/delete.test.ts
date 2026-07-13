import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { ReloopValidationError } from "reloop-email";
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
} from "#src/services/api-key/test-helpers";

afterEach(() => {
	mock.restoreAll();
});

test("delete: DELETE /api/api-key/v1/:id", async () => {
	const payload = deleteResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { response, error } = await createClient().apiKey.delete(KEY_ID);

	assert.equal(error, null);
	assert.deepEqual(response, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/api-key/v1/${KEY_ID}`);
	assert.equal(call.method, "DELETE");
	assertAuthAndJson(call.headers);
	assert.equal(call.body, undefined);
});

test("delete: returns error on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "API key not found" }, 404, "Not Found"),
	);

	const { response, error } = await createClient().apiKey.delete("key_missing");

	assert.equal(response, null);
	assert.equal(error?.status, 404);
	assert.equal(error?.message, "API key not found");
});

test("delete: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.delete(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
