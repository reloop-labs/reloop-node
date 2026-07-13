import type { ReloopClient } from "@/client";
import type { ReloopResult } from "@/core/result";
import { requireApiKeyId } from "@/services/api-key/fields";
import { apiKeyRotate } from "@/services/api-key/paths";
import type { ApiKeyWithKey } from "@/services/api-key/types";

export async function rotateApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<ApiKeyWithKey>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<ApiKeyWithKey>(apiKeyRotate(keyId), {
		method: "POST",
	});
}
