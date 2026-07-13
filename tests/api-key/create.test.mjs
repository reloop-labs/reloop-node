import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import {
	apiKeyWithKeyFixture,
	assertAuthAndJson,
	createClient,
	errorJsonResponse,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
} from "./_helpers.mjs";

afterEach(() => {
	mock.restoreAll();
});

test("create: POST /api/api-key/v1/ with name body", async () => {
	const payload = apiKeyWithKeyFixture({ name: "Production Key" });
	const fetchMock = mockFetch(jsonResponse(payload, 201, "Created"));

	const { response, error } = await createClient().apiKey.create({
		name: "Production Key",
	});

	assert.equal(error, null);
	assert.deepEqual(response, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/api-key/v1/");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), { name: "Production Key" });
});

test("create: returns ReloopApiError on non-OK without throwing", async () => {
	mockFetch(
		errorJsonResponse(
			{ message: "Forbidden", why: "Insufficient permissions" },
			403,
			"Forbidden",
		),
	);

	const { response, error } = await createClient().apiKey.create({
		name: "Blocked Key",
	});

	assert.equal(response, null);
	assert.ok(error);
	assert.equal(error.name, "ReloopApiError");
	assert.equal(error.status, 403);
	assert.equal(error.message, "Forbidden");
	assert.equal(error.body.why, "Insufficient permissions");
});

test("create: uses custom baseUrl", async () => {
	const fetchMock = mockFetch(jsonResponse(apiKeyWithKeyFixture(), 201));

	await createClient({ baseUrl: "https://api.example.test" }).apiKey.create({
		name: "Custom Host Key",
	});

	assert.equal(
		getCall(fetchMock).url,
		"https://api.example.test/api/api-key/v1/",
	);
});
