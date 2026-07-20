import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	createMailboxResponseFixture,
	errorJsonResponse,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
} from "@/services/inbox/mailbox/test-helpers";

afterEach(() => mock.restore());

test("create: POST /api/inbox/v1/mailboxes/create", async () => {
	const payload = createMailboxResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { mailbox, mailboxError } = await createClient().inbox.mailboxes.create(
		{
			domainId: "dom_123456789",
			email: "hello@example.com",
			displayName: "Hello",
		},
	);

	assert.equal(mailboxError, null);
	assert.deepEqual(mailbox, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/inbox/v1/mailboxes/create");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), {
		domainId: "dom_123456789",
		email: "hello@example.com",
		displayName: "Hello",
	});
});

test("create: returns mailboxError on non-OK", async () => {
	mockFetch(errorJsonResponse({ message: "Mailbox exists" }, 409));

	const { mailbox, mailboxError } = await createClient().inbox.mailboxes.create(
		{
			domainId: "dom_123456789",
			email: "hello@example.com",
		},
	);

	assert.equal(mailbox, null);
	assert.equal(mailboxError?.status, 409);
});

test("create: missing params throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() =>
			createClient().inbox.mailboxes.create(
				undefined as unknown as { domainId: string; email: string },
			),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
