import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertNoFetch,
	CONTACT_ID,
	createClient,
	deleteResponseFixture,
	getCall,
	jsonResponse,
	mockFetch,
} from "@/services/contacts/test-helpers";

afterEach(() => {
	mock.restore();
});

test("delete: DELETE /api/contacts/:id", async () => {
	const payload = deleteResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { contact, contactError } = await createClient().contacts.delete(
		CONTACT_ID,
	);

	assert.equal(contactError, null);
	assert.deepEqual(contact, payload);
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/contacts/${CONTACT_ID}`,
	);
	assert.equal(getCall(fetchMock).method, "DELETE");
});

test("delete: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.delete(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
