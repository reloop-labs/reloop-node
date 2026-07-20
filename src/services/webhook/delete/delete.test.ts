import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	deleteResponseFixture,
	getCall,
	jsonResponse,
	mockFetch,
	WEBHOOK_ID,
} from "@/services/webhook/test-helpers";

afterEach(() => {
	mock.restore();
});

test("delete removes webhook", async () => {
	const fetchMock = mockFetch(jsonResponse(deleteResponseFixture()));

	await createClient().webhook.delete(WEBHOOK_ID);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/webhook/v1/${WEBHOOK_ID}`);
	assert.equal(call.method, "DELETE");
});
