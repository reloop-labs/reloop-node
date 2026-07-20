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
} from "@/services/domain/test-helpers";

afterEach(() => {
	mock.restore();
});

test("get: GET /api/domain/v1/:id", async () => {
	const payload = domainFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { domain, domainError } = await createClient().domain.get(DOMAIN_ID);

	assert.equal(domainError, null);
	assert.deepEqual(domain, payload);
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/domain/v1/${DOMAIN_ID}`,
	);
});

test("get: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().domain.get(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
