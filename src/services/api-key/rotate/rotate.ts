import type { ReloopClient } from "#src/client";
import type { ReloopResult } from "#src/core/result";
import { requireApiKeyId } from "#src/services/api-key/fields";
import { apiKeyRotate } from "#src/services/api-key/paths";
import type { ApiKeyWithKey } from "#src/services/api-key/types";

export async function rotateApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<ApiKeyWithKey>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<ApiKeyWithKey>(apiKeyRotate(keyId), {
		method: "POST",
	});
}
