import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import { requireApiKeyId } from "./fields";
import { apiKeyById } from "./paths";
import type { DeleteApiKeyResponse } from "./types";

/** DELETE `/api/api-key/v1/:id` */
export async function deleteApiKey(
	client: ReloopClient,
	id: string,
): Promise<ReloopResult<DeleteApiKeyResponse>> {
	const keyId = requireApiKeyId(id);
	return client.fetch<DeleteApiKeyResponse>(apiKeyById(keyId), {
		method: "DELETE",
	});
}
