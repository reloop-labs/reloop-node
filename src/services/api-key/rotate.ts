import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import { apiKeyRotate } from "./paths";
import type { ApiKeyWithKey } from "./types";
import { requireApiKeyId } from "./validate";

/** POST `/api/api-key/v1/rotate/:id` — returns a new secret once. */
export async function rotateApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<ApiKeyWithKey>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<ApiKeyWithKey>(apiKeyRotate(keyId), {
		method: "POST",
	});
}
