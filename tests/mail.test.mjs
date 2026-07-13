import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { Reloop } from "@/index";

function mockFetch(response) {
	const fn = mock(async () => response);
	globalThis.fetch = fn;
	return fn;
}

afterEach(() => {
	mock.restore();
});

test("send posts to /api/mail/v1/send with snake_case body", async () => {
	const fetchMock = mockFetch(
		Response.json({
			success: true,
			messageId: "msg_123456789",
			status: "sent",
			timestamp: "2026-01-01T00:00:00.000Z",
			id: "log_123456789",
		}),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	const { response, error } = await reloop.mail.send({
		from: "Reloop <hello@send.example.com>",
		to: "user@example.com",
		subject: "Welcome to Reloop",
		html: "<p>Thanks for signing up.</p>",
		text: "Thanks for signing up.",
		reply_to: "support@example.com",
		tags: [{ name: "campaign", value: "welcome" }],
	});

	assert.equal(error, null);
	assert.equal(response?.success, true);
	assert.equal(response?.messageId, "msg_123456789");
	assert.equal(response?.id, "log_123456789");
	assert.equal(
		fetchMock.mock.calls[0]?.[0],
		"https://reloop.sh/api/mail/v1/send",
	);
	assert.equal(fetchMock.mock.calls[0]?.[1]?.method, "POST");

	const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body);
	assert.equal(body.from, "Reloop <hello@send.example.com>");
	assert.equal(body.to, "user@example.com");
	assert.equal(body.reply_to, "support@example.com");
	assert.deepEqual(body.tags, [{ name: "campaign", value: "welcome" }]);
});

test("send supports template variables", async () => {
	const fetchMock = mockFetch(
		Response.json({
			success: true,
			messageId: "msg_1",
			status: "sent",
			timestamp: "2026-01-01T00:00:00.000Z",
			id: "log_1",
		}),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.mail.send({
		from: "hello@send.example.com",
		to: ["user@example.com", "admin@example.com"],
		subject: "Your weekly digest",
		template: {
			id: "tpl_123456789",
			variables: { first_name: "Ada" },
		},
	});

	const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body);
	assert.deepEqual(body.to, ["user@example.com", "admin@example.com"]);
	assert.equal(body.template.id, "tpl_123456789");
	assert.equal(body.template.variables.first_name, "Ada");
});
