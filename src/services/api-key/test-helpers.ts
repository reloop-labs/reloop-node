

import assert from "node:assert/strict";
import { mock } from "node:test";
import { Reloop } from "reloop-email";
import type { ReloopClientOptions } from "#src/core/types";

export const BASE_URL = "https://reloop.sh";
export const TEST_API_KEY = "rl_test";
export const KEY_ID = "key_123456789";

export function apiKeyFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: KEY_ID,
		name: "Production Key",
		start: "rl_live",
		prefix: "rl",
		refillInterval: null,
		refillAmount: null,
		lastRefillAt: null,
		enabled: true,
		rateLimitEnabled: false,
		rateLimitTimeWindow: 0,
		rateLimitMax: 0,
		requestCount: 0,
		remaining: null,
		lastRequest: null,
		expiresAt: null,
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
		permissions: null,
		metadata: null,
		object: "api_key" as const,
		event: "evt_1",
		...overrides,
	};
}

export function apiKeyWithKeyFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: KEY_ID,
		name: "Production Key",
		key: "rl_live_abc123def456",
		enabled: true,
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
		permissions: null,
		object: "api_key" as const,
		event: "evt_1",
		...overrides,
	};
}

export function listResponseFixture(overrides: Record<string, unknown> = {}) {
	return {
		object: "api_key" as const,
		apiKeys: [apiKeyFixture()],
		total: 1,
		page: 1,
		limit: 10,
		event: "evt_list",
		...overrides,
	};
}

export function deleteResponseFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: KEY_ID,
		message: "API key deleted",
		object: "api_key" as const,
		event: "evt_delete",
		...overrides,
	};
}

export function createClient(options: Partial<ReloopClientOptions> = {}) {
	return new Reloop({
		apiKey: TEST_API_KEY,
		baseUrl: BASE_URL,
		...options,
	});
}

export function mockFetch(
	responseOrFn: Response | ((url: string | URL, init?: RequestInit) => Response | Promise<Response>),
) {
	return mock.method(globalThis, "fetch", async (url: string | URL, init?: RequestInit) => {
		if (typeof responseOrFn === "function") {
			return responseOrFn(url, init);
		}
		return responseOrFn;
	});
}

export function jsonResponse(body: unknown, status = 200, statusText = "OK") {
	return new Response(JSON.stringify(body), {
		status,
		statusText,
		headers: { "Content-Type": "application/json" },
	});
}

export function errorJsonResponse(
	body: unknown = { message: "Unauthorized" },
	status = 403,
	statusText = "Forbidden",
) {
	return jsonResponse(body, status, statusText);
}

export function getCall(
	fetchMock: ReturnType<typeof mockFetch>,
	index = 0,
) {
	const call = fetchMock.mock.calls[index];
	assert.ok(call, `expected fetch call at index ${index}`);
	const url = call.arguments[0];
	const init = (call.arguments[1] ?? {}) as RequestInit;
	const headers =
		init.headers instanceof Headers
			? init.headers
			: new Headers(init.headers ?? undefined);
	return {
		url: String(url),
		method: init.method ?? "GET",
		headers,
		body: init.body,
		init,
	};
}

export function assertAuthAndJson(headers: Headers) {
	assert.equal(headers.get("x-api-key"), TEST_API_KEY);
	assert.equal(headers.get("Content-Type"), "application/json");
}

export function parseBody(body: unknown) {
	assert.equal(typeof body, "string");
	return JSON.parse(body as string) as unknown;
}

export function assertNoFetch(fetchMock: ReturnType<typeof mockFetch>) {
	assert.equal(fetchMock.mock.calls.length, 0, "expected no HTTP call");
}
