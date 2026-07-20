import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertNoFetch,
	createClient,
	getCall,
	jsonResponse,
	MAILBOX_ID,
	mockFetch,
	successResponseFixture,
} from "@/services/inbox/mailbox/test-helpers";

afterEach(() => mock.restore());

test("delete: DELETE /api/inbox/v1/mailboxes/:id", async () => {
	const payload = successResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { mailbox, mailboxError } = await createClient().inbox.mailboxes.delete(
		MAILBOX_ID,
	);

	assert.equal(mailboxError, null);
	assert.deepEqual(mailbox, payload);
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/inbox/v1/mailboxes/${MAILBOX_ID}`,
	);
	assert.equal(getCall(fetchMock).method, "DELETE");
});

test("delete: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().inbox.mailboxes.delete(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
