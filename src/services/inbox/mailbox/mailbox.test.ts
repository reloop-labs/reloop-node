import assert from "node:assert/strict";
import { test } from "bun:test";
import { createClient } from "@/services/inbox/mailbox/test-helpers";

const WIRE_METHODS = ["list", "get", "create", "update", "delete"] as const;

test("mailboxes module exposes exactly the five backend wire methods", () => {
	const mailboxes = createClient().inbox.mailboxes;

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof mailboxes[name],
			"function",
			`expected mailboxes.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(mailboxes),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (mailboxes as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"Mailbox module must not expose extra methods beyond the wire contract",
	);
});
