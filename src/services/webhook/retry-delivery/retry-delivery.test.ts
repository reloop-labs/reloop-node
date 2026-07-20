import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	DELIVERY_ID,
	getCall,
	jsonResponse,
	mockFetch,
	retryDeliveryResponseFixture,
} from "@/services/webhook/test-helpers";

afterEach(() => {
	mock.restore();
});

test("retryDelivery uses deliveries retry route outside v1", async () => {
	const fetchMock = mockFetch(jsonResponse(retryDeliveryResponseFixture()));

	await createClient().webhook.retryDelivery(DELIVERY_ID);

	const call = getCall(fetchMock);
	assert.equal(
		call.url,
		`https://reloop.sh/api/webhook/deliveries/${DELIVERY_ID}/retry`,
	);
	assert.equal(call.method, "POST");
});
