import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	errorJsonResponse,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
	sendMailResponseFixture,
} from "@/services/mail/test-helpers";
import { ReloopValidationError } from "@/index";

afterEach(() => {
	mock.restore();
});

test("send: POST /api/mail/v1/send with snake_case body", async () => {
	const payload = sendMailResponseFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { response, emailError } = await createClient().mail.send({
		from: "Reloop <hello@send.example.com>",
		to: "user@example.com",
		subject: "Welcome to Reloop",
		html: "<p>Thanks for signing up.</p>",
		text: "Thanks for signing up.",
		reply_to: "support@example.com",
		tags: [{ name: "campaign", value: "welcome" }],
	});

	assert.equal(emailError, null);
	assert.deepEqual(response, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/mail/v1/send");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), {
		from: "Reloop <hello@send.example.com>",
		to: "user@example.com",
		subject: "Welcome to Reloop",
		html: "<p>Thanks for signing up.</p>",
		text: "Thanks for signing up.",
		reply_to: "support@example.com",
		tags: [{ name: "campaign", value: "welcome" }],
	});
});

test("send: supports template variables", async () => {
	const fetchMock = mockFetch(jsonResponse(sendMailResponseFixture({ id: "log_1" })));

	await createClient().mail.send({
		from: "hello@send.example.com",
		to: ["user@example.com", "admin@example.com"],
		subject: "Your weekly digest",
		template: {
			id: "tpl_123456789",
			variables: { first_name: "Ada" },
		},
	});

	const body = parseBody(getCall(fetchMock).body) as Record<string, unknown>;
	assert.deepEqual(body.to, ["user@example.com", "admin@example.com"]);
	assert.deepEqual(body.template, {
		id: "tpl_123456789",
		variables: { first_name: "Ada" },
	});
});

test("send: returns emailError on non-OK without throwing", async () => {
	mockFetch(
		errorJsonResponse(
			{ message: "Invalid from address", why: "Domain not verified" },
			400,
			"Bad Request",
		),
	);

	const { response, emailError } = await createClient().mail.send({
		from: "bad@example.com",
		to: "user@example.com",
		subject: "Hello",
	});

	assert.equal(response, null);
	assert.ok(emailError);
	assert.equal(emailError.status, 400);
	assert.equal(emailError.body.message, "Invalid from address");
});

test("send: empty from throws before fetch", async () => {
	const fetchMock = mockFetch(jsonResponse(sendMailResponseFixture()));
	await assert.rejects(
		() =>
			createClient().mail.send({
				from: "",
				to: "user@example.com",
				subject: "Hello",
			}),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("send: missing params throws before fetch", async () => {
	const fetchMock = mockFetch(jsonResponse(sendMailResponseFixture()));
	await assert.rejects(
		() => createClient().mail.send(undefined as never),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});
