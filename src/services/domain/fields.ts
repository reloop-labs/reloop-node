import { ReloopValidationError } from "@/services/domain/errors";
import type {
	DomainStatus,
	DomainTlsMode,
} from "@/services/domain/types";

const DOMAIN_MIN = 4;
const DOMAIN_MAX = 255;
const PAGE_MIN = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 100;

const DOMAIN_PATTERN =
	/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const TLS_MODES = new Set<DomainTlsMode>(["opportunistic", "enforced"]);
const DOMAIN_STATUSES = new Set<DomainStatus>([
	"pending",
	"verifying",
	"active",
	"suspended",
	"failed",
]);

export function requireDomainId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`Domain ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requireDomainName(domain: unknown, field = "domain"): string {
	if (typeof domain !== "string") {
		throw new ReloopValidationError(
			`Domain ${field} is required and must be a string.`,
			field,
		);
	}
	const trimmed = domain.trim().toLowerCase();
	if (trimmed.length < DOMAIN_MIN) {
		throw new ReloopValidationError(
			`Domain ${field} must be at least ${DOMAIN_MIN} characters.`,
			field,
		);
	}
	if (trimmed.length > DOMAIN_MAX) {
		throw new ReloopValidationError(
			`Domain ${field} must be at most ${DOMAIN_MAX} characters.`,
			field,
		);
	}
	if (!DOMAIN_PATTERN.test(trimmed)) {
		throw new ReloopValidationError(
			`Domain ${field} must be a valid domain name.`,
			field,
		);
	}
	return trimmed;
}

export function optionalBoolean(
	value: unknown,
	field: string,
): boolean | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "boolean") {
		throw new ReloopValidationError(
			`${field} must be a boolean when provided.`,
			field,
		);
	}
	return value;
}

export function optionalTls(
	value: unknown,
	field = "tls",
): DomainTlsMode | undefined {
	if (value === undefined) return undefined;
	if (typeof value !== "string" || !TLS_MODES.has(value as DomainTlsMode)) {
		throw new ReloopValidationError(
			`${field} must be "opportunistic" or "enforced".`,
			field,
		);
	}
	return value as DomainTlsMode;
}

export function optionalDomainStatus(
	value: unknown,
	field = "status",
): DomainStatus | undefined {
	if (value === undefined) return undefined;
	if (
		typeof value !== "string" ||
		!DOMAIN_STATUSES.has(value as DomainStatus)
	) {
		throw new ReloopValidationError(
			`${field} must be a valid domain status.`,
			field,
		);
	}
	return value as DomainStatus;
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
