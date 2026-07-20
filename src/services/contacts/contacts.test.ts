import assert from "node:assert/strict";
import { test } from "bun:test";
import { createClient } from "@/services/contacts/test-helpers";

const WIRE_METHODS = ["create", "list", "get", "update", "delete"] as const;

test("contacts module exposes exactly the five backend wire methods", () => {
	const contacts = createClient().contacts;

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof contacts[name],
			"function",
			`expected contacts.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(contacts),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (contacts as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"Contacts module must not expose extra methods beyond the wire contract",
	);
});
