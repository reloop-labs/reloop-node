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
} from "@/services/contacts/group/test-helpers";

afterEach(() => {
	mock.restore();
});

test("list: GET /api/contacts/v1/groups/list", async () => {
	const payload = listResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { groups, groupError } = await createClient().contacts.groups.list({
		page: 1,
		limit: 10,
		search: "Beta",
	});

	assert.equal(groupError, null);
	assert.deepEqual(groups, payload);

	const parsed = new URL(getCall(fetchMock).url);
	assert.equal(
		parsed.origin + parsed.pathname,
		"https://reloop.sh/api/contacts/v1/groups/list",
	);
	assert.equal(parsed.searchParams.get("page"), "1");
	assert.equal(parsed.searchParams.get("limit"), "10");
	assert.equal(parsed.searchParams.get("search"), "Beta");
});

test("list: page < 1 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.groups.list({ page: 0 }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
