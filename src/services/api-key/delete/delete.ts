import type { ReloopClient } from "@/client";
import type { ReloopResult } from "@/core/result";
import { requireApiKeyId } from "@/services/api-key/fields";
import { apiKeyById } from "@/services/api-key/paths";
import type { DeleteApiKeyResponse } from "@/services/api-key/types";

export async function deleteApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<DeleteApiKeyResponse>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<DeleteApiKeyResponse>(apiKeyById(keyId), {
		method: "DELETE",
	});
}
