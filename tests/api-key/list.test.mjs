import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import {
	assertAuthAndJson,
	createClient,
	errorJsonResponse,
	getCall,
	jsonResponse,
	listResponseFixture,
	mockFetch,
} from "./_helpers.mjs";

afterEach(() => {
	mock.restoreAll();
});

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
	const fetchMock = mockFetch(jsonResponse(listResponseFixture({ page: 2, limit: 5 })));

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
	assert.equal(parsed.origin + parsed.pathname, "https://reloop.sh/api/api-key/v1/");
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
	mockFetch(errorJsonResponse({ message: "Unauthorized" }, 401, "Unauthorized"));

	const { response, error } = await createClient().apiKey.list({ page: 1 });

	assert.equal(response, null);
	assert.equal(error?.status, 401);
	assert.equal(error?.message, "Unauthorized");
});
