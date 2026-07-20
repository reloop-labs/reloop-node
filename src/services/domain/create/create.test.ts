import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { ReloopValidationError } from "@/index";
import {
	assertAuthAndJson,
	assertNoFetch,
	createClient,
	domainFixture,
	errorJsonResponse,
	getCall,
	jsonResponse,
	mockFetch,
	parseBody,
} from "@/services/domain/test-helpers";

afterEach(() => {
	mock.restore();
});

test("create: POST /api/domain/v1/create with body", async () => {
	const payload = domainFixture();
	const fetchMock = mockFetch(jsonResponse(payload));

	const { domain, domainError } = await createClient().domain.create({
		domain: "send.example.com",
		click_tracking: true,
		open_tracking: true,
		tls: "opportunistic",
		sending_email: true,
		receiving_email: false,
	});

	assert.equal(domainError, null);
	assert.deepEqual(domain, payload);

	const call = getCall(fetchMock);
	assert.equal(call.url, "https://reloop.sh/api/domain/v1/create");
	assert.equal(call.method, "POST");
	assertAuthAndJson(call.headers);
	assert.deepEqual(parseBody(call.body), {
		domain: "send.example.com",
		click_tracking: true,
		open_tracking: true,
		tls: "opportunistic",
		sending_email: true,
		receiving_email: false,
	});
});

test("create: returns domainError on non-OK", async () => {
	mockFetch(errorJsonResponse({ message: "Domain already exists" }, 409));

	const { domain, domainError } = await createClient().domain.create({
		domain: "send.example.com",
	});

	assert.equal(domain, null);
	assert.equal(domainError?.status, 409);
});

test("create: invalid domain throws before fetch", async () => {
	const fetchMock = mockFetch(new Response("{}"));
	await assert.rejects(
		() => createClient().domain.create({ domain: "not a domain" }),
		ReloopValidationError,
	);
	assertNoFetch(fetchMock);
});

test("create: lowercases and trims domain", async () => {
	const fetchMock = mockFetch(jsonResponse(domainFixture()));

	await createClient().domain.create({ domain: "  Send.Example.COM  " });

	assert.deepEqual(parseBody(getCall(fetchMock).body), {
		domain: "send.example.com",
	});
});
