import { ReloopValidationError } from "@/services/webhook/errors";

const PAGE_MIN = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 100;

export function requireWebhookId(id: unknown, field = "webhookId"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Webhook ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requireDeliveryId(id: unknown, field = "deliveryId"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Webhook delivery ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requirePage(page: unknown, field = "page"): number {
	if (
		typeof page !== "number" ||
		!Number.isInteger(page) ||
		page < PAGE_MIN
	) {
		throw new ReloopValidationError(
			`list ${field} must be an integer >= ${PAGE_MIN}.`,
			field,
		);
	}
	return page;
}

export function requireLimit(limit: unknown, field = "limit"): number {
	if (
		typeof limit !== "number" ||
		!Number.isInteger(limit) ||
		limit < LIMIT_MIN ||
		limit > LIMIT_MAX
	) {
		throw new ReloopValidationError(
			`list ${field} must be an integer between ${LIMIT_MIN} and ${LIMIT_MAX}.`,
			field,
		);
	}
	return limit;
}
