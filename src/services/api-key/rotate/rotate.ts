import type { ReloopClient } from "@/client";
import { requireApiKeyId } from "@/services/api-key/fields";
import { apiKeyRotate } from "@/services/api-key/paths";
import {
	toApiKeyResult,
	type ApiKeyResult,
} from "@/services/api-key/result";
import type { ApiKeyWithKey } from "@/services/api-key/types";

export async function rotateApiKey(
	client: ReloopClient,
	id: string,
): Promise<ApiKeyResult<ApiKeyWithKey>> {
	const keyId = requireApiKeyId(id);
	const result = await client.fetch<ApiKeyWithKey>(apiKeyRotate(keyId), {
		method: "POST",
	});
	return toApiKeyResult(result);
}
