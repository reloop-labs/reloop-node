import type { ReloopClient } from "../../../client";
import type { ReloopResult } from "../../../core/result";
import { requireApiKeyId } from "../fields";
import { apiKeyDisable } from "../paths";
import type { ApiKey } from "../types";

/** POST `/api/api-key/v1/disable/:id` */
export async function disableApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<ApiKey>(apiKeyDisable(keyId), { method: "POST" });
}
