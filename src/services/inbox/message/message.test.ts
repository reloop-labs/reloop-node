import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	assertAuthAndJson,
	createClient,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
	sendResponseFixture,
} from "@/services/inbox/message/test-helpers";

afterEach(() => mock.restore());

const WIRE_METHODS = [
	"list",
	"listSent",
	"get",
	"batch",
	"getRaw",
	"getAttachment",
	"update",
	"setRead",
	"setStar",
	"delete",
	"send",
	"cancelPending",
	"reply",
	"replyAll",
	"forward",
] as const;

test("messages module exposes exactly the fifteen backend wire methods", () => {
	const messages = createClient().inbox.messages;

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof messages[name],
			"function",
			`expected messages.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(messages),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (messages as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"Message module must not expose extra methods beyond the wire contract",
	);
});

test("send: POST /api/inbox/v1/messages/send", async () => {
	const payload = sendResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { message, messageError } = await createClient().inbox.messages.send({
		mailboxId: "mbx_123456789",
		to: "user@example.com",
		subject: "Hello",
		html: "<p>Hi</p>",
	});

	assert.equal(messageError, null);
	assert.deepEqual(message, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/inbox/v1/messages/send");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), {
		mailboxId: "mbx_123456789",
		to: "user@example.com",
		subject: "Hello",
		html: "<p>Hi</p>",
	});
});
