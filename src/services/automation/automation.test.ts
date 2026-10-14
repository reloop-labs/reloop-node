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
import type { CreateAutomationParams } from "@/services/automation/types";

afterEach(() => {
	mock.restore();
});

const AUTOMATION_ID = "auto_123";

const planWelcome: CreateAutomationParams = {
	name: "Plan-based Welcome",
	steps: [
		{ key: "start", type: "trigger", config: { eventName: "user.created" } },
		{
			key: "check_plan",
			type: "condition",
			config: { type: "rule", field: "trigger.plan", operator: "eq", value: "pro" },
		},
		{ key: "send_pro", type: "send_email", config: { template: { id: "tpl_pro" } } },
		{ key: "send_free", type: "send_email", config: { template: { id: "tpl_free" } } },
	],
	connections: [
		{ from: "start", to: "check_plan", type: "default" },
		{ from: "check_plan", to: "send_pro", type: "condition_met" },
		{ from: "check_plan", to: "send_free", type: "condition_not_met" },
	],
};

function automationFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: AUTOMATION_ID,
		organizationId: "org_1",
		name: "Plan-based Welcome",
		description: null,
		status: "draft",
		triggerEvent: "user.created",
		steps: planWelcome.steps,
		connections: planWelcome.connections,
		activeVersionId: null,
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
		...overrides,
	};
}

test("create: POST /api/workflow/v1/automations with steps and connections", async () => {
	const fetchMock = mockFetch(jsonResponse(automationFixture(), 201));

	const { automation, automationError } =
		await createClient().automations.create({ ...planWelcome, status: "active" });

	assert.equal(automationError, null);
	assert.equal(automation?.id, AUTOMATION_ID);
	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/workflow/v1/automations");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), { ...planWelcome, status: "active" });
});

test("create: returns automationError with the API's reasons", async () => {
	mockFetch(
		errorJsonResponse(
			{ message: "Invalid workflow graph", why: 'Step "check_plan": needs a value.' },
			400,
		),
	);
	const { automation, automationError } =
		await createClient().automations.create(planWelcome);
	assert.equal(automation, null);
	assert.equal(automationError?.status, 400);
	assert.match(String(automationError?.body.why), /check_plan/);
});

