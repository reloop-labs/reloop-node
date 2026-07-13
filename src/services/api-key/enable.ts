import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import { requireApiKeyId } from "./fields";
import { apiKeyEnable } from "./paths";
import type { ApiKey } from "./types";

/** POST `/api/api-key/v1/enable/:id` */
export async function enableApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<ApiKey>(apiKeyEnable(keyId), { method: "POST" });
}
