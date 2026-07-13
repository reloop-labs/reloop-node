import type { ReloopClient } from "@/client";
import { requireApiKeyId } from "@/services/api-key/fields";
import { apiKeyDisable } from "@/services/api-key/paths";
import {
	toApiKeyResult,
	type ApiKeyResult,
} from "@/services/api-key/result";
import type { ApiKey } from "@/services/api-key/types";

export async function disableApiKey(
	client: ReloopClient,
	id: string,
): Promise<ApiKeyResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	const result = await client.fetch<ApiKey>(apiKeyDisable(keyId), {
		method: "POST",
	});
	return toApiKeyResult(result);
}
