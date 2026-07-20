import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	WEBHOOK_ID,
	webhookFixture,
} from "@/services/webhook/test-helpers";

afterEach(() => {
	mock.restore();
});

test("get uses webhook id route", async () => {
	const fetchMock = mockFetch(jsonResponse(webhookFixture()));

	await createClient().webhook.get(WEBHOOK_ID);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/webhook/v1/${WEBHOOK_ID}`);
	assert.equal(call.method, "GET");
});
