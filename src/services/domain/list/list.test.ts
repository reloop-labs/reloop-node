import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertNoFetch,
	createClient,
	getCall,
	jsonResponse,
	listResponseFixture,
	mockFetch,
} from "@/services/domain/test-helpers";

afterEach(() => {
	mock.restore();
});

test("list: GET /api/domain/v1/list with query", async () => {
	const payload = listResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { domains, domainError } = await createClient().domain.list({
		page: 2,
		limit: 5,
		status: "active",
		q: "example",
	});

	assert.equal(domainError, null);
	assert.deepEqual(domains, payload);

	const parsed = new URL(getCall(fetchMock).url);
	assert.equal(
		parsed.origin + parsed.pathname,
		"https://reloop.sh/api/domain/v1/list",
	);
	assert.equal(parsed.searchParams.get("page"), "2");
	assert.equal(parsed.searchParams.get("limit"), "5");
	assert.equal(parsed.searchParams.get("status"), "active");
	assert.equal(parsed.searchParams.get("q"), "example");
});

test("list: page < 1 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().domain.list({ page: 0 }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
