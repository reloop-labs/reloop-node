import type { ReloopClient } from "#src/client";
import type { ReloopResult } from "#src/core/result";
import { createApiKey } from "#src/services/api-key/create/create";
import { deleteApiKey } from "#src/services/api-key/delete/delete";
import { disableApiKey } from "#src/services/api-key/disable/disable";
import { enableApiKey } from "#src/services/api-key/enable/enable";
import { getApiKey } from "#src/services/api-key/get/get";
import { listApiKeys } from "#src/services/api-key/list/list";
import { rotateApiKey } from "#src/services/api-key/rotate/rotate";
import type {
	ApiKey,
	ApiKeyListParams,
	ApiKeyListResponse,
	ApiKeyWithKey,
	CreateApiKeyParams,
	DeleteApiKeyResponse,
	UpdateApiKeyParams,
} from "#src/services/api-key/types";
import { updateApiKey } from "#src/services/api-key/update/update";

/**
 * API key resource module — one method per backend route under `/api/api-key/v1`.
 * Invalid input throws {@link ReloopValidationError} before any HTTP call.
 */
export class ApiKeyService {
	constructor(private readonly client: ReloopClient) {}

	async create(params: CreateApiKeyParams): Promise<ReloopResult<ApiKeyWithKey>> {
		return createApiKey(this.client, params);
	}

	async list(params?: ApiKeyListParams): Promise<ReloopResult<ApiKeyListResponse>> {
		return listApiKeys(this.client, params);
	}

	async get(id: string): Promise<ReloopResult<ApiKey>> {
		return getApiKey(this.client, id);
	}

	async update(
		id: string,
		params: UpdateApiKeyParams,
	): Promise<ReloopResult<ApiKey>> {
		return updateApiKey(this.client, id, params);
	}

	async delete(id: string): Promise<ReloopResult<DeleteApiKeyResponse>> {
		return deleteApiKey(this.client, id);
	}

	async rotate(id: string): Promise<ReloopResult<ApiKeyWithKey>> {
		return rotateApiKey(this.client, id);
	}

	async enable(id: string): Promise<ReloopResult<ApiKey>> {
		return enableApiKey(this.client, id);
	}

	async disable(id: string): Promise<ReloopResult<ApiKey>> {
		return disableApiKey(this.client, id);
	}
}
