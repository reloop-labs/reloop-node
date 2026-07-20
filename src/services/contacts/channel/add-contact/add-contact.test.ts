import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	addContactResponseFixture,
	assertNoFetch,
	CHANNEL_ID,
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
} from "@/services/contacts/channel/test-helpers";

afterEach(() => {
	mock.restore();
});

test("addContact: POST /api/contacts/channel/:id", async () => {
	const payload = addContactResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload, 201, "Created"));

	const { channel, channelError } =
		await createClient().contacts.channels.addContact(CHANNEL_ID, {
			email: "user@example.com",
			subscription: "opt_in",
		});

	assert.equal(channelError, null);
	assert.deepEqual(channel, payload);

	const call = getCall(fetchMock);
	assert.equal(
		call.url,
		`https://reloop.sh/api/contacts/channel/${CHANNEL_ID}`,
	);
	assert.equal(call.method, "POST");
	assert.deepEqual(parseBody(call.body), {
		email: "user@example.com",
		subscription: "opt_in",
	});
});

test("addContact: requires contact_id or email", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.channels.addContact(CHANNEL_ID, {}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
