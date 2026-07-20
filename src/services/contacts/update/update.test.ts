import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	CONTACT_ID,
	contactResponseFixture,
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
} from "@/services/contacts/test-helpers";

afterEach(() => {
	mock.restore();
});

test("update: PATCH /api/contacts/:id", async () => {
	const payload = contactResponseFixture({ firstName: "Jane" });
	const fetchMock = mockFetch(jsonResponse(payload));

	const { contact, contactError } = await createClient().contacts.update(
		CONTACT_ID,
		{ firstName: "Jane" },
	);

	assert.equal(contactError, null);
	assert.deepEqual(contact, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/contacts/${CONTACT_ID}`);
	assert.equal(call.method, "PATCH");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), { firstName: "Jane" });
});

test("update: empty body throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.update(CONTACT_ID, {}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
