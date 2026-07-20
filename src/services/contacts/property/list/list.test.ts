import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	errorJsonResponse,
	getCall,
	jsonResponse,
	listResponseFixture,
	mockFetch,
} from "@/services/contacts/property/test-helpers";

afterEach(() => {
	mock.restore();
});

test("list: GET /api/contacts/v1/properties/list with no query", async () => {
	const payload = listResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { properties, propertyError } =
		await createClient().contacts.properties.list();

	assert.equal(propertyError, null);
	assert.deepEqual(properties, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/contacts/v1/properties/list");
	assert.equal(call.method, "GET");
	assertAuthAndJson(call.headers);
});

test("list: builds query string from params", async () => {
	const fetchMock = mockFetch(jsonResponse(listResponseFixture()));

	const { propertyError } = await createClient().contacts.properties.list({
		page: 2,
		limit: 5,
		search: "company",
		type: "number",
	});

	assert.equal(propertyError, null);
	const parsed = new URL(getCall(fetchMock).url);
	assert.equal(
		parsed.origin + parsed.pathname,
		"https://reloop.sh/api/contacts/v1/properties/list",
	);
	assert.equal(parsed.searchParams.get("page"), "2");
	assert.equal(parsed.searchParams.get("limit"), "5");
	assert.equal(parsed.searchParams.get("search"), "company");
	assert.equal(parsed.searchParams.get("type"), "number");
});

test("list: returns propertyError on non-OK", async () => {
	mockFetch(
		errorJsonResponse({ message: "Unauthorized" }, 401, "Unauthorized"),
	);

	const { properties, propertyError } =
		await createClient().contacts.properties.list({ page: 1 });

	assert.equal(properties, null);
	assert.equal(propertyError?.status, 401);
});

test("list: page < 1 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.properties.list({ page: 0 }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("list: limit > 100 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.properties.list({ limit: 101 }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
