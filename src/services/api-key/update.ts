import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import { ReloopValidationError } from "./errors";
import { requireApiKeyId, requireApiKeyName } from "./fields";
import { apiKeyById } from "./paths";
import type { ApiKey, UpdateApiKeyParams } from "./types";

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
