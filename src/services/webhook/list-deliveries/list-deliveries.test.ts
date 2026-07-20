import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	deliveryListResponseFixture,
	getCall,
	jsonResponse,
	mockFetch,
	WEBHOOK_ID,
} from "@/services/webhook/test-helpers";

afterEach(() => {
	mock.restore();
});

test("listDeliveries uses deliveries route", async () => {
	const fetchMock = mockFetch(jsonResponse(deliveryListResponseFixture()));

	await createClient().webhook.listDeliveries(WEBHOOK_ID, {
		page: 1,
		limit: 10,
		status: "failed",
	});

	const call = getCall(fetchMock);
	assert.equal(
		call.url,
		`https://reloop.sh/api/webhook/v1/${WEBHOOK_ID}/deliveries?page=1&limit=10&status=failed`,
	);
	assert.equal(call.method, "GET");
});
