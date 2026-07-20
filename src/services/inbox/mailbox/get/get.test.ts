import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertNoFetch,
	createClient,
	getCall,
	jsonResponse,
	mailboxDetailFixture,
	MAILBOX_ID,
	mockFetch,
} from "@/services/inbox/mailbox/test-helpers";

afterEach(() => mock.restore());

test("get: GET /api/inbox/v1/mailboxes/:id", async () => {
	const payload = mailboxDetailFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { mailbox, mailboxError } = await createClient().inbox.mailboxes.get(
		MAILBOX_ID,
	);

	assert.equal(mailboxError, null);
	assert.deepEqual(mailbox, payload);
	assert.equal(
		getCall(fetchMock).url,
		`https://reloop.sh/api/inbox/v1/mailboxes/${MAILBOX_ID}`,
	);
});

test("get: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().inbox.mailboxes.get(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
