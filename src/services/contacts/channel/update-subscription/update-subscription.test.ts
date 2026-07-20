import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	CHANNEL_ID,
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
	updateSubscriptionResponseFixture,
} from "@/services/contacts/channel/test-helpers";

afterEach(() => {
	mock.restore();
});

test("updateSubscription: PATCH /api/contacts/channel/:id", async () => {
	const payload = updateSubscriptionResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { channel, channelError } =
		await createClient().contacts.channels.updateSubscription(CHANNEL_ID, {
			contact_id: "con_123",
			subscription: "opt_out",
		});

	assert.equal(channelError, null);
	assert.deepEqual(channel, payload);

	const call = getCall(fetchMock);
	assert.equal(
		call.url,
		`https://reloop.sh/api/contacts/channel/${CHANNEL_ID}`,
	);
	assert.equal(call.method, "PATCH");
	assert.deepEqual(parseBody(call.body), {
		contact_id: "con_123",
		subscription: "opt_out",
	});
});
