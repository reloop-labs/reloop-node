import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	deleteResponseFixture,
	errorJsonResponse,
	getCall,
	jsonResponse,
	mockFetch,
	PROPERTY_ID,
} from "@/services/contacts/property/test-helpers";

afterEach(() => {
	mock.restore();
});

test("delete: DELETE /api/contacts/v1/properties/:id", async () => {
	const payload = deleteResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { property, propertyError } =
		await createClient().contacts.properties.delete(PROPERTY_ID);

	assert.equal(propertyError, null);
	assert.deepEqual(property, payload);

	const call = getCall(fetchMock);
	assert.equal(
		call.url,
		`https://reloop.sh/api/contacts/v1/properties/${PROPERTY_ID}`,
	);
	assert.equal(call.method, "DELETE");
	assertAuthAndJson(call.headers);
});

test("delete: returns propertyError on non-OK", async () => {
	mockFetch(errorJsonResponse({ message: "Property not found" }, 404));

	const { property, propertyError } =
		await createClient().contacts.properties.delete(PROPERTY_ID);

	assert.equal(property, null);
	assert.equal(propertyError?.status, 404);
});

test("delete: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().contacts.properties.delete("  "),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
