import assert from "node:assert/strict";
import { mock } from "bun:test";
import { Reloop } from "@/index";
import type { ReloopClientOptions } from "@/core/types";

export const BASE_URL = "https://reloop.sh";
export const TEST_API_KEY = "rl_test";

export function sendMailResponseFixture(
	overrides: Record<string, unknown> = {},
) {
	return {
		success: true,
		messageId: "msg_123456789",
		status: "sent",
		timestamp: "2026-01-01T00:00:00.000Z",
		id: "log_123456789",
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
	globalThis.fetch = fn;
	return fn;
}

export function getCall(fetchMock: FetchMock) {
	const call = fetchMock.mock.calls[0];
	assert.ok(call, "expected fetch to be called");
	const [url, init] = call;
	return {
		url: typeof url === "string" ? url : url.toString(),
		method: init?.method ?? "GET",
		headers: init?.headers,
		body: init?.body,
	};
}

export function parseBody(body: BodyInit | null | undefined): unknown {
	assert.ok(typeof body === "string", "expected string body");
	return JSON.parse(body);
}

export function jsonResponse(
	data: unknown,
	status = 200,
	statusText = "OK",
): Response {
	return Response.json(data, { status, statusText });
}

export function errorJsonResponse(
	body: Record<string, unknown>,
	status: number,
	statusText: string,
): Response {
	return Response.json(body, { status, statusText });
}

export function assertAuthAndJson(headers: HeadersInit | undefined): void {
	const h = new Headers(headers);
	assert.equal(h.get("x-api-key"), TEST_API_KEY);
	assert.equal(h.get("content-type"), "application/json");
}

export function assertNoFetch(fetchMock: FetchMock) {
	assert.equal(fetchMock.mock.calls.length, 0, "expected no HTTP call");
}
