import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	errorJsonResponse,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
	PROPERTY_ID,
	propertyFixture,
} from "@/services/contacts/property/test-helpers";

afterEach(() => {
	mock.restore();
});

test("update: PATCH /api/contacts/v1/properties/:id with fallbackValue", async () => {
	const payload = propertyFixture({ defaultValue: "N/A" });
	const fetchMock = mockFetch(jsonResponse(payload));

	const { property, propertyError } =
		await createClient().contacts.properties.update(PROPERTY_ID, {
			fallbackValue: "N/A",
		});

	assert.equal(propertyError, null);
	assert.deepEqual(property, payload);

	const call = getCall(fetchMock);
	assert.equal(
		call.url,
		`https://reloop.sh/api/contacts/v1/properties/${PROPERTY_ID}`,
	);
	assert.equal(call.method, "PATCH");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), { fallbackValue: "N/A" });
});

test("update: allows null fallbackValue", async () => {
	const fetchMock = mockFetch(
		jsonResponse(propertyFixture({ defaultValue: null })),
	);

	await createClient().contacts.properties.update(PROPERTY_ID, {
		fallbackValue: null,
	});

	assert.deepEqual(parseBody(getCall(fetchMock).body), {
		fallbackValue: null,
	});
});

test("update: returns propertyError on non-OK", async () => {
	mockFetch(errorJsonResponse({ message: "Property not found" }, 404));

	const { property, propertyError } =
		await createClient().contacts.properties.update(PROPERTY_ID, {
			fallbackValue: "N/A",
		});

	assert.equal(property, null);
	assert.equal(propertyError?.status, 404);
});

test("update: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() =>
			createClient().contacts.properties.update("", {
				fallbackValue: "N/A",
			}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
