import type { ReloopClient } from "@/client";
import type { ReloopResult } from "@/core/result";
import { requireApiKeyId } from "@/services/api-key/fields";
import { apiKeyById } from "@/services/api-key/paths";
import type { ApiKey } from "@/services/api-key/types";

export async function getApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<ApiKey>(apiKeyById(keyId), { method: "GET" });
}
