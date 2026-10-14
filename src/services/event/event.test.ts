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
} from "@/services/domain/test-helpers";

afterEach(() => {
	mock.restore();
});

const EVENT_ID = "evt_123";

function eventFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: EVENT_ID,
		organizationId: "org_1",
		name: "User signed up",
		key: "trigger.user.signed_up",
		description: null,
		properties: [],
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
		...overrides,
	};
}

test("track: POST /api/workflow/v1/events/track", async () => {
	const fetchMock = mockFetch(
		jsonResponse({
			success: true,
			eventId: EVENT_ID,
			eventKey: "trigger.user.signed_up",
			contactId: "con_1",
			contactCreated: false,
			enrollments: 2,
			properties: { plan: "pro" },
		}),
	);
	const { event, eventError } = await createClient().events.track({
		event: "user.signed_up",
		email: "john.doe@example.com",
		properties: { plan: "pro" },
	});
	assert.equal(eventError, null);
	assert.equal(event?.enrollments, 2);
	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/workflow/v1/events/track");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), {
		event: "user.signed_up",
		email: "john.doe@example.com",
		properties: { plan: "pro" },
	});
});

test("track: returns eventError from the API", async () => {
	mockFetch(errorJsonResponse({ message: 'Missing required property "plan".' }, 400));
	const { event, eventError } = await createClient().events.track({
		event: "user.signed_up",
		contactId: "con_1",
	});
	assert.equal(event, null);
	assert.equal(eventError?.status, 400);
});

test("track: needs an event and a contact before any request", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	const events = createClient().events;
	await assert.rejects(
		() => events.track({ event: "", email: "a@b.co" }),
		ReloopValidationError,
	);
	await assert.rejects(() => events.track({ event: "x" }), ReloopValidationError);
	await assert.rejects(
		() => events.track({ event: "x", contactId: "con_1", properties: [] as never }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("create: with properties", async () => {
	const fetchMock = mockFetch(jsonResponse(eventFixture(), 201));
	const params = {
		name: "User signed up",
		key: "user.signed_up",
		properties: [{ name: "plan", propertyType: "string" as const, required: true }],
	};
	const { event } = await createClient().events.create(params);
	assert.equal(event?.key, "trigger.user.signed_up");
	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/workflow/v1/events");
	assert.deepEqual(parseBody(call.body), params);

	await assert.rejects(
		() =>
			createClient().events.create({
				name: "x",
				properties: [{ name: "1bad" }],
			}),
		ReloopValidationError,
	);
});

test("list / get / update / delete", async () => {
	const listMock = mockFetch(
		jsonResponse({ events: [eventFixture()], total: 1, page: 1, limit: 50 }),
	);
	const { events } = await createClient().events.list({ page: 1 });
	assert.equal(events?.total, 1);
	assert.equal(getCall(listMock).url, "https://reloop.sh/api/workflow/v1/events?page=1");

	mock.restore();
	const getMock = mockFetch(jsonResponse(eventFixture()));
	await createClient().events.get("user.signed_up");
	assert.equal(
		getCall(getMock).url,
		"https://reloop.sh/api/workflow/v1/events/user.signed_up",
	);

	mock.restore();
	const updateMock = mockFetch(jsonResponse(eventFixture({ description: "New" })));
	await createClient().events.update(EVENT_ID, { description: "New" });
	assert.equal(getCall(updateMock).method, "PATCH");
	assert.deepEqual(parseBody(getCall(updateMock).body), { description: "New" });
	await assert.rejects(
		() => createClient().events.update(EVENT_ID, {}),
		ReloopValidationError,
	);

	mock.restore();
	const deleteMock = mockFetch(jsonResponse({ success: true, id: EVENT_ID }));
	const { event } = await createClient().events.delete(EVENT_ID);
	assert.deepEqual(event, { success: true, id: EVENT_ID });
	assert.equal(getCall(deleteMock).method, "DELETE");
});
