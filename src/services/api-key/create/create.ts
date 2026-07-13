import type { ReloopClient } from "@/client";
import type { ReloopResult } from "@/core/result";
import { ReloopValidationError } from "@/services/api-key/errors";
import { requireApiKeyName } from "@/services/api-key/fields";
import { API_KEY_V1 } from "@/services/api-key/paths";
import type { ApiKeyWithKey, CreateApiKeyParams } from "@/services/api-key/types";

function validateCreateParams(
	params: CreateApiKeyParams | null | undefined,
): CreateApiKeyParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"create params are required and must be an object.",
			"params",
		);
	}
	return { name: requireApiKeyName(params.name) };
}

export async function createApiKey(
	client: ReloopClient,
	params: CreateApiKeyParams,
): Promise<ReloopResult<ApiKeyWithKey>> {
	const body = validateCreateParams(params);
	return client.fetch<ApiKeyWithKey>(`${API_KEY_V1}/`, {
		method: "POST",
		body: JSON.stringify(body),
	});
}
