import assert from "node:assert/strict";
import { test } from "bun:test";
import { createClient } from "@/services/mail/test-helpers";

const WIRE_METHODS = ["send"] as const;

test("mail module exposes exactly the send wire method", () => {
	const { mail } = createClient();

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof mail[name],
			"function",
			`expected mail.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(mail),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (mail as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"Mail module must not expose extra methods beyond the wire contract",
	);
});
