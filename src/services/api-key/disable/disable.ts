import type { ReloopClient } from "#src/client";
import type { ReloopResult } from "#src/core/result";
import { requireApiKeyId } from "#src/services/api-key/fields";
import { apiKeyDisable } from "#src/services/api-key/paths";
import type { ApiKey } from "#src/services/api-key/types";

/** POST `/api/api-key/v1/disable/:id` */
export async function disableApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<ApiKey>(apiKeyDisable(keyId), { method: "POST" });
}
