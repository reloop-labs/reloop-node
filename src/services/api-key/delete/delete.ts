import type { ReloopClient } from "#src/client";
import type { ReloopResult } from "#src/core/result";
import { requireApiKeyId } from "#src/services/api-key/fields";
import { apiKeyById } from "#src/services/api-key/paths";
import type { DeleteApiKeyResponse } from "#src/services/api-key/types";

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
