import type { ReloopClient } from "@/client";
import { createApiKey } from "@/services/api-key/create/create";
import { deleteApiKey } from "@/services/api-key/delete/delete";
import { disableApiKey } from "@/services/api-key/disable/disable";
import { enableApiKey } from "@/services/api-key/enable/enable";
import { getApiKey } from "@/services/api-key/get/get";
import { listApiKeys } from "@/services/api-key/list/list";
import type {
	ApiKeyListResult,
	ApiKeyResult,
} from "@/services/api-key/result";
import { rotateApiKey } from "@/services/api-key/rotate/rotate";
import type {
	ApiKey,
	ApiKeyListParams,
	ApiKeyWithKey,
	CreateApiKeyParams,
	DeleteApiKeyResponse,
	UpdateApiKeyParams,
} from "@/services/api-key/types";
import { updateApiKey } from "@/services/api-key/update/update";

export class ApiKeyService {
	constructor(private readonly client: ReloopClient) {}

	async create(
		params: CreateApiKeyParams,
	): Promise<ApiKeyResult<ApiKeyWithKey>> {
		return createApiKey(this.client, params);
	}

	async list(params?: ApiKeyListParams): Promise<ApiKeyListResult> {
		return listApiKeys(this.client, params);
	}

	async get(id: string): Promise<ApiKeyResult<ApiKey>> {
		return getApiKey(this.client, id);
	}

	async update(
		id: string,
		params: UpdateApiKeyParams,
	): Promise<ApiKeyResult<ApiKey>> {
		return updateApiKey(this.client, id, params);
	}

	async delete(id: string): Promise<ApiKeyResult<DeleteApiKeyResponse>> {
		return deleteApiKey(this.client, id);
	}

	async rotate(id: string): Promise<ApiKeyResult<ApiKeyWithKey>> {
		return rotateApiKey(this.client, id);
	}

	async enable(id: string): Promise<ApiKeyResult<ApiKey>> {
		return enableApiKey(this.client, id);
	}

	async disable(id: string): Promise<ApiKeyResult<ApiKey>> {
		return disableApiKey(this.client, id);
	}
}
