import assert from "node:assert/strict";
import { mock } from "bun:test";
import { Reloop } from "@/index";
import type { ReloopClientOptions } from "@/core/types";

export const BASE_URL = "https://reloop.sh";
export const TEST_API_KEY = "rl_test";
export const WEBHOOK_ID = "wh_123456789";
export const DELIVERY_ID = "del_123456789";

export function webhookFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: WEBHOOK_ID,
		name: "Production webhook",
		url: "https://example.com/webhooks/reloop",
		secret: "whsec_test",
		status: "active" as const,
		customHeaders: null,
		rateLimitEnabled: false,
		maxRequestsPerMinute: 60,
		maxRetries: 3,
		retryBackoffMultiplier: 2,
		filteringOptions: null,
		lastTriggeredAt: null,
		successCount: 0,
		failureCount: 0,
		consecutiveFailures: 0,
		events: ["domain.created"],
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
		...overrides,
	};
}

export function listResponseFixture(overrides: Record<string, unknown> = {}) {
	return {
		webhooks: [webhookFixture()],
		total: 1,
		page: 1,
		limit: 10,
		...overrides,
	};
}

export function deliveryListResponseFixture(
	overrides: Record<string, unknown> = {},
) {
	return {
		deliveries: [],
		total: 0,
		page: 1,
		limit: 10,
		...overrides,
	};
}

export function deleteResponseFixture(overrides: Record<string, unknown> = {}) {
	return {
		id: WEBHOOK_ID,
		message: "Webhook deleted",
		...overrides,
	};
}

export function triggerResponseFixture(overrides: Record<string, unknown> = {}) {
	return {
		success: true,
		message: "Webhook triggered",
		jobId: "job_1",
		...overrides,
	};
}

export function retryDeliveryResponseFixture(
	overrides: Record<string, unknown> = {},
) {
	return {
		success: true,
		message: "Delivery re-enqueued",
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

export type FetchMock = ReturnType<typeof mock<typeof fetch>>;

export function mockFetch(
	responseOrFn:
		| Response
		| ((
				url: string | URL | Request,
				init?: RequestInit,
		  ) => Response | Promise<Response>),
): FetchMock {
	const fn = mock(async (url: string | URL | Request, init?: RequestInit) => {
		if (typeof responseOrFn === "function") {
			return responseOrFn(url, init);
		}
		return responseOrFn;
	}) as FetchMock;
	globalThis.fetch = fn as unknown as typeof fetch;
	return fn;
}

export function restoreFetch() {
	mock.restore();
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

export function getCall(fetchMock: FetchMock, index = 0) {
	const call = fetchMock.mock.calls[index];
	assert.ok(call, `expected fetch call at index ${index}`);
	const url = call[0];
	const init = (call[1] ?? {}) as RequestInit;
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

export function assertNoFetch(fetchMock: FetchMock) {
	assert.equal(fetchMock.mock.calls.length, 0, "expected no HTTP call");
}
