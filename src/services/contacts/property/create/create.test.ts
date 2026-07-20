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
	propertyFixture,
} from "@/services/contacts/property/test-helpers";

afterEach(() => {
	mock.restore();
});

test("create: POST /api/contacts/v1/properties/create with body", async () => {
	const payload = propertyFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { property, propertyError } =
		await createClient().contacts.properties.create({
			name: "company_name",
			type: "string",
			fallbackValue: "Unknown",
		});

	assert.equal(propertyError, null);
	assert.deepEqual(property, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/contacts/v1/properties/create");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), {
		name: "company_name",
		type: "string",
		fallbackValue: "Unknown",
	});
});

test("create: returns propertyError on non-OK without throwing", async () => {
	mockFetch(
		errorJsonResponse(
			{ message: "Property already exists", why: "Duplicate name" },
			409,
			"Conflict",
		),
	);

	const { property, propertyError } =
		await createClient().contacts.properties.create({
			name: "company_name",
			type: "string",
		});

	assert.equal(property, null);
	assert.ok(propertyError);
	assert.equal(propertyError.status, 409);
	assert.equal(propertyError.message, "Property already exists");
});

test("create: trims name before sending", async () => {
	const fetchMock = mockFetch(jsonResponse(propertyFixture()));

	await createClient().contacts.properties.create({
		name: "  company_name  ",
		type: "string",
	});

	assert.deepEqual(parseBody(getCall(fetchMock).body), {
		name: "company_name",
		type: "string",
	});
});

test("create: empty name throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() =>
			createClient().contacts.properties.create({
				name: "",
				type: "string",
			}),
		(err: unknown) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.equal(err.field, "name");
			return true;
		},
	);
	assertNoFetch(fetchMock);
});

test("create: invalid type throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() =>
			createClient().contacts.properties.create({
				name: "company_name",
				type: "boolean" as "string",
			}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("create: missing params throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() =>
			(
				createClient().contacts.properties as {
					create: (p?: unknown) => Promise<unknown>;
				}
			).create(),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
