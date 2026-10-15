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

const TRIGGER_ID = "evt_123";

function triggerFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: TRIGGER_ID,
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

test("start: POST /api/workflow/v1/events/track", async () => {
	const fetchMock = mockFetch(
		jsonResponse({
			success: true,
			eventId: TRIGGER_ID,
			eventKey: "trigger.user.signed_up",
			contactId: "con_1",
			contactCreated: false,
			enrollments: 2,
			properties: { plan: "pro" },
		}),
	);
	const { automation, automationError } = await createClient().automations.start({
		event: "user.signed_up",
		email: "john.doe@example.com",
		properties: { plan: "pro" },
	});
	assert.equal(automationError, null);
	assert.equal(automation?.enrollments, 2);
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

test("start: returns automationError from the API", async () => {
	mockFetch(errorJsonResponse({ message: 'Missing required property "plan".' }, 400));
	const { automation, automationError } = await createClient().automations.start({
		event: "user.signed_up",
		contactId: "con_1",
	});
	assert.equal(automation, null);
	assert.equal(automationError?.status, 400);
});

test("start: needs an event and a contact before any request", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	const automations = createClient().automations;
	await assert.rejects(
		() => automations.start({ event: "", email: "a@b.co" }),
		ReloopValidationError,
	);
	await assert.rejects(() => automations.start({ event: "x" }), ReloopValidationError);
	await assert.rejects(
		() => automations.start({ event: "x", contactId: "con_1", properties: [] as never }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("create: with properties", async () => {
	const fetchMock = mockFetch(jsonResponse(triggerFixture(), 201));
	const params = {
		name: "User signed up",
		key: "user.signed_up",
		properties: [{ name: "plan", propertyType: "string" as const, required: true }],
	};
	const { trigger } = await createClient().automations.triggers.create(params);
	assert.equal(trigger?.key, "trigger.user.signed_up");
	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/workflow/v1/events");
	assert.deepEqual(parseBody(call.body), params);

	await assert.rejects(
		() =>
			createClient().automations.triggers.create({
				name: "x",
				properties: [{ name: "1bad" }],
			}),
		ReloopValidationError,
	);
});

test("list / get / update / delete", async () => {
	const listMock = mockFetch(
		jsonResponse({ events: [triggerFixture()], total: 1, page: 1, limit: 50 }),
	);
	const { triggers } = await createClient().automations.triggers.list({ page: 1 });
	assert.equal(triggers?.total, 1);
	assert.equal(getCall(listMock).url, "https://reloop.sh/api/workflow/v1/events?page=1");

	mock.restore();
	const getMock = mockFetch(jsonResponse(triggerFixture()));
	await createClient().automations.triggers.get("user.signed_up");
	assert.equal(
		getCall(getMock).url,
		"https://reloop.sh/api/workflow/v1/events/user.signed_up",
	);

	mock.restore();
	const updateMock = mockFetch(jsonResponse(triggerFixture({ description: "New" })));
	await createClient().automations.triggers.update(TRIGGER_ID, { description: "New" });
	assert.equal(getCall(updateMock).method, "PATCH");
	assert.deepEqual(parseBody(getCall(updateMock).body), { description: "New" });
	await assert.rejects(
		() => createClient().automations.triggers.update(TRIGGER_ID, {}),
		ReloopValidationError,
	);

	mock.restore();
	const deleteMock = mockFetch(jsonResponse({ success: true, id: TRIGGER_ID }));
	const { trigger } = await createClient().automations.triggers.delete(TRIGGER_ID);
	assert.deepEqual(trigger, { success: true, id: TRIGGER_ID });
	assert.equal(getCall(deleteMock).method, "DELETE");
});
