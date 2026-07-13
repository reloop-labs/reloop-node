import { createHmac, timingSafeEqual } from "node:crypto";
import type { VerifyWebhookParams, WebhookEvent } from "#src/services/webhook/types";
import { WebhookSignatureVerificationError } from "#src/services/webhook/types";

export const WEBHOOK_SIGNATURE_HEADER = "x-webhook-signature";
export const WEBHOOK_TIMESTAMP_HEADER = "x-webhook-timestamp";

const DEFAULT_TOLERANCE_SECONDS = 300;

function getHeader(
	headers: Record<string, string | null | undefined>,
	name: string,
): string | null | undefined {
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === lower) {
			return value;
		}
	}
	return undefined;
}

function parseSignatureHeader(header: string): {
	timestamp: string;
	signatures: string[];
} {
	const signatures: string[] = [];
	let timestamp: string | undefined;

	for (const element of header.split(",")) {
		const trimmed = element.trim();
		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) continue;

		const prefix = trimmed.slice(0, eqIndex);
		const value = trimmed.slice(eqIndex + 1);

		if (prefix === "t") {
			timestamp = value;
		} else if (prefix === "v1") {
			signatures.push(value);
		}
	}

	if (!timestamp || signatures.length === 0) {
		throw new WebhookSignatureVerificationError(
			"Invalid X-Webhook-Signature header: expected t= and v1= values",
		);
	}

	return { timestamp, signatures };
}

function payloadToString(payload: string | Buffer): string {
	return typeof payload === "string" ? payload : payload.toString("utf8");
}

function computeExpectedSignature(
	secret: string,
	timestamp: string,
	payload: string | Buffer,
): string {
	const body = payloadToString(payload);
	return createHmac("sha256", secret)
		.update(`${timestamp}.${body}`)
		.digest("hex");
}

function verifySignature(expected: string, received: string): boolean {
	try {
		const expectedBuf = Buffer.from(expected, "hex");
		const receivedBuf = Buffer.from(received, "hex");
		if (expectedBuf.length !== receivedBuf.length) {
			return false;
		}
		return timingSafeEqual(expectedBuf, receivedBuf);
	} catch {
		return false;
	}
}

function verifyTimestamp(timestamp: string, tolerance: number): void {
	const ts = Number(timestamp);
	if (!Number.isFinite(ts)) {
		throw new WebhookSignatureVerificationError(
			"Invalid timestamp in X-Webhook-Signature header",
		);
	}

	const age = Math.abs(Math.floor(Date.now() / 1000) - ts);
	if (age > tolerance) {
		throw new WebhookSignatureVerificationError(
			`Timestamp outside tolerance: allowed drift is ${tolerance} seconds`,
		);
	}
}

function parseWebhookEvent(raw: string): WebhookEvent {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new WebhookSignatureVerificationError("Webhook payload is not valid JSON");
	}

	if (!parsed || typeof parsed !== "object") {
		throw new WebhookSignatureVerificationError(
			"Webhook payload must be a JSON object",
		);
	}

	const record = parsed as Record<string, unknown>;
	const { id, event, payload, timestamp } = record;

	if (typeof id !== "string" || !id) {
		throw new WebhookSignatureVerificationError(
			"Webhook payload missing required field: id",
		);
	}
	if (typeof event !== "string" || !event) {
		throw new WebhookSignatureVerificationError(
			"Webhook payload missing required field: event",
		);
	}
	if (
		!payload ||
		typeof payload !== "object" ||
		Array.isArray(payload)
	) {
		throw new WebhookSignatureVerificationError(
			"Webhook payload missing required field: payload",
		);
	}
	if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) {
		throw new WebhookSignatureVerificationError(
			"Webhook payload missing required field: timestamp",
		);
	}

	return {
		id,
		event,
		payload: payload as Record<string, unknown>,
		timestamp,
	};
}

export function verifyWebhook(params: VerifyWebhookParams): WebhookEvent {
	const { payload, headers, secret, tolerance = DEFAULT_TOLERANCE_SECONDS } =
		params;

	if (!secret) {
		throw new WebhookSignatureVerificationError("Webhook secret is required");
	}

	const signatureHeader = getHeader(headers, WEBHOOK_SIGNATURE_HEADER);
	if (!signatureHeader) {
		throw new WebhookSignatureVerificationError(
			`Missing ${WEBHOOK_SIGNATURE_HEADER} header`,
		);
	}

	const { timestamp, signatures } = parseSignatureHeader(signatureHeader);
	verifyTimestamp(timestamp, tolerance);

	const expected = computeExpectedSignature(secret, timestamp, payload);
	const valid = signatures.some((sig) => verifySignature(expected, sig));

	if (!valid) {
		throw new WebhookSignatureVerificationError(
			"Webhook signature verification failed",
		);
	}

	return parseWebhookEvent(payloadToString(payload));
}
