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
} from "@/services/contacts/test-helpers";

afterEach(() => {
	mock.restore();
});

test("list: GET /api/contacts/list with query", async () => {
	const payload = listResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { contacts, contactError } = await createClient().contacts.list({
		page: 2,
		limit: 25,
		search: "john",
		status: "subscribed",
	});

	assert.equal(contactError, null);
	assert.deepEqual(contacts, payload);
	assert.equal(
		getCall(fetchMock).url,
		"https://reloop.sh/api/contacts/list?page=2&limit=25&search=john&status=subscribed",
	);
});

test("list: without params uses /api/contacts/list", async () => {
	const payload = listResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { contacts, contactError } = await createClient().contacts.list();

	assert.equal(contactError, null);
	assert.deepEqual(contacts, payload);
	assert.equal(getCall(fetchMock).url, "https://reloop.sh/api/contacts/list");
});

test("list: page < 1 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.list({ page: 0 }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
