import type { ReloopClient } from "#src/client";
import type { ReloopResult } from "#src/core/result";
import { ReloopValidationError } from "#src/services/api-key/errors";
import { apiKeyListPath } from "#src/services/api-key/paths";
import type { ApiKeyListParams, ApiKeyListResponse } from "#src/services/api-key/types";

const PAGE_MIN = 1;
const LIMIT_MIN = 1;
const LIMIT_MAX = 100;

function validateListParams(
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

/** GET `/api/api-key/v1/` — list with optional page, limit, enabled, userId, q. */
export async function listApiKeys(
	client: ReloopClient,
	params?: ApiKeyListParams,
): Promise<ReloopResult<ApiKeyListResponse>> {
	const valid = validateListParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.page !== undefined) searchParams.set("page", valid.page.toString());
	if (valid?.limit !== undefined) searchParams.set("limit", valid.limit.toString());
	if (valid?.enabled !== undefined) {
		searchParams.set("enabled", valid.enabled.toString());
	}
	if (valid?.userId) searchParams.set("userId", valid.userId);
	if (valid?.q) searchParams.set("q", valid.q);

	const path = apiKeyListPath(searchParams.toString());
	return client.fetch<ApiKeyListResponse>(path, { method: "GET" });
}
