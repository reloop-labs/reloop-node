import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertNoFetch,
	createClient,
	DOMAIN_ID,
	domainFixture,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
} from "@/services/domain/test-helpers";

afterEach(() => {
	mock.restore();
});

test("update: PATCH /api/domain/v1/:id", async () => {
	const payload = domainFixture({ isClickTrackingEnabled: false });
	const fetchMock = mockFetch(jsonResponse(payload));

	const { domain, domainError } = await createClient().domain.update(
		DOMAIN_ID,
		{ click_tracking: false, open_tracking: true },
	);

	assert.equal(domainError, null);
	assert.deepEqual(domain, payload);
	assert.deepEqual(parseBody(getCall(fetchMock).body), {
		click_tracking: false,
		open_tracking: true,
	});
});

test("update: empty body throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().domain.update(DOMAIN_ID, {}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
