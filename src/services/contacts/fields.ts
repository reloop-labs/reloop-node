import { ReloopValidationError } from "@/services/contacts/errors";
import type {
	ContactChannelInput,
	ContactStatus,
} from "@/services/contacts/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CREATE_PROPERTY_KEY_PATTERN = /^[a-z0-9_]+$/;
const UPDATE_PROPERTY_KEY_PATTERN = /^[a-z_]+$/;
const PAGE_MIN = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 100;

const CONTACT_STATUSES = new Set<ContactStatus>([
	"subscribed",
	"unsubscribed",
	"blocked",
]);

const CHANNEL_SUBSCRIPTIONS = new Set<ContactChannelInput["subscription"]>([
	"opt_in",
	"opt_out",
]);

export function requireContactId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Contact ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requireEmail(email: unknown, field = "email"): string {
	if (typeof email !== "string") {
		throw new ReloopValidationError(
			`Contact ${field} is required and must be a string.`,
			field,
		);
	}
	const trimmed = email.trim();
	if (!EMAIL_PATTERN.test(trimmed)) {
		throw new ReloopValidationError(
			`Contact ${field} must be a valid email address.`,
			field,
		);
	}
	return trimmed;
}

export function optionalEmail(
	email: unknown,
	field = "email",
): string | undefined {
	if (email === undefined) return undefined;
	return requireEmail(email, field);
}

export function optionalContactStatus(
	status: unknown,
	field = "status",
): ContactStatus | undefined {
	if (status === undefined) return undefined;
	if (
		typeof status !== "string" ||
		!CONTACT_STATUSES.has(status as ContactStatus)
	) {
		throw new ReloopValidationError(
			`${field} must be "subscribed", "unsubscribed", or "blocked".`,
			field,
		);
	}
	return status as ContactStatus;
}

export function requireContactStatus(
	status: unknown,
	field = "status",
): ContactStatus {
	const value = optionalContactStatus(status, field);
	if (value === undefined) {
		throw new ReloopValidationError(
			`${field} must be "subscribed", "unsubscribed", or "blocked".`,
			field,
		);
	}
	return value;
}

export function optionalString(
	value: unknown,
	field: string,
): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "string") {
		throw new ReloopValidationError(
			`${field} must be a string when provided.`,
			field,
		);
	}
	return value;
}

function validateProperties(
	properties: unknown,
	keyPattern: RegExp,
	field = "properties",
): Record<string, string | number> | undefined {
	if (properties === undefined) return undefined;
	if (typeof properties !== "object" || properties === null) {
		throw new ReloopValidationError(
			`${field} must be an object when provided.`,
			field,
		);
	}

	const out: Record<string, string | number> = {};
	for (const [key, value] of Object.entries(properties)) {
		if (!keyPattern.test(key)) {
			throw new ReloopValidationError(
				`${field} keys must match ${keyPattern.source}.`,
				field,
			);
		}
		if (typeof value !== "string" && typeof value !== "number") {
			throw new ReloopValidationError(
				`${field}.${key} must be a string or number.`,
				field,
			);
		}
		out[key] = value;
	}
	return out;
}

export function optionalCreateProperties(
	properties: unknown,
): Record<string, string | number> | undefined {
	return validateProperties(properties, CREATE_PROPERTY_KEY_PATTERN);
}

export function optionalUpdateProperties(
	properties: unknown,
): Record<string, string | number> | undefined {
	return validateProperties(properties, UPDATE_PROPERTY_KEY_PATTERN);
}

export function optionalGroupIds(groupIds: unknown): string[] | undefined {
	if (groupIds === undefined) return undefined;
	if (!Array.isArray(groupIds)) {
		throw new ReloopValidationError(
			"groupIds must be an array when provided.",
			"groupIds",
		);
	}
	return groupIds.map((id, index) => {
		if (typeof id !== "string" || id.trim().length === 0) {
			throw new ReloopValidationError(
				`groupIds[${index}] must be a non-empty string.`,
				"groupIds",
			);
		}
		return id.trim();
	});
}

export function optionalChannels(
	channels: unknown,
): ContactChannelInput[] | undefined {
	if (channels === undefined) return undefined;
	if (!Array.isArray(channels)) {
		throw new ReloopValidationError(
			"channels must be an array when provided.",
			"channels",
		);
	}

	return channels.map((entry, index) => {
		if (typeof entry !== "object" || entry === null) {
			throw new ReloopValidationError(
				`channels[${index}] must be an object.`,
				"channels",
			);
		}
		const { channelId, subscription } = entry as ContactChannelInput;
		if (typeof channelId !== "string" || channelId.trim().length === 0) {
			throw new ReloopValidationError(
				`channels[${index}].channelId must be a non-empty string.`,
				"channels",
			);
		}
		if (
			typeof subscription !== "string" ||
			!CHANNEL_SUBSCRIPTIONS.has(subscription)
		) {
			throw new ReloopValidationError(
				`channels[${index}].subscription must be "opt_in" or "opt_out".`,
				"channels",
			);
		}
		return {
			channelId: channelId.trim(),
			subscription,
		};
	});
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
