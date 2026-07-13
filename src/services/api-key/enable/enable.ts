import type { ReloopClient } from "@/client";
import { requireApiKeyId } from "@/services/api-key/fields";
import { apiKeyEnable } from "@/services/api-key/paths";
import {
	toApiKeyResult,
	type ApiKeyResult,
} from "@/services/api-key/result";
import type { ApiKey } from "@/services/api-key/types";

export async function enableApiKey(
	client: ReloopClient,
	id: string,
): Promise<ApiKeyResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	const result = await client.fetch<ApiKey>(apiKeyEnable(keyId), {
		method: "POST",
	});
	return toApiKeyResult(result);
}
