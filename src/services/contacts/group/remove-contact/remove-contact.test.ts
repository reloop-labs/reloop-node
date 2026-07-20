import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
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

test("removeContact: DELETE /api/contacts/group/:id", async () => {
	const payload = membershipResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { group, groupError } =
		await createClient().contacts.groups.removeContact(GROUP_ID, {
			contact_id: "con_123",
		});

	assert.equal(groupError, null);
	assert.deepEqual(group, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/contacts/group/${GROUP_ID}`);
	assert.equal(call.method, "DELETE");
	assert.deepEqual(parseBody(call.body), { contact_id: "con_123" });
});
