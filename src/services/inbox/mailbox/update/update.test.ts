import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	getCall,
	jsonResponse,
	MAILBOX_ID,
	mockFetch,
	parseBody,
	successResponseFixture,
} from "@/services/inbox/mailbox/test-helpers";

afterEach(() => mock.restore());

test("update: PATCH /api/inbox/v1/mailboxes/:id", async () => {
	const payload = successResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { mailbox, mailboxError } = await createClient().inbox.mailboxes.update(
		MAILBOX_ID,
		{ status: "disabled" },
	);

	assert.equal(mailboxError, null);
	assert.deepEqual(mailbox, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, `https://reloop.sh/api/inbox/v1/mailboxes/${MAILBOX_ID}`);
	assert.equal(call.method, "PATCH");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), { status: "disabled" });
});

test("update: empty body throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().inbox.mailboxes.update(MAILBOX_ID, {}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
