import assert from "node:assert/strict";
import { mock, test } from "bun:test";
import * as sdk from "@/index";
import ReloopDefault, { Reloop } from "@/index";

test("Reloop is the public entry (named + default)", () => {
	assert.equal(typeof Reloop, "function");
	assert.equal(ReloopDefault, Reloop);
	assert.equal(sdk.Reloop, Reloop);

	const reloop = new Reloop({ apiKey: "rl_test" });
	assert.equal(typeof reloop.apiKey.create, "function");
	assert.equal(typeof reloop.mail.send, "function");
});

test("Result helpers and error type are exported", () => {
	assert.equal(typeof sdk.ok, "function");
	assert.equal(typeof sdk.err, "function");
	assert.equal(typeof sdk.ReloopApiError, "function");
	assert.equal(typeof sdk.ReloopValidationError, "function");

	const okResult = sdk.ok({ id: "1" });
	assert.equal(okResult.error, null);
	assert.deepEqual(okResult.response, { id: "1" });

	const apiError = new sdk.ReloopApiError(400, "Bad Request", {
		message: "bad",
	});
	const errResult = sdk.err(apiError);
	assert.equal(errResult.response, null);
	assert.equal(errResult.error, apiError);

	const validation = new sdk.ReloopValidationError("bad name", "name");
	assert.equal(validation.name, "ReloopValidationError");
	assert.equal(validation.field, "name");
});

test("ReloopClient is not part of the public constructable surface", () => {
	assert.equal("ReloopClient" in sdk, false);
	assert.equal(sdk.ReloopClient, undefined);
});

test("ApiKeyService is not part of the public constructable surface", () => {
	assert.equal("ApiKeyService" in sdk, false);
	assert.equal(sdk.ApiKeyService, undefined);
});

test("mail.send returns response and emailError fields", async () => {
	const fetchMock = mock(async () =>
		Response.json({
			success: true,
			messageId: "msg_1",
			status: "sent",
			timestamp: "2026-01-01T00:00:00.000Z",
			id: "log_1",
		}),
	);
	globalThis.fetch = fetchMock;

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	const result = await reloop.mail.send({
		from: "a@b.com",
		to: "c@d.com",
		subject: "Hi",
	});

	assert.equal("response" in result, true);
	assert.equal("emailError" in result, true);
	assert.equal("error" in result, false);
	assert.equal(result.emailError, null);
	assert.equal(result.response?.messageId, "msg_1");

	mock.restore();
});

test("api-key resource is available only via Reloop.apiKey", () => {
	const reloop = new Reloop({ apiKey: "rl_test" });
	const methods = [
		"create",
		"list",
		"get",
		"update",
		"delete",
		"rotate",
		"enable",
		"disable",
	];
	for (const name of methods) {
		assert.equal(typeof reloop.apiKey[name], "function");
	}
	assert.equal(reloop.apiKey.pause, undefined);
});

test("inbox resources are available via Reloop.inbox", () => {
	const reloop = new Reloop({ apiKey: "rl_test" });
	assert.equal(typeof reloop.inbox.mailboxes.list, "function");
	assert.equal(typeof reloop.inbox.messages.send, "function");
	assert.equal(typeof reloop.inbox.threads.list, "function");
});

test("inbox.messages.send returns message and messageError fields", async () => {
	const fetchMock = mock(async () =>
		Response.json({
			success: true,
			messageId: "msg_1",
			status: "sent",
			timestamp: "2026-01-01T00:00:00.000Z",
			id: "log_1",
		}),
	);
	globalThis.fetch = fetchMock;

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	const result = await reloop.inbox.messages.send({
		mailboxId: "mbx_1",
		to: "user@example.com",
		subject: "Hi",
		text: "Hello",
	});

	assert.equal("message" in result, true);
	assert.equal("messageError" in result, true);
	assert.equal("error" in result, false);
	assert.equal(result.messageError, null);
	assert.equal(result.message?.messageId, "msg_1");

	mock.restore();
});
