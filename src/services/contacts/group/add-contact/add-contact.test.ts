import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertNoFetch,
	createClient,
	getCall,
	GROUP_ID,
	jsonResponse,
	membershipResponseFixture,
	mockFetch,
	parseBody,
} from "@/services/contacts/group/test-helpers";

afterEach(() => {
	mock.restore();
});

test("addContact: POST /api/contacts/group/:id", async () => {
	const payload = membershipResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { group, groupError } = await createClient().contacts.groups.addContact(
		GROUP_ID,
		{ email: "user@example.com" },
	);

	assert.equal(groupError, null);
	assert.deepEqual(group, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/contacts/group/${GROUP_ID}`);
	assert.equal(call.method, "POST");
	assert.deepEqual(parseBody(call.body), { email: "user@example.com" });
});

test("addContact: requires contact_id or email", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.groups.addContact(GROUP_ID, {}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
