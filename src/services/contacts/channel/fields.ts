import { ReloopValidationError } from "@/services/contacts/channel/errors";
import type {
	ChannelSubscription,
	ChannelVisibility,
} from "@/services/contacts/channel/types";

const NAME_MIN = 1;
const NAME_MAX = 255;
const DESCRIPTION_MAX = 1000;
const PAGE_MIN = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 100;

const SUBSCRIPTIONS = new Set<ChannelSubscription>(["opt_in", "opt_out"]);
const VISIBILITIES = new Set<ChannelVisibility>(["private", "public"]);

export function requireChannelId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Channel ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requireChannelName(name: unknown, field = "name"): string {
	if (typeof name !== "string") {
		throw new ReloopValidationError(
			`Channel ${field} is required and must be a string.`,
			field,
		);
	}
	const trimmed = name.trim();
	if (trimmed.length < NAME_MIN) {
		throw new ReloopValidationError(
			`Channel ${field} must be at least ${NAME_MIN} character.`,
			field,
		);
	}
	if (trimmed.length > NAME_MAX) {
		throw new ReloopValidationError(
			`Channel ${field} must be at most ${NAME_MAX} characters.`,
			field,
		);
	}
	return trimmed;
}

export function optionalChannelName(
	name: unknown,
	field = "name",
): string | undefined {
	if (name === undefined) return undefined;
	return requireChannelName(name, field);
}

export function optionalDescription(
	description: unknown,
	field = "description",
): string | undefined {
	if (description === undefined) return undefined;
	if (typeof description !== "string") {
		throw new ReloopValidationError(
			`Channel ${field} must be a string when provided.`,
			field,
		);
	}
	if (description.length > DESCRIPTION_MAX) {
		throw new ReloopValidationError(
			`Channel ${field} must be at most ${DESCRIPTION_MAX} characters.`,
			field,
		);
	}
	return description;
}

export function optionalNullableDescription(
	description: unknown,
	field = "description",
): string | null | undefined {
	if (description === undefined) return undefined;
	if (description === null) return null;
	return optionalDescription(description, field) as string;
}

export function optionalSubscription(
	value: unknown,
	field = "defaultSubscription",
): ChannelSubscription | undefined {
	if (value === undefined) return undefined;
	if (
		typeof value !== "string" ||
		!SUBSCRIPTIONS.has(value as ChannelSubscription)
	) {
		throw new ReloopValidationError(
			`Channel ${field} must be "opt_in" or "opt_out".`,
			field,
		);
	}
	return value as ChannelSubscription;
}

export function requireSubscription(
	value: unknown,
	field = "subscription",
): ChannelSubscription {
	const parsed = optionalSubscription(value, field);
	if (parsed === undefined) {
		throw new ReloopValidationError(
			`Channel ${field} is required and must be "opt_in" or "opt_out".`,
			field,
		);
	}
	return parsed;
}

export function optionalVisibility(
	value: unknown,
	field = "visibility",
): ChannelVisibility | undefined {
	if (value === undefined) return undefined;
	if (
		typeof value !== "string" ||
		!VISIBILITIES.has(value as ChannelVisibility)
	) {
		throw new ReloopValidationError(
			`Channel ${field} must be "private" or "public".`,
			field,
		);
	}
	return value as ChannelVisibility;
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

export function requireMembershipIdentifier(params: {
	contact_id?: unknown;
	email?: unknown;
}): { contact_id?: string; email?: string } {
	const out: { contact_id?: string; email?: string } = {};

	if (params.contact_id !== undefined) {
		if (
			typeof params.contact_id !== "string" ||
			params.contact_id.trim().length === 0
		) {
			throw new ReloopValidationError(
				"contact_id must be a non-empty string when provided.",
				"contact_id",
			);
		}
		out.contact_id = params.contact_id.trim();
	}

	if (params.email !== undefined) {
		if (typeof params.email !== "string" || params.email.trim().length === 0) {
			throw new ReloopValidationError(
				"email must be a non-empty string when provided.",
				"email",
			);
		}
		out.email = params.email.trim();
	}

	if (!out.contact_id && !out.email) {
		throw new ReloopValidationError(
			"Either contact_id or email is required.",
			"params",
		);
	}

	return out;
}
