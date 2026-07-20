import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	CHANNEL_ID,
	createClient,
	deleteResponseFixture,
	getCall,
	jsonResponse,
	mockFetch,
} from "@/services/contacts/channel/test-helpers";

afterEach(() => {
	mock.restore();
});

test("delete: DELETE /api/contacts/v1/channels/:id", async () => {
	const payload = deleteResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { channel, channelError } =
		await createClient().contacts.channels.delete(CHANNEL_ID);

	assert.equal(channelError, null);
	assert.deepEqual(channel, payload);
	assert.equal(getCall(fetchMock).method, "DELETE");
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/contacts/v1/channels/${CHANNEL_ID}`,
	);
});
