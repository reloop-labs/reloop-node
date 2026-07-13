import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import { API_KEY_V1 } from "./paths";
import type { ApiKeyWithKey, CreateApiKeyParams } from "./types";
import { validateCreateParams } from "./validate";

/** POST `/api/api-key/v1/` — creates a key; response includes the secret once. */
export async function createApiKey(
	client: ReloopClient,
	params: CreateApiKeyParams,
): Promise<ReloopResult<ApiKeyWithKey>> {
	const body = validateCreateParams(params);
	return client.fetch<ApiKeyWithKey>(`${API_KEY_V1}/`, {
		method: "POST",
		body: JSON.stringify(body),
	});
}
