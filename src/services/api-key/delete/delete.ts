import type { ReloopClient } from "@/client";
import { requireApiKeyId } from "@/services/api-key/fields";
import { apiKeyById } from "@/services/api-key/paths";
import {
	toApiKeyResult,
	type ApiKeyResult,
} from "@/services/api-key/result";
import type { DeleteApiKeyResponse } from "@/services/api-key/types";

export async function deleteApiKey(
	client: ReloopClient,
	id: string,
): Promise<ApiKeyResult<DeleteApiKeyResponse>> {
	const keyId = requireApiKeyId(id);
	const result = await client.fetch<DeleteApiKeyResponse>(apiKeyById(keyId), {
		method: "DELETE",
	});
	return toApiKeyResult(result);
}
