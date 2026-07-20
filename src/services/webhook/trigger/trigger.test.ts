import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
	triggerResponseFixture,
} from "@/services/webhook/test-helpers";

afterEach(() => {
	mock.restore();
});

test("trigger posts to /api/webhook/v1/trigger", async () => {
	const fetchMock = mockFetch(jsonResponse(triggerResponseFixture()));

	await createClient().webhook.trigger({
		event: "domain.created",
		payload: { domainId: "dom_1" },
	});

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/webhook/v1/trigger");
	assert.equal(call.method, "POST");

	const body = parseBody(call.body) as Record<string, unknown>;
	assert.equal(body.event, "domain.created");
	assert.deepEqual(body.payload, { domainId: "dom_1" });
});
