import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { Reloop } from "../dist/index.js";

function mockFetch(response) {
	return mock.method(globalThis, "fetch", async () => response);
}

afterEach(() => {
	mock.restoreAll();
});

test("create posts to /api/domain/v1/create", async () => {
	const fetchMock = mockFetch(
		Response.json({ id: "dom_1", object: "domain", domain: "send.example.com" }),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	const { response, error } = await reloop.domain.create({
		domain: "send.example.com",
		click_tracking: true,
	});

	assert.equal(error, null);
	assert.equal(response?.id, "dom_1");
	assert.equal(fetchMock.mock.calls.length, 1);
	assert.equal(fetchMock.mock.calls[0]?.arguments[0], "https://reloop.sh/api/domain/v1/create");
	assert.equal(fetchMock.mock.calls[0]?.arguments[1]?.method, "POST");
});

test("list builds query params", async () => {
	const fetchMock = mockFetch(
		Response.json({ object: "domain", domains: [], total: 0, page: 2, limit: 5, event: "evt_1" }),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	const { error } = await reloop.domain.list({
		page: 2,
		limit: 5,
		status: "active",
		q: "example",
	});

	assert.equal(error, null);
	assert.equal(
		fetchMock.mock.calls[0]?.arguments[0],
		"https://reloop.sh/api/domain/v1/list?page=2&limit=5&q=example&status=active",
	);
});

test("getNameservers calls /api/domain/v1/nameservers/:id", async () => {
	const fetchMock = mockFetch(
		Response.json({
			object: "domain_nameservers",
			domainId: "dom_1",
			domain: "send.example.com",
			nameservers: ["ns1.example.net", "ns2.example.net"],
			dnsProvider: "cloudflare",
			event: "evt_1",
		}),
	);

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });
	const { response, error } = await reloop.domain.getNameservers("dom_1");

	assert.equal(error, null);
	assert.equal(response?.dnsProvider, "cloudflare");
	assert.equal(
		fetchMock.mock.calls[0]?.arguments[0],
		"https://reloop.sh/api/domain/v1/nameservers/dom_1",
	);
});

test("verify and forwardDns use verify routes", async () => {
	const fetchMock = mockFetch(Response.json({ id: "dom_1", status: "verifying" }));

	const reloop = new Reloop({ apiKey: "rl_test", baseUrl: "https://reloop.sh" });

	await reloop.domain.verify("dom_1");
	assert.equal(
		fetchMock.mock.calls[0]?.arguments[0],
		"https://reloop.sh/api/domain/v1/verify/dom_1",
	);

	fetchMock.mock.restore();
	const forwardMock = mockFetch(Response.json({ success: true }));
	await reloop.domain.forwardDns("dom_1", { email: "admin@example.com" });
	assert.equal(
		forwardMock.mock.calls[0]?.arguments[0],
		"https://reloop.sh/api/domain/v1/verify/dom_1/forward-dns",
	);
});
