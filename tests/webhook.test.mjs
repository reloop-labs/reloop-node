import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { Reloop } from "@/index";

function mockFetch(response) {
	const fn = mock(async () => response);
	globalThis.fetch = fn;
	return fn;
}

afterEach(() => {
	mock.restore();
});

const webhookResponse = {
	id: "wh_123456789",
	name: "Production webhook",
	url: "https://example.com/webhooks/reloop",
	secret: "whsec_test",
	status: "active",
	customHeaders: null,
	rateLimitEnabled: false,
	maxRequestsPerMinute: 60,
	maxRetries: 3,
	retryBackoffMultiplier: 2,
	filteringOptions: null,
	lastTriggeredAt: null,
	successCount: 0,
	failureCount: 0,
	consecutiveFailures: 0,
	events: ["domain.created"],
	createdAt: "2026-01-01T00:00:00.000Z",
	updatedAt: "2026-01-01T00:00:00.000Z",
};

test("create posts to /api/webhook/v1/", async () => {
	const fetchMock = mockFetch(Response.json(webhookResponse, { status: 201 }));

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	const { response, error } = await reloop.webhook.create({
		description: "Production webhook",
		url: "https://example.com/webhooks/reloop",
		events: ["domain.created"],
	});

	assert.equal(error, null);
	assert.equal(response?.id, "wh_123456789");
	assert.equal(fetchMock.mock.calls[0]?.[0], "https://reloop.sh/api/webhook/v1/");
	assert.equal(fetchMock.mock.calls[0]?.[1]?.method, "POST");

	const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body);
	assert.equal(body.description, "Production webhook");
	assert.deepEqual(body.events, ["domain.created"]);
});

test("list builds query on /api/webhook/v1", async () => {
	const fetchMock = mockFetch(
		Response.json({
			webhooks: [webhookResponse],
			total: 1,
			page: 1,
			limit: 10,
		}),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.webhook.list({ page: 1, limit: 10, status: "active" });

	assert.equal(
		fetchMock.mock.calls[0]?.[0],
		"https://reloop.sh/api/webhook/v1?page=1&limit=10&status=active",
	);
	assert.equal(fetchMock.mock.calls[0]?.[1]?.method, "GET");
});

test("list without params uses /api/webhook/v1", async () => {
	const fetchMock = mockFetch(
		Response.json({ webhooks: [], total: 0, page: 1, limit: 10 }),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.webhook.list();

	assert.equal(fetchMock.mock.calls[0]?.[0], "https://reloop.sh/api/webhook/v1");
});

test("get uses webhook id route", async () => {
	const fetchMock = mockFetch(Response.json(webhookResponse));

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.webhook.get("wh_123456789");

	assert.equal(
		fetchMock.mock.calls[0]?.[0],
		"https://reloop.sh/api/webhook/v1/wh_123456789",
	);
	assert.equal(fetchMock.mock.calls[0]?.[1]?.method, "GET");
});

test("update patches webhook", async () => {
	const fetchMock = mockFetch(Response.json({ ...webhookResponse, status: "paused" }));

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.webhook.update("wh_123456789", { status: "paused" });

	assert.equal(fetchMock.mock.calls[0]?.[0], "https://reloop.sh/api/webhook/v1/wh_123456789");
	assert.equal(fetchMock.mock.calls[0]?.[1]?.method, "PATCH");
	assert.equal(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body).status, "paused");
});

test("delete removes webhook", async () => {
	const fetchMock = mockFetch(
		Response.json({ id: "wh_123456789", message: "Webhook deleted" }),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.webhook.delete("wh_123456789");

	assert.equal(fetchMock.mock.calls[0]?.[0], "https://reloop.sh/api/webhook/v1/wh_123456789");
	assert.equal(fetchMock.mock.calls[0]?.[1]?.method, "DELETE");
});

test("pause enable and disable patch status", async () => {
	const fetchMock = mockFetch(Response.json(webhookResponse));
	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });

	await reloop.webhook.pause("wh_1");
	assert.equal(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body).status, "paused");

	await reloop.webhook.enable("wh_1");
	assert.equal(JSON.parse(fetchMock.mock.calls[1]?.[1]?.body).status, "active");

	await reloop.webhook.disable("wh_1");
	assert.equal(JSON.parse(fetchMock.mock.calls[2]?.[1]?.body).status, "disabled");
});

test("trigger posts to /api/webhook/v1/trigger", async () => {
	const fetchMock = mockFetch(
		Response.json({ success: true, message: "Webhook triggered", jobId: "job_1" }),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.webhook.trigger({
		event: "domain.created",
		payload: { domainId: "dom_1" },
	});

	assert.equal(fetchMock.mock.calls[0]?.[0], "https://reloop.sh/api/webhook/v1/trigger");
	assert.equal(fetchMock.mock.calls[0]?.[1]?.method, "POST");
	const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body);
	assert.equal(body.event, "domain.created");
	assert.deepEqual(body.payload, { domainId: "dom_1" });
});

test("listDeliveries uses deliveries route", async () => {
	const fetchMock = mockFetch(
		Response.json({ deliveries: [], total: 0, page: 1, limit: 10 }),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.webhook.listDeliveries("wh_123456789", { page: 1, limit: 10, status: "failed" });

	assert.equal(
		fetchMock.mock.calls[0]?.[0],
		"https://reloop.sh/api/webhook/v1/wh_123456789/deliveries?page=1&limit=10&status=failed",
	);
	assert.equal(fetchMock.mock.calls[0]?.[1]?.method, "GET");
});

test("retryDelivery uses deliveries retry route outside v1", async () => {
	const fetchMock = mockFetch(
		Response.json({ success: true, message: "Delivery re-enqueued" }),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.webhook.retryDelivery("del_123456789");

	assert.equal(
		fetchMock.mock.calls[0]?.[0],
		"https://reloop.sh/api/webhook/deliveries/del_123456789/retry",
	);
	assert.equal(fetchMock.mock.calls[0]?.[1]?.method, "POST");
});
