import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
	WEBHOOK_ID,
	webhookFixture,
} from "@/services/webhook/test-helpers";

afterEach(() => {
	mock.restore();
});

test("update patches webhook", async () => {
	const fetchMock = mockFetch(
		jsonResponse(webhookFixture({ status: "paused" })),
	);

	await createClient().webhook.update(WEBHOOK_ID, { status: "paused" });

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/webhook/v1/${WEBHOOK_ID}`);
	assert.equal(call.method, "PATCH");
	assert.equal(
		(parseBody(call.body) as { status: string }).status,
		"paused",
	);
});
