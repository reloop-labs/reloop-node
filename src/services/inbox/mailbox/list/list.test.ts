import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	createClient,
	getCall,
	jsonResponse,
	mailboxFixture,
	mockFetch,
} from "@/services/inbox/mailbox/test-helpers";

afterEach(() => mock.restore());

test("list: GET /api/inbox/v1/mailboxes/list", async () => {
	const payload = [mailboxFixture()];
	const fetchMock = mockFetch(jsonResponse(payload));

	const { mailboxes, mailboxError } = await createClient().inbox.mailboxes.list();

	assert.equal(mailboxError, null);
	assert.deepEqual(mailboxes, payload);
	assert.equal(
		getCall(fetchMock).url,
		"https://reloop.sh/api/inbox/v1/mailboxes/list",
	);
});
