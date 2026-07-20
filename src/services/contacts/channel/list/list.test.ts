import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	getCall,
	jsonResponse,
	listResponseFixture,
	mockFetch,
} from "@/services/contacts/channel/test-helpers";

afterEach(() => {
	mock.restore();
});

test("list: GET /api/contacts/v1/channels/list", async () => {
	const payload = listResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { channels, channelError } =
		await createClient().contacts.channels.list({ page: 1, limit: 10 });

	assert.equal(channelError, null);
	assert.deepEqual(channels, payload);

	const parsed = new URL(getCall(fetchMock).url);
	assert.equal(
		parsed.origin + parsed.pathname,
		"https://reloop.sh/api/contacts/v1/channels/list",
	);
	assert.equal(parsed.searchParams.get("page"), "1");
	assert.equal(parsed.searchParams.get("limit"), "10");
});
