import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import { apiKeyListPath } from "./paths";
import type { ApiKeyListParams, ApiKeyListResponse } from "./types";
import { validateListParams } from "./validate";

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
