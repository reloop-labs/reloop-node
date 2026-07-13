import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import { apiKeyById } from "./paths";
import type { ApiKey } from "./types";
import { requireApiKeyId } from "./validate";

/** GET `/api/api-key/v1/:id` */
export async function getApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<ApiKey>(apiKeyById(keyId), { method: "GET" });
}
