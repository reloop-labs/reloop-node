import { ReloopValidationError } from "@/services/contacts/property/errors";
import type { PropertyType } from "@/services/contacts/property/types";

const NAME_MIN = 1;
const NAME_MAX = 255;
const PAGE_MIN = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 100;

const PROPERTY_TYPES = new Set<PropertyType>(["string", "number"]);

export function requirePropertyId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Property ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requirePropertyName(name: unknown, field = "name"): string {
	if (typeof name !== "string") {
		throw new ReloopValidationError(
			`Property ${field} is required and must be a string.`,
			field,
		);
	}
	const trimmed = name.trim();
	if (trimmed.length < NAME_MIN) {
		throw new ReloopValidationError(
			`Property ${field} must be at least ${NAME_MIN} character.`,
			field,
		);
	}
	if (trimmed.length > NAME_MAX) {
		throw new ReloopValidationError(
			`Property ${field} must be at most ${NAME_MAX} characters.`,
			field,
		);
	}
	return trimmed;
}

export function requirePropertyType(type: unknown, field = "type"): PropertyType {
	if (typeof type !== "string" || !PROPERTY_TYPES.has(type as PropertyType)) {
		throw new ReloopValidationError(
			`Property ${field} must be "string" or "number".`,
			field,
		);
	}
	return type as PropertyType;
}

export function optionalFallbackValue(
	value: unknown,
	field = "fallbackValue",
): string | undefined {
	if (value === undefined) {
		return undefined;
	}
	if (typeof value !== "string") {
		throw new ReloopValidationError(
			`Property ${field} must be a string when provided.`,
			field,
		);
	}
	return value;
}

export function requireNullableFallbackValue(
	value: unknown,
	field = "fallbackValue",
): string | null {
	if (value === null) {
		return null;
	}
	if (typeof value !== "string") {
		throw new ReloopValidationError(
			`Property ${field} must be a string or null.`,
			field,
		);
	}
	return value;
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
