import type { ReloopClient } from "@/client";
import type { ReloopResult } from "@/core/result";
import { createApiKey } from "@/services/api-key/create/create";
import { deleteApiKey } from "@/services/api-key/delete/delete";
import { disableApiKey } from "@/services/api-key/disable/disable";
import { enableApiKey } from "@/services/api-key/enable/enable";
import { getApiKey } from "@/services/api-key/get/get";
import { listApiKeys } from "@/services/api-key/list/list";
import { rotateApiKey } from "@/services/api-key/rotate/rotate";
import type {
	ApiKey,
	ApiKeyListParams,
	ApiKeyListResponse,
	ApiKeyWithKey,
	CreateApiKeyParams,
	DeleteApiKeyResponse,
	UpdateApiKeyParams,
} from "@/services/api-key/types";
import { updateApiKey } from "@/services/api-key/update/update";

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
