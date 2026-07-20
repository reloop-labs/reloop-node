import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "bun:test";
import { WebhookService, WebhookSignatureVerificationError } from "@/index";
import {
	verifyWebhook,
	WEBHOOK_SIGNATURE_HEADER,
} from "@/services/webhook/verify/verify";

function signPayload(secret: string, timestamp: string, payload: string) {
	const signature = createHmac("sha256", secret)
		.update(`${timestamp}.${payload}`)
		.digest("hex");
	return `t=${timestamp},v1=${signature}`;
}

const secret = "whsec_test_secret";
const payload = JSON.stringify({
	id: "evt_123456789",
	event: "domain.created",
	payload: { domainId: "dom_1" },
	timestamp: 1_735_689_600,
});

test("verify accepts valid signature header", () => {
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const header = signPayload(secret, timestamp, payload);

	const event = verifyWebhook({
		payload,
		headers: { [WEBHOOK_SIGNATURE_HEADER]: header },
		secret,
	});

	assert.equal(event.id, "evt_123456789");
	assert.equal(event.event, "domain.created");
	assert.deepEqual(event.payload, { domainId: "dom_1" });
});

test("WebhookService.constructEvent verifies signature", () => {
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const header = signPayload(secret, timestamp, payload);

	const event = WebhookService.constructEvent(payload, header, secret);

	assert.equal(event.event, "domain.created");
});

test("verify rejects wrong secret", () => {
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const header = signPayload(secret, timestamp, payload);

	assert.throws(
		() =>
			verifyWebhook({
				payload,
				headers: { [WEBHOOK_SIGNATURE_HEADER]: header },
				secret: "wrong_secret",
			}),
		WebhookSignatureVerificationError,
	);
});

test("verify rejects expired timestamp", () => {
	const timestamp = String(Math.floor(Date.now() / 1000) - 600);
	const header = signPayload(secret, timestamp, payload);

	assert.throws(
		() =>
			verifyWebhook({
				payload,
				headers: { [WEBHOOK_SIGNATURE_HEADER]: header },
				secret,
				tolerance: 300,
			}),
		(err: unknown) =>
			err instanceof WebhookSignatureVerificationError &&
			/tolerance/i.test((err as Error).message),
	);
});

test("verify rejects malformed signature header", () => {
	assert.throws(
		() =>
			verifyWebhook({
				payload,
				headers: { [WEBHOOK_SIGNATURE_HEADER]: "invalid-header" },
				secret,
			}),
		(err: unknown) =>
			err instanceof WebhookSignatureVerificationError &&
			/Invalid X-Webhook-Signature/i.test((err as Error).message),
	);
});

test("verify rejects invalid json payload", () => {
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const badPayload = "not-json";
	const header = signPayload(secret, timestamp, badPayload);

	assert.throws(
		() =>
			verifyWebhook({
				payload: badPayload,
				headers: { [WEBHOOK_SIGNATURE_HEADER]: header },
				secret,
			}),
		(err: unknown) =>
			err instanceof WebhookSignatureVerificationError &&
			/not valid JSON/i.test((err as Error).message),
	);
});

test("verify rejects missing signature header", () => {
	assert.throws(
		() =>
			verifyWebhook({
				payload,
				headers: {},
				secret,
			}),
		(err: unknown) =>
			err instanceof WebhookSignatureVerificationError &&
			/Missing x-webhook-signature/i.test((err as Error).message),
	);
});
