import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	deleteResponseFixture,
	getCall,
	GROUP_ID,
	jsonResponse,
	mockFetch,
} from "@/services/contacts/group/test-helpers";

afterEach(() => {
	mock.restore();
});

test("delete: DELETE /api/contacts/v1/groups/:id", async () => {
	const payload = deleteResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { group, groupError } =
		await createClient().contacts.groups.delete(GROUP_ID);

	assert.equal(groupError, null);
	assert.deepEqual(group, payload);
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/contacts/v1/groups/${GROUP_ID}`,
	);
	assert.equal(getCall(fetchMock).method, "DELETE");
});
