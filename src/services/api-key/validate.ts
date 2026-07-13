import { ReloopValidationError } from "./errors";
import type {
	ApiKeyListParams,
	CreateApiKeyParams,
	UpdateApiKeyParams,
} from "./types";

/** Matches backend create/update body constraints. */
const NAME_MIN = 1;
const NAME_MAX = 255;
const PAGE_MIN = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 100;

export function requireApiKeyId(id: unknown, field = "id"): string {
	if (typeof id !== "string" || id.trim().length === 0) {
		throw new ReloopValidationError(
			`API key ${field} is required and must be a non-empty string.`,
			field,
		);
	}
	return id.trim();
}

export function requireApiKeyName(
	name: unknown,
	field = "name",
): string {
	if (typeof name !== "string") {
		throw new ReloopValidationError(
			`API key ${field} is required and must be a string.`,
			field,
		);
	}
	const trimmed = name.trim();
	if (trimmed.length < NAME_MIN) {
		throw new ReloopValidationError(
			`API key ${field} must be at least ${NAME_MIN} character.`,
			field,
		);
	}
	if (trimmed.length > NAME_MAX) {
		throw new ReloopValidationError(
			`API key ${field} must be at most ${NAME_MAX} characters.`,
			field,
		);
	}
	return trimmed;
}

export function validateCreateParams(
	params: CreateApiKeyParams | null | undefined,
): CreateApiKeyParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"create params are required and must be an object.",
			"params",
		);
	}
	return { name: requireApiKeyName(params.name) };
}

export function validateUpdateParams(
	params: UpdateApiKeyParams | null | undefined,
): UpdateApiKeyParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}
	return { name: requireApiKeyName(params.name) };
}

export function validateListParams(
	params?: ApiKeyListParams | null,
): ApiKeyListParams | undefined {
	if (params === undefined || params === null) {
		return undefined;
	}
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}

	const out: ApiKeyListParams = {};

	if (params.page !== undefined) {
		if (
			typeof params.page !== "number" ||
			!Number.isInteger(params.page) ||
			params.page < PAGE_MIN
		) {
			throw new ReloopValidationError(
				`list page must be an integer >= ${PAGE_MIN}.`,
				"page",
			);
		}
		out.page = params.page;
	}

	if (params.limit !== undefined) {
		if (
			typeof params.limit !== "number" ||
			!Number.isInteger(params.limit) ||
			params.limit < LIMIT_MIN ||
			params.limit > LIMIT_MAX
		) {
			throw new ReloopValidationError(
				`list limit must be an integer between ${LIMIT_MIN} and ${LIMIT_MAX}.`,
				"limit",
			);
		}
		out.limit = params.limit;
	}

	if (params.enabled !== undefined) {
		if (typeof params.enabled !== "boolean") {
			throw new ReloopValidationError(
				"list enabled must be a boolean.",
				"enabled",
			);
		}
		out.enabled = params.enabled;
	}

	if (params.userId !== undefined) {
		if (typeof params.userId !== "string" || params.userId.trim().length === 0) {
			throw new ReloopValidationError(
				"list userId must be a non-empty string when provided.",
				"userId",
			);
		}
		out.userId = params.userId.trim();
	}

	if (params.q !== undefined) {
		if (typeof params.q !== "string") {
			throw new ReloopValidationError(
				"list q must be a string when provided.",
				"q",
			);
		}
		out.q = params.q;
	}

	return out;
}
