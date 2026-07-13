import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import { apiKeyById } from "./paths";
import type { ApiKey, UpdateApiKeyParams } from "./types";
import { requireApiKeyId, validateUpdateParams } from "./validate";

/** PATCH `/api/api-key/v1/:id` */
export async function updateApiKey(
	client: ReloopClient,
	id: string,
	params: UpdateApiKeyParams,
): Promise<ReloopResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	const body = validateUpdateParams(params);
	return client.fetch<ApiKey>(apiKeyById(keyId), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}
