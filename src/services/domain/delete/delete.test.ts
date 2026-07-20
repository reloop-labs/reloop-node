import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
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

test("delete: DELETE /api/domain/v1/:id", async () => {
	const payload = domainFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { domain, domainError } =
		await createClient().domain.delete(DOMAIN_ID);

	assert.equal(domainError, null);
	assert.deepEqual(domain, payload);
	assert.equal(getCall(fetchMock).method, "DELETE");
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/domain/v1/${DOMAIN_ID}`,
	);
});