test("create: obvious mistakes throw before any request", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	const automations = createClient().automations;
	await assert.rejects(() => automations.create({ name: "  " }), ReloopValidationError);
	await assert.rejects(
		() =>
			automations.create({
				name: "x",
				steps: [{ key: "a", type: "sms", config: {} } as never],
			}),
		ReloopValidationError,
	);
	await assert.rejects(
		() =>
			automations.create({
				name: "x",
				steps: planWelcome.steps,
				connections: [{ from: "start", to: "check_plan", type: "yes" as never }],
			}),
		ReloopValidationError,
	);
	await assert.rejects(
		() => automations.create({ name: "x", status: "paused" as never }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("get / delete: by id", async () => {
	const fetchMock = mockFetch(jsonResponse(automationFixture()));
	await createClient().automations.get(AUTOMATION_ID);
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/workflow/v1/automations/${AUTOMATION_ID}`,
	);
	assert.equal(getCall(fetchMock).method, "GET");

	mock.restore();
	const deleteMock = mockFetch(jsonResponse({ success: true, id: AUTOMATION_ID }));
	const { automation } = await createClient().automations.delete(AUTOMATION_ID);
	assert.deepEqual(automation, { success: true, id: AUTOMATION_ID });
	assert.equal(getCall(deleteMock).method, "DELETE");
});

test("list: page and limit in the query", async () => {
	const fetchMock = mockFetch(
		jsonResponse({ automations: [automationFixture()], total: 1, page: 2, limit: 10 }),
	);
	const { automations } = await createClient().automations.list({ page: 2, limit: 10 });
	assert.equal(automations?.total, 1);
	assert.equal(
		getCall(fetchMock).url,
		"https://reloop.sh/api/workflow/v1/automations?page=2&limit=10",
	);
});

test("update: steps always go with connections; status starts or stops it", async () => {
	const fetchMock = mockFetch(jsonResponse(automationFixture({ status: "active" })));
	await createClient().automations.update(AUTOMATION_ID, {
		steps: planWelcome.steps,
		status: "active",
	});
	const call = getCall(fetchMock);
	assert.equal(call.method, "PATCH");
	assert.deepEqual(parseBody(call.body), {
		status: "active",
		steps: planWelcome.steps,
		connections: [],
	});

	await assert.rejects(
		() => createClient().automations.update(AUTOMATION_ID, {}),
		ReloopValidationError,
	);
	await assert.rejects(
		() =>
			createClient().automations.update(AUTOMATION_ID, {
				connections: planWelcome.connections,
			}),
		ReloopValidationError,
	);
});

test("activate / pause: POST to the action path", async () => {
	const fetchMock = mockFetch(jsonResponse(automationFixture({ status: "active" })));
	const { automation } = await createClient().automations.activate(AUTOMATION_ID);
	assert.equal(automation?.status, "active");
	const call = getCall(fetchMock);
	assert.equal(call.method, "POST");
	assert.equal(
		call.url,
		`https://reloop.sh/api/workflow/v1/automations/${AUTOMATION_ID}/activate`,
	);

	mock.restore();
	const pauseMock = mockFetch(jsonResponse(automationFixture({ status: "paused" })));
	await createClient().automations.pause(AUTOMATION_ID);
	assert.equal(
		getCall(pauseMock).url,
		`https://reloop.sh/api/workflow/v1/automations/${AUTOMATION_ID}/pause`,
	);
});

const enrollmentFixture = {
	id: "enr_1",
	automationId: AUTOMATION_ID,
	contactId: "con_1",
	contactEmail: "john.doe@example.com",
	contactFirstName: null,
	contactLastName: null,
	status: "active",
	currentNodeId: "check_plan",
	enrolledAt: "2026-01-01T00:00:00.000Z",
	completedAt: null,
	cancelledAt: null,
};

test("enroll: sends the contact by email", async () => {
	const fetchMock = mockFetch(
		jsonResponse({ enrollment: enrollmentFixture, contactCreated: true, delayMs: 0 }),
	);
	const { enrollment, enrollmentError } = await createClient().automations.enroll(
		AUTOMATION_ID,
		{ email: " john.doe@example.com ", firstName: "John" },
	);
	assert.equal(enrollmentError, null);
	assert.equal(enrollment?.contactCreated, true);
	const call = getCall(fetchMock);
	assert.equal(
		call.url,
		`https://reloop.sh/api/workflow/v1/automations/${AUTOMATION_ID}/enroll`,
	);
	assert.deepEqual(parseBody(call.body), {
		email: "john.doe@example.com",
		firstName: "John",
	});
});

test("enroll: needs contactId or email", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().automations.enroll(AUTOMATION_ID, {}),
		ReloopValidationError,
	);
	await assert.rejects(
		() => createClient().automations.enroll(AUTOMATION_ID, { email: "nope" }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("enrollments: list with status filter, get with step runs", async () => {
	const fetchMock = mockFetch(
		jsonResponse({ enrollments: [enrollmentFixture], total: 1, page: 1, limit: 20 }),
	);
	const { enrollments } = await createClient().automations.enrollments.list(
		AUTOMATION_ID,
		{ limit: 20, status: "active" },
	);
	assert.equal(enrollments?.total, 1);
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/workflow/v1/automations/${AUTOMATION_ID}/enrollments?limit=20&status=active`,
	);

	mock.restore();
	const getMock = mockFetch(jsonResponse({ enrollment: enrollmentFixture, steps: [] }));
	const { enrollment } = await createClient().automations.enrollments.get(
		AUTOMATION_ID,
		"enr_1",
	);
	assert.equal(enrollment?.enrollment.id, "enr_1");
	assert.equal(
		getCall(getMock).url,
		`https://reloop.sh/api/workflow/v1/automations/${AUTOMATION_ID}/enrollments/enr_1`,
	);

	await assert.rejects(
		() =>
			createClient().automations.enrollments.list(AUTOMATION_ID, {
				status: "running" as never,
			}),
		ReloopValidationError,
	);
});
