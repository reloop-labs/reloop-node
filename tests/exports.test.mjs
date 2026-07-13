import assert from "node:assert/strict";
import { test } from "node:test";
import * as sdk from "../dist/index.js";
import ReloopDefault, { Reloop } from "../dist/index.js";

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
