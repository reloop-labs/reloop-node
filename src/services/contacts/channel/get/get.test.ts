import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	CHANNEL_ID,
	channelFixture,
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
} from "@/services/contacts/channel/test-helpers";

afterEach(() => {
	mock.restore();
});

test("get: GET /api/contacts/v1/channels/:id", async () => {
	const payload = channelFixture();
	const { event: _event, ...base } = payload;
	const fetchMock = mockFetch(jsonResponse(base));

	const { channel, channelError } =
		await createClient().contacts.channels.get(CHANNEL_ID);

	assert.equal(channelError, null);
	assert.deepEqual(channel, base);
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/contacts/v1/channels/${CHANNEL_ID}`,
	);
});
