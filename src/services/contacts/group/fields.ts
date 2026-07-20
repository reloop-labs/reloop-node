import { ReloopValidationError } from "@/services/contacts/group/errors";
import type { ContactStatus } from "@/services/contacts/types";

const CREATE_NAME_MIN = 1;
const CREATE_NAME_MAX = 50;
const UPDATE_NAME_MIN = 1;
const UPDATE_NAME_MAX = 255;
const PAGE_MIN = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 100;

const CONTACT_STATUSES = new Set<ContactStatus>([
	"subscribed",
	"unsubscribed",
	"blocked",
]);

export function requireGroupId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Group ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requireCreateGroupName(name: unknown, field = "name"): string {
	if (typeof name !== "string") {
		throw new ReloopValidationError(
			`Group ${field} is required and must be a string.`,
			field,
		);
	}
	const trimmed = name.trim();
	if (trimmed.length < CREATE_NAME_MIN) {
		throw new ReloopValidationError(
			`Group ${field} must be at least ${CREATE_NAME_MIN} character.`,
			field,
		);
	}
	if (trimmed.length > CREATE_NAME_MAX) {
		throw new ReloopValidationError(
			`Group ${field} must be at most ${CREATE_NAME_MAX} characters.`,
			field,
		);
	}
	return trimmed;
}

export function requireUpdateGroupName(name: unknown, field = "name"): string {
	if (typeof name !== "string") {
		throw new ReloopValidationError(
			`Group ${field} is required and must be a string.`,
			field,
		);
	}
	const trimmed = name.trim();
	if (trimmed.length < UPDATE_NAME_MIN) {
		throw new ReloopValidationError(
			`Group ${field} must be at least ${UPDATE_NAME_MIN} character.`,
			field,
		);
	}
	if (trimmed.length > UPDATE_NAME_MAX) {
		throw new ReloopValidationError(
			`Group ${field} must be at most ${UPDATE_NAME_MAX} characters.`,
			field,
		);
	}
	return trimmed;
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

export function requireContactStatus(
	status: unknown,
	field = "status",
): ContactStatus {
	if (
		typeof status !== "string" ||
		!CONTACT_STATUSES.has(status as ContactStatus)
	) {
		throw new ReloopValidationError(
			`list ${field} must be "subscribed", "unsubscribed", or "blocked".`,
			field,
		);
	}
	return status as ContactStatus;
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
