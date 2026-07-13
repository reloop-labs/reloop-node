import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { ReloopValidationError } from "../../../dist/index.js";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	errorJsonResponse,
	getCall,
	jsonResponse,
	listResponseFixture,
	mockFetch,
} from "./test-helpers.ts";

afterEach(() => {
	mock.restoreAll();
});

// --- wire ---

test("list: GET /api/api-key/v1/ with no query", async () => {
	const payload = listResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { response, error } = await createClient().apiKey.list();

	assert.equal(error, null);
	assert.deepEqual(response, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/api-key/v1/");
	assert.equal(call.method, "GET");
	assertAuthAndJson(call.headers);
	assert.equal(call.body, undefined);
});

test("list: builds full query string from params", async () => {
	const fetchMock = mockFetch(
		jsonResponse(listResponseFixture({ page: 2, limit: 5 })),
	);

	const { error } = await createClient().apiKey.list({
		page: 2,
		limit: 5,
		enabled: true,
		userId: "user_abc",
		q: "prod",
	});

	assert.equal(error, null);
	const { url } = getCall(fetchMock);
	const parsed = new URL(url);
	assert.equal(
		parsed.origin + parsed.pathname,
		"https://reloop.sh/api/api-key/v1/",
	);
	assert.equal(parsed.searchParams.get("page"), "2");
	assert.equal(parsed.searchParams.get("limit"), "5");
	assert.equal(parsed.searchParams.get("enabled"), "true");
	assert.equal(parsed.searchParams.get("userId"), "user_abc");
	assert.equal(parsed.searchParams.get("q"), "prod");
});

test("list: enabled=false is encoded as false", async () => {
	const fetchMock = mockFetch(jsonResponse(listResponseFixture()));

	await createClient().apiKey.list({ enabled: false });

	const { url } = getCall(fetchMock);
	assert.equal(new URL(url).searchParams.get("enabled"), "false");
});

test("list: omits undefined optional filters", async () => {
	const fetchMock = mockFetch(jsonResponse(listResponseFixture()));

	await createClient().apiKey.list({ page: 1 });

	const { url } = getCall(fetchMock);
	const params = new URL(url).searchParams;
	assert.equal(params.get("page"), "1");
	assert.equal(params.has("limit"), false);
	assert.equal(params.has("enabled"), false);
	assert.equal(params.has("userId"), false);
	assert.equal(params.has("q"), false);
});

test("list: returns error on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "Unauthorized" }, 401, "Unauthorized"),
	);

	const { response, error } = await createClient().apiKey.list({ page: 1 });

	assert.equal(response, null);
	assert.equal(error?.status, 401);
	assert.equal(error?.message, "Unauthorized");
});

// --- validation (no fetch) ---

test("list: page < 1 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.list({ page: 0 }),
		(err: unknown) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.equal(err.field, "page");
			return true;
		},
	);
	assertNoFetch(fetchMock);
});

test("list: limit > 100 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.list({ limit: 101 }),
		(err: unknown) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.equal(err.field, "limit");
			return true;
		},
	);
	assertNoFetch(fetchMock);
});

test("list: non-boolean enabled throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		// @ts-expect-error intentional
		() => createClient().apiKey.list({ enabled: "yes" }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("list: empty userId throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.list({ userId: "  " }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
