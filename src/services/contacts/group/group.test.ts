import assert from "node:assert/strict";
import { test } from "bun:test";
import { createClient } from "@/services/contacts/group/test-helpers";

const WIRE_METHODS = [
	"create",
	"list",
	"get",
	"update",
	"delete",
	"listContacts",
	"addContact",
	"removeContact",
] as const;

test("groups module exposes exactly the eight backend wire methods", () => {
	const { groups } = createClient().contacts;

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof groups[name],
			"function",
			`expected groups.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(groups),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (groups as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"Group module must not expose extra methods beyond the wire contract",
	);
});
