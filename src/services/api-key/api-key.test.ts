import assert from "node:assert/strict";
import { test } from "bun:test";
import { createClient } from "@/services/api-key/test-helpers";

const WIRE_METHODS = [
	"create",
	"list",
	"get",
	"update",
	"delete",
	"rotate",
	"enable",
	"disable",
] as const;

test("apiKey module exposes exactly the eight backend wire methods", () => {
	const { apiKey } = createClient();

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof apiKey[name],
			"function",
			`expected apiKey.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(apiKey),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (apiKey as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"ApiKey module must not expose extra methods beyond the wire contract",
	);
});

test("apiKey.pause is not part of the public module", () => {
	const { apiKey } = createClient();
	assert.equal("pause" in apiKey, false);
	assert.equal(
		(apiKey as { pause?: unknown }).pause,
		undefined,
	);
});
