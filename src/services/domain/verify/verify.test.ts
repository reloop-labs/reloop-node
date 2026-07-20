import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	DOMAIN_ID,
	getCall,
	jsonResponse,
	mockFetch,
	statusResponseFixture,
} from "@/services/domain/test-helpers";

afterEach(() => {
	mock.restore();
});

test("verify: POST /api/domain/v1/verify/:id", async () => {
	const payload = statusResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { domain, domainError } =
		await createClient().domain.verify(DOMAIN_ID);

	assert.equal(domainError, null);
	assert.deepEqual(domain, payload);
	assert.equal(getCall(fetchMock).method, "POST");
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/domain/v1/verify/${DOMAIN_ID}`,
	);
});
