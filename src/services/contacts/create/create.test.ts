import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	contactResponseFixture,
	createClient,
	errorJsonResponse,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
} from "@/services/contacts/test-helpers";

afterEach(() => {
	mock.restore();
});

test("create: POST /api/contacts/create with body", async () => {
	const payload = contactResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload, 201, "Created"));

	const { contact, contactError } = await createClient().contacts.create({
		email: "john.doe@example.com",
		firstName: "John",
		lastName: "Doe",
		status: "subscribed",
		properties: { company: "Reloop" },
		groupIds: ["grp_123"],
		channels: [{ channelId: "chn_123", subscription: "opt_in" }],
	});

	assert.equal(contactError, null);
	assert.deepEqual(contact, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/contacts/create");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), {
		email: "john.doe@example.com",
		firstName: "John",
		lastName: "Doe",
		status: "subscribed",
		properties: { company: "Reloop" },
		groupIds: ["grp_123"],
		channels: [{ channelId: "chn_123", subscription: "opt_in" }],
	});
});

test("create: returns contactError on non-OK", async () => {
	mockFetch(errorJsonResponse({ message: "Contact already exists" }, 409));

	const { contact, contactError } = await createClient().contacts.create({
		email: "john.doe@example.com",
	});

	assert.equal(contact, null);
	assert.equal(contactError?.status, 409);
});

test("create: invalid email throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.create({ email: "not-an-email" }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("create: missing params throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() =>
			createClient().contacts.create(
				undefined as unknown as { email: string },
			),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
