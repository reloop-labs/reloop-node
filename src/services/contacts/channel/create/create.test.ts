import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	channelFixture,
	createClient,
	errorJsonResponse,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
} from "@/services/contacts/channel/test-helpers";

afterEach(() => {
	mock.restore();
});

test("create: POST /api/contacts/v1/channels/create", async () => {
	const payload = channelFixture();
	const fetchMock = mockFetch(jsonResponse(payload, 201, "Created"));

	const { channel, channelError } =
		await createClient().contacts.channels.create({
			name: "Product Updates",
			description: "Get the latest news about our products",
			defaultSubscription: "opt_in",
			visibility: "public",
		});

	assert.equal(channelError, null);
	assert.deepEqual(channel, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/contacts/v1/channels/create");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), {
		name: "Product Updates",
		description: "Get the latest news about our products",
		defaultSubscription: "opt_in",
		visibility: "public",
	});
});

test("create: returns channelError on non-OK", async () => {
	mockFetch(errorJsonResponse({ message: "Channel already exists" }, 409));

	const { channel, channelError } =
		await createClient().contacts.channels.create({ name: "Product Updates" });

	assert.equal(channel, null);
	assert.equal(channelError?.status, 409);
});

test("create: empty name throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.channels.create({ name: "" }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
