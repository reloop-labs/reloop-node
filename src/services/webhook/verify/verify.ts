import { createHmac, timingSafeEqual } from "node:crypto";
import type { VerifyWebhookParams, WebhookEvent } from "@/services/webhook/types";
import { WebhookSignatureVerificationError } from "@/services/webhook/types";

/** Header Reloop signs every webhook delivery with: `t=<unix>,v1=<hex>`. */
export const WEBHOOK_SIGNATURE_HEADER = "Reloop-Signature";
export const WEBHOOK_TIMESTAMP_HEADER = "Reloop-Timestamp";
export const WEBHOOK_ID_HEADER = "Reloop-Id";

/** Header names used before 2.3.2. Still accepted as a fallback. */
const LEGACY_SIGNATURE_HEADER = "x-webhook-signature";

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
			`Invalid ${WEBHOOK_SIGNATURE_HEADER} header: expected t= and v1= values`,
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
			`Invalid timestamp in ${WEBHOOK_SIGNATURE_HEADER} header`,
		);
	}

	const age = Math.abs(Math.floor(Date.now() / 1000) - ts);
	if (age > tolerance) {
		throw new WebhookSignatureVerificationError(
			`Timestamp outside tolerance: allowed drift is ${tolerance} seconds`,
		);
	}
}

function isObject(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

function parseWebhookEvent(raw: string): WebhookEvent {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new WebhookSignatureVerificationError("Webhook payload is not valid JSON");
	}

	if (!isObject(parsed)) {
		throw new WebhookSignatureVerificationError(
			"Webhook payload must be a JSON object",
		);
	}

	const { id } = parsed;
	if (typeof id !== "string" || !id) {
		throw new WebhookSignatureVerificationError(
			"Webhook payload missing required field: id",
		);
	}

	// Production envelope: { id, type, created_at, data }.
	// Legacy envelope (pre-2.3.2 fixtures): { id, event, payload, timestamp }.
	const type = parsed.type ?? parsed.event;
	const data = parsed.data ?? parsed.payload;
	const createdAt =
		typeof parsed.created_at === "string"
			? parsed.created_at
			: typeof parsed.timestamp === "number" && Number.isFinite(parsed.timestamp)
				? new Date(parsed.timestamp * 1000).toISOString()
				: undefined;

	if (typeof type !== "string" || !type) {
		throw new WebhookSignatureVerificationError(
			"Webhook payload missing required field: type",
		);
	}
	if (!isObject(data)) {
		throw new WebhookSignatureVerificationError(
			"Webhook payload missing required field: data",
		);
	}
	if (!createdAt) {
		throw new WebhookSignatureVerificationError(
			"Webhook payload missing required field: created_at",
		);
	}

	return {
		id,
		type,
		created_at: createdAt,
		data,
		event: type,
		payload: data,
		timestamp: Math.floor(Date.parse(createdAt) / 1000),
	};
}

export function verifyWebhook(params: VerifyWebhookParams): WebhookEvent {
	const { payload, headers, secret, tolerance = DEFAULT_TOLERANCE_SECONDS } =
		params;

	if (!secret) {
		throw new WebhookSignatureVerificationError("Webhook secret is required");
	}

	const signatureHeader =
		getHeader(headers, WEBHOOK_SIGNATURE_HEADER) ??
		getHeader(headers, LEGACY_SIGNATURE_HEADER);
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
