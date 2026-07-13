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

test("constructs with apiKey only", () => {
	const reloop = new Reloop({ apiKey: "rl_test" });
	assert.ok(reloop);
	assert.ok(reloop.apiKey);
	assert.equal(typeof reloop.apiKey.create, "function");
});

test("missing apiKey throws", () => {
	assert.throws(() => new Reloop({}), {
		message: /apiKey/i,
	});
});

test("empty apiKey throws", () => {
	assert.throws(() => new Reloop({ apiKey: "" }), {
		message: /apiKey/i,
	});
});

test("whitespace-only apiKey throws", () => {
	assert.throws(() => new Reloop({ apiKey: "   " }), {
		message: /apiKey/i,
	});
});

test("key alias is not accepted as a substitute for apiKey", () => {
	assert.throws(() => new Reloop({ key: "rl_legacy" }), {
		message: /apiKey/i,
	});
});

test("baseUrl is used for requests", async () => {
	const fetchMock = mockFetch(
		Response.json({
			success: true,
			messageId: "msg_1",
			status: "sent",
			timestamp: "2026-01-01T00:00:00.000Z",
			id: "log_1",
		}),
	);

	const reloop = new Reloop({
		apiKey: "rl_test",
		baseUrl: "https://custom.example",
	});
	await reloop.mail.send({
		from: "a@b.com",
		to: "c@d.com",
		subject: "Hi",
	});

	assert.equal(
		fetchMock.mock.calls[0]?.[0],
		"https://custom.example/api/mail/v1/send",
	);
	assert.equal(
		fetchMock.mock.calls[0]?.[1]?.headers?.get?.("x-api-key") ??
			new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get(
				"x-api-key",
			),
		"rl_test",
	);
});

test("url alias does not set the base URL", async () => {
	const fetchMock = mockFetch(
		Response.json({
			success: true,
			messageId: "msg_1",
			status: "sent",
			timestamp: "2026-01-01T00:00:00.000Z",
			id: "log_1",
		}),
	);

	const reloop = new Reloop({
		apiKey: "rl_test",
		url: "https://should-not-be-used.example",
	});
	await reloop.mail.send({
		from: "a@b.com",
		to: "c@d.com",
		subject: "Hi",
	});

	assert.equal(
		fetchMock.mock.calls[0]?.[0],
		"https://reloop.sh/api/mail/v1/send",
	);
});

test("default baseUrl is https://reloop.sh", async () => {
	const fetchMock = mockFetch(
		Response.json({
			success: true,
			messageId: "msg_1",
			status: "sent",
			timestamp: "2026-01-01T00:00:00.000Z",
			id: "log_1",
		}),
	);

	const reloop = new Reloop({ apiKey: "rl_test" });
	await reloop.mail.send({
		from: "a@b.com",
		to: "c@d.com",
		subject: "Hi",
	});

	assert.equal(
		fetchMock.mock.calls[0]?.[0],
		"https://reloop.sh/api/mail/v1/send",
	);
});

test("credential is not a public field on Reloop or apiKey module", () => {
	const reloop = new Reloop({ apiKey: "rl_secret_value" });

	assert.equal(reloop.apiKey === "rl_secret_value", false);
	assert.notEqual(typeof reloop.apiKey, "string");

	// Own properties (including non-enumerable) must not leak the secret
	const own = Object.getOwnPropertyNames(reloop);
	for (const name of own) {
		assert.notEqual(reloop[name], "rl_secret_value");
	}

	// apiKey is the resource module, not the secret string
	assert.equal(typeof reloop.apiKey.create, "function");
});

test("ReloopClient is not constructable from the public package surface", async () => {
	const mod = await import("../dist/index.js");
	assert.equal(mod.ReloopClient, undefined);
});
