import assert from "node:assert/strict";
import { mock } from "bun:test";
import { Reloop } from "@/index";
import type { ReloopClientOptions } from "@/core/types";

export const BASE_URL = "https://reloop.sh";
export const TEST_API_KEY = "rl_test";
export const CONTACT_ID = "con_123456789";

export function contactFixture(overrides: Record<string, unknown> = {}) {
	return {
		object: "contact" as const,
		id: CONTACT_ID,
		email: "john.doe@example.com",
		firstName: "John",
		lastName: "Doe",
		status: "subscribed" as const,
		properties: { company: "Reloop" },
		groups: [{ id: "grp_123", name: "Beta Testers" }],
		channels: [
			{
				id: "chn_123",
				name: "Newsletter",
				subscription: "opt_in" as const,
			},
		],
		suppressionReason: null,
		suppressedAt: null,
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
		...overrides,
	};
}

export function contactResponseFixture(overrides: Record<string, unknown> = {}) {
	return {
		...contactFixture(),
		event: "evt_1",
		...overrides,
	};
}

export function listResponseFixture(overrides: Record<string, unknown> = {}) {
	return {
		object: "contact" as const,
		contacts: [contactFixture()],
		total: 1,
		page: 1,
		limit: 10,
		totalContacts: 1,
		subscribedContacts: 1,
		unsubscribedContacts: 0,
		event: "evt_list",
		...overrides,
	};
}

export function deleteResponseFixture(overrides: Record<string, unknown> = {}) {
	return {
		success: true,
		object: "contact" as const,
		id: CONTACT_ID,
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
