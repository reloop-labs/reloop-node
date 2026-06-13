import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { Reloop } from "../dist/index.js";

function mockFetch(response) {
	return mock.method(globalThis, "fetch", async () => response);
}

afterEach(() => {
	mock.restoreAll();
});

test("create posts to /api/api-key/v1/", async () => {
	const fetchMock = mockFetch(
		Response.json({
			id: "key_1",
			name: "Production Key",
			key: "rl_live_secret",
			enabled: true,
			createdAt: "2026-01-01T00:00:00.000Z",
			updatedAt: "2026-01-01T00:00:00.000Z",
			permissions: null,
			object: "api_key",
			event: "evt_1",
		}),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	const { response, error } = await reloop.apiKey.create({ name: "Production Key" });

	assert.equal(error, null);
	assert.equal(response?.id, "key_1");
	assert.equal(fetchMock.mock.calls[0]?.arguments[0], "https://reloop.sh/api/api-key/v1/");
	assert.equal(fetchMock.mock.calls[0]?.arguments[1]?.method, "POST");
});

test("list builds query params", async () => {
	const fetchMock = mockFetch(
		Response.json({
			object: "api_key",
			apiKeys: [],
			total: 0,
			page: 2,
			limit: 5,
			event: "evt_1",
		}),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	const { error } = await reloop.apiKey.list({
		page: 2,
		limit: 5,
		enabled: true,
		q: "prod",
	});

	assert.equal(error, null);
	assert.equal(
		fetchMock.mock.calls[0]?.arguments[0],
		"https://reloop.sh/api/api-key/v1/?page=2&limit=5&enabled=true&q=prod",
	);
});

test("pause calls disable route", async () => {
	const fetchMock = mockFetch(
		Response.json({
			id: "key_1",
			name: "Production Key",
			enabled: false,
			object: "api_key",
			event: "evt_1",
		}),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.apiKey.pause("key_1");

	assert.equal(
		fetchMock.mock.calls[0]?.arguments[0],
		"https://reloop.sh/api/api-key/v1/disable/key_1",
	);
	assert.equal(fetchMock.mock.calls[0]?.arguments[1]?.method, "POST");
});

test("rotate uses rotate route", async () => {
	const fetchMock = mockFetch(
		Response.json({
			id: "key_1",
			name: "Production Key",
			key: "rl_live_rotated",
			enabled: true,
			createdAt: "2026-01-01T00:00:00.000Z",
			updatedAt: "2026-01-01T00:00:00.000Z",
			permissions: null,
			object: "api_key",
			event: "evt_1",
		}),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	await reloop.apiKey.rotate("key_1");

	assert.equal(
		fetchMock.mock.calls[0]?.arguments[0],
		"https://reloop.sh/api/api-key/v1/rotate/key_1",
	);
});
