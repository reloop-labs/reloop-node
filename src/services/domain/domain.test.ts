import assert from "node:assert/strict";
import { test } from "bun:test";
import { createClient } from "@/services/domain/test-helpers";

const WIRE_METHODS = [
	"create",
	"list",
	"get",
	"update",
	"delete",
	"verify",
] as const;

test("domain module exposes exactly the six public wire methods", () => {
	const { domain } = createClient();

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof domain[name],
			"function",
			`expected domain.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(domain),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (domain as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"Domain module must not expose extra methods beyond the wire contract",
	);
});

test("domain.getNameservers and domain.forwardDns are not part of the public module", () => {
	const { domain } = createClient();
	assert.equal("getNameservers" in domain, false);
	assert.equal("forwardDns" in domain, false);
	assert.equal(
		(domain as { getNameservers?: unknown }).getNameservers,
		undefined,
	);
	assert.equal((domain as { forwardDns?: unknown }).forwardDns, undefined);
});
