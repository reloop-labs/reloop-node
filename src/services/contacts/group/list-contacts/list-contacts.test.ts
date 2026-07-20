import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	getCall,
	GROUP_ID,
	groupContactsFixture,
	jsonResponse,
	mockFetch,
} from "@/services/contacts/group/test-helpers";

afterEach(() => {
	mock.restore();
});

test("listContacts: GET /api/contacts/v1/groups/:id/contacts", async () => {
	const payload = groupContactsFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { contacts, groupError } =
		await createClient().contacts.groups.listContacts(GROUP_ID, {
			page: 1,
			limit: 10,
			status: "subscribed",
		});

	assert.equal(groupError, null);
	assert.deepEqual(contacts, payload);

	const parsed = new URL(getCall(fetchMock).url);
	assert.equal(
		parsed.origin + parsed.pathname,
		`https://reloop.sh/api/contacts/v1/groups/${GROUP_ID}/contacts`,
	);
	assert.equal(parsed.searchParams.get("status"), "subscribed");
});
