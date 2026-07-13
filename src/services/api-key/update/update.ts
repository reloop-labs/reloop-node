import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/api-key/errors";
import { requireApiKeyId, requireApiKeyName } from "@/services/api-key/fields";
import { apiKeyById } from "@/services/api-key/paths";
import {
	toApiKeyResult,
	type ApiKeyResult,
} from "@/services/api-key/result";
import type { ApiKey, UpdateApiKeyParams } from "@/services/api-key/types";

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

export async function updateApiKey(
	client: ReloopClient,
	id: string,
	params: UpdateApiKeyParams,
): Promise<ApiKeyResult<ApiKey>> {
	const keyId = requireApiKeyId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<ApiKey>(apiKeyById(keyId), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return toApiKeyResult(result);
}
