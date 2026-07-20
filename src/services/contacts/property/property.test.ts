import assert from "node:assert/strict";
import { test } from "bun:test";
import { createClient } from "@/services/contacts/property/test-helpers";

const WIRE_METHODS = ["create", "list", "update", "delete"] as const;

test("properties module exposes exactly the four backend wire methods", () => {
	const { properties } = createClient().contacts;

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof properties[name],
			"function",
			`expected properties.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(properties),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (properties as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"Property module must not expose extra methods beyond the wire contract",
	);
});
