import type { ReloopClient } from "#src/client";
import type { ReloopResult } from "#src/core/result";
import { requireApiKeyId } from "#src/services/api-key/fields";
import { apiKeyEnable } from "#src/services/api-key/paths";
import type { ApiKey } from "#src/services/api-key/types";

/** POST `/api/api-key/v1/enable/:id` */
export async function enableApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<ApiKey>(apiKeyEnable(keyId), { method: "POST" });
}
