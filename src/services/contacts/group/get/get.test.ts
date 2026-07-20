import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	getCall,
	GROUP_ID,
	groupFixture,
	jsonResponse,
	mockFetch,
} from "@/services/contacts/group/test-helpers";

afterEach(() => {
	mock.restore();
});

test("get: GET /api/contacts/v1/groups/:id", async () => {
	const payload = groupFixture();
	const { event: _event, ...base } = payload;
	const fetchMock = mockFetch(jsonResponse(base));

	const { group, groupError } =
		await createClient().contacts.groups.get(GROUP_ID);

	assert.equal(groupError, null);
	assert.deepEqual(group, base);

	const call = getCall(fetchMock);
	assert.equal(
		call.url,
		`https://reloop.sh/api/contacts/v1/groups/${GROUP_ID}`,
	);
	assert.equal(call.method, "GET");
	assertAuthAndJson(call.headers);
});

test("get: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.groups.get(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
