import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	assertAuthAndJson,
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
	webhookFixture,
	WEBHOOK_ID,
} from "@/services/webhook/test-helpers";

afterEach(() => {
	mock.restore();
});

test("create posts to /api/webhook/v1/", async () => {
	const payload = webhookFixture();
	const fetchMock = mockFetch(jsonResponse(payload, 201, "Created"));

	const { webhook, webhookError } = await createClient().webhook.create({
		description: "Production webhook",
		url: "https://example.com/webhooks/reloop",
		events: ["domain.created"],
	});

	assert.equal(webhookError, null);
	assert.equal(webhook?.id, WEBHOOK_ID);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/webhook/v1/");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);

	const body = parseBody(call.body) as Record<string, unknown>;
	assert.equal(body.description, "Production webhook");
	assert.deepEqual(body.events, ["domain.created"]);
});
