import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertNoFetch,
	CHANNEL_ID,
	channelFixture,
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
} from "@/services/contacts/channel/test-helpers";

afterEach(() => {
	mock.restore();
});

test("update: PATCH /api/contacts/v1/channels/:id", async () => {
	const payload = channelFixture({ name: "Marketing News" });
	const fetchMock = mockFetch(jsonResponse(payload));

	const { channel, channelError } =
		await createClient().contacts.channels.update(CHANNEL_ID, {
			name: "Marketing News",
		});

	assert.equal(channelError, null);
	assert.deepEqual(channel, payload);
	assert.deepEqual(parseBody(getCall(fetchMock).body), {
		name: "Marketing News",
	});
});

test("update: empty body throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.channels.update(CHANNEL_ID, {}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
