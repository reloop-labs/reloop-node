import type { ReloopClient } from "@/client";
import type { ReloopResult } from "@/core/result";
import { requireApiKeyId } from "@/services/api-key/fields";
import { apiKeyEnable } from "@/services/api-key/paths";
import type { ApiKey } from "@/services/api-key/types";

export async function enableApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<ApiKey>(apiKeyEnable(keyId), { method: "POST" });
}
