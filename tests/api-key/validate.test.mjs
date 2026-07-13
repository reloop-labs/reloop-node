import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { ReloopValidationError } from "../../dist/index.js";
import { createClient, mockFetch } from "./_helpers.mjs";

afterEach(() => {
	mock.restoreAll();
});

function assertNoFetch(fetchMock) {
	assert.equal(fetchMock.mock.calls.length, 0, "expected no HTTP call");
}

test("create: empty name throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	const reloop = createClient();

	await assert.rejects(
		() => reloop.apiKey.create({ name: "" }),
		(err) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.equal(err.field, "name");
			assert.match(err.message, /name/i);
			return true;
		},
	);
	assertNoFetch(fetchMock);
});

test("create: whitespace-only name throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.create({ name: "   " }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("create: missing params throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		// @ts-expect-error intentional invalid call
		() => createClient().apiKey.create(),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("create: name longer than 255 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.create({ name: "x".repeat(256) }),
		(err) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.match(err.message, /255/);
			return true;
		},
	);
	assertNoFetch(fetchMock);
});

test("get: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.get(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("get: non-string id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		// @ts-expect-error intentional
		() => createClient().apiKey.get(null),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("update: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.update("  ", { name: "ok" }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("update: empty name throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.update("key_1", { name: "" }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("delete: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.delete(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("rotate: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.rotate(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("enable: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.enable(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("disable: empty id throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.disable(""),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("list: page < 1 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.list({ page: 0 }),
		(err) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.equal(err.field, "page");
			return true;
		},
	);
	assertNoFetch(fetchMock);
});

test("list: limit > 100 throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.list({ limit: 101 }),
		(err) => {
			assert.ok(err instanceof ReloopValidationError);
			assert.equal(err.field, "limit");
			return true;
		},
	);
	assertNoFetch(fetchMock);
});

test("list: non-boolean enabled throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		// @ts-expect-error intentional
		() => createClient().apiKey.list({ enabled: "yes" }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("list: empty userId throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().apiKey.list({ userId: "  " }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("create: trims name before sending", async () => {
	const fetchMock = mockFetch(
		new Response(
			JSON.stringify({
				id: "key_1",
				name: "Trimmed",
				key: "rl_x",
				enabled: true,
				createdAt: "2026-01-01T00:00:00.000Z",
				updatedAt: "2026-01-01T00:00:00.000Z",
				permissions: null,
				object: "api_key",
				event: "evt_1",
			}),
			{ status: 201, headers: { "Content-Type": "application/json" } },
		),
	);

	await createClient().apiKey.create({ name: "  Trimmed  " });

	const body = JSON.parse(fetchMock.mock.calls[0].arguments[1].body);
	assert.equal(body.name, "Trimmed");
});
