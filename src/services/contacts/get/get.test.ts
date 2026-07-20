import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertNoFetch,
	CONTACT_ID,
	contactFixture,
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
} from "@/services/contacts/test-helpers";

afterEach(() => {
	mock.restore();
});

test("get: GET /api/contacts/retrieve/:id", async () => {
	const payload = contactFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { contact, contactError } = await createClient().contacts.get(
		CONTACT_ID,
	);

	assert.equal(contactError, null);
	assert.deepEqual(contact, payload);
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/contacts/retrieve/${CONTACT_ID}`,
	);
});

test("get: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.get(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
