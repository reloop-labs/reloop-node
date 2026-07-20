import assert from "node:assert/strict";
import { test } from "bun:test";
import { createClient } from "@/services/contacts/channel/test-helpers";

const WIRE_METHODS = [
	"create",
	"list",
	"get",
	"update",
	"delete",
	"addContact",
	"updateSubscription",
] as const;

test("channels module exposes exactly the seven backend wire methods", () => {
	const { channels } = createClient().contacts;

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof channels[name],
			"function",
			`expected channels.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(channels),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (channels as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"Channel module must not expose extra methods beyond the wire contract",
	);
});
