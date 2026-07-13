import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { ReloopValidationError } from "../../../../dist/index.js";
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
	parseBody,
} from "../test-helpers.ts";

afterEach(() => {
	mock.restoreAll();
});

// --- wire ---

test("update: PATCH /api/api-key/v1/:id with name body", async () => {
	const payload = apiKeyFixture({ name: "Updated Key Name" });
	const fetchMock = mockFetch(jsonResponse(payload));

	const { response, error } = await createClient().apiKey.update(KEY_ID, {
		name: "Updated Key Name",
	});

	assert.equal(error, null);
	assert.deepEqual(response, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/api-key/v1/${KEY_ID}`);
	assert.equal(call.method, "PATCH");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), { name: "Updated Key Name" });
});

test("update: returns error on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "API key not found" }, 404, "Not Found"),
	);

	const { response, error } = await createClient().apiKey.update(
		"key_missing",
		{ name: "Nope" },
	);

	assert.equal(response, null);
	assert.equal(error?.status, 404);
	assert.equal(error?.message, "API key not found");
});

// --- validation (no fetch) ---

test("update: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.update("  ", { name: "ok" }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("update: empty name throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.update("key_1", { name: "" }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
