import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { ReloopValidationError } from "../../dist/index.js";
import {
	apiKeyWithKeyFixture,
	assertAuthAndJson,
	assertNoFetch,
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

// --- wire ---

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

test("create: trims name before sending", async () => {
	const fetchMock = mockFetch(jsonResponse(apiKeyWithKeyFixture({ name: "Trimmed" }), 201));

	await createClient().apiKey.create({ name: "  Trimmed  " });

	assert.deepEqual(parseBody(getCall(fetchMock).body), { name: "Trimmed" });
});

// --- validation (no fetch) ---

test("create: empty name throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.create({ name: "" }),
		(err) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.equal(err.field, "name");
			return true;
		},
	);
	assertNoFetch(fetchMock);
});

test("create: whitespace-only name throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.create({ name: "   " }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("create: missing params throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.create(),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("create: name longer than 255 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.create({ name: "x".repeat(256) }),
		(err) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.match(err.message, /255/);
			return true;
		},
	);
	assertNoFetch(fetchMock);
});
