import assert from "node:assert/strict";
import { afterEach, mock, test } from "bun:test";
import { WebhookService } from "@/services/webhook/webhook";
import {
	createClient,
	jsonResponse,
	mockFetch,
	parseBody,
	webhookFixture,
} from "@/services/webhook/test-helpers";

afterEach(() => {
	mock.restore();
});

const WIRE_METHODS = [
	"create",
	"list",
	"get",
	"update",
	"delete",
	"pause",
	"enable",
	"disable",
	"trigger",
	"listDeliveries",
	"retryDelivery",
	"verify",
] as const;

test("webhook module exposes exactly the twelve public instance methods", () => {
	const { webhook } = createClient();

	for (const name of WIRE_METHODS) {
		assert.equal(
			typeof webhook[name],
			"function",
			`expected webhook.${name} to be a function`,
		);
	}

	const ownMethods = Object.getOwnPropertyNames(
		Object.getPrototypeOf(webhook),
	).filter((name) => {
		if (name === "constructor") return false;
		const value = (webhook as unknown as Record<string, unknown>)[name];
		return typeof value === "function";
	});

	assert.deepEqual(
		[...ownMethods].sort(),
		[...WIRE_METHODS].sort(),
		"Webhook module must not expose extra methods beyond the public contract",
	);
});

test("WebhookService.verify and constructEvent are static helpers", () => {
	assert.equal(typeof WebhookService.verify, "function");
	assert.equal(typeof WebhookService.constructEvent, "function");
});

test("pause enable and disable patch status", async () => {
	const fetchMock = mockFetch(jsonResponse(webhookFixture()));
	const { webhook } = createClient();

	await webhook.pause("wh_1");
	assert.equal(
		(parseBody(fetchMock.mock.calls[0]?.[1]?.body) as { status: string })
			.status,
		"paused",
	);

	await webhook.enable("wh_1");
	assert.equal(
		(parseBody(fetchMock.mock.calls[1]?.[1]?.body) as { status: string })
			.status,
		"active",
	);

	await webhook.disable("wh_1");
	assert.equal(
		(parseBody(fetchMock.mock.calls[2]?.[1]?.body) as { status: string })
			.status,
		"disabled",
	);
});
