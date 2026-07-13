import type { ReloopClient } from "@/client";
import { requireApiKeyId } from "@/services/api-key/fields";
import { apiKeyById } from "@/services/api-key/paths";
import {
	toApiKeyResult,
	type ApiKeyResult,
} from "@/services/api-key/result";
import type { ApiKey } from "@/services/api-key/types";

export async function getApiKey(
	client: ReloopClient,
	id: string,
): Promise<ApiKeyResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	const result = await client.fetch<ApiKey>(apiKeyById(keyId), {
		method: "GET",
	});
	return toApiKeyResult(result);
}
