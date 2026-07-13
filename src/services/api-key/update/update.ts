import type { ReloopClient } from "#src/client";
import type { ReloopResult } from "#src/core/result";
import { ReloopValidationError } from "#src/services/api-key/errors";
import { requireApiKeyId, requireApiKeyName } from "#src/services/api-key/fields";
import { apiKeyById } from "#src/services/api-key/paths";
import type { ApiKey, UpdateApiKeyParams } from "#src/services/api-key/types";

function validateUpdateParams(
	params: UpdateApiKeyParams | null | undefined,
): UpdateApiKeyParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}
	return { name: requireApiKeyName(params.name) };
}

/** PATCH `/api/api-key/v1/:id` */
export async function updateApiKey(
	client: ReloopClient,
	id: string,
	params: UpdateApiKeyParams,
): Promise<ReloopResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	const body = validateUpdateParams(params);
	return client.fetch<ApiKey>(apiKeyById(keyId), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}
