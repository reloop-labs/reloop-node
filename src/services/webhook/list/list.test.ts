import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	getCall,
	jsonResponse,
	listResponseFixture,
	mockFetch,
} from "@/services/webhook/test-helpers";

afterEach(() => {
	mock.restore();
});

test("list builds query on /api/webhook/v1", async () => {
	const fetchMock = mockFetch(jsonResponse(listResponseFixture()));

	await createClient().webhook.list({ page: 1, limit: 10, status: "active" });

	const call = getCall(fetchMock);
	assert.equal(
		call.url,
		"https://reloop.sh/api/webhook/v1?page=1&limit=10&status=active",
	);
	assert.equal(call.method, "GET");
});

test("list without params uses /api/webhook/v1", async () => {
	const fetchMock = mockFetch(
		jsonResponse(listResponseFixture({ webhooks: [], total: 0 })),
	);

	await createClient().webhook.list();

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/webhook/v1");
});
