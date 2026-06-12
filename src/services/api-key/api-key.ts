import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import type {
	ApiKey,
	ApiKeyListParams,
	ApiKeyListResponse,
	ApiKeyWithKey,
	CreateApiKeyParams,
	DeleteApiKeyResponse,
	UpdateApiKeyParams,
} from "./types";

export class ApiKeyService {
	constructor(private readonly client: ReloopClient) {}

	async create(params: CreateApiKeyParams): Promise<ReloopResult<ApiKeyWithKey>> {
		return this.client.fetch<ApiKeyWithKey>("/api/api-key/v1/", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}

	async list(params?: ApiKeyListParams): Promise<ReloopResult<ApiKeyListResponse>> {
		const searchParams = new URLSearchParams();
		if (params?.page !== undefined) searchParams.set("page", params.page.toString());
		if (params?.limit !== undefined) searchParams.set("limit", params.limit.toString());
		if (params?.enabled !== undefined) searchParams.set("enabled", params.enabled.toString());
		if (params?.userId) searchParams.set("userId", params.userId);
		if (params?.q) searchParams.set("q", params.q);

		const queryString = searchParams.toString();
		const path = `/api/api-key/v1/${queryString ? `?${queryString}` : ""}`;

		return this.client.fetch<ApiKeyListResponse>(path, {
			method: "GET",
		});
	}

	async get(id: string): Promise<ReloopResult<ApiKey>> {
		return this.client.fetch<ApiKey>(`/api/api-key/v1/${id}`, {
			method: "GET",
		});
	}

	async update(id: string, params: UpdateApiKeyParams): Promise<ReloopResult<ApiKey>> {
		return this.client.fetch<ApiKey>(`/api/api-key/v1/${id}`, {
			method: "PATCH",
			body: JSON.stringify(params),
		});
	}

	async delete(id: string): Promise<ReloopResult<DeleteApiKeyResponse>> {
		return this.client.fetch<DeleteApiKeyResponse>(`/api/api-key/v1/${id}`, {
			method: "DELETE",
		});
	}

	async rotate(id: string): Promise<ReloopResult<ApiKeyWithKey>> {
		return this.client.fetch<ApiKeyWithKey>(`/api/api-key/v1/rotate/${id}`, {
			method: "POST",
		});
	}

	async enable(id: string): Promise<ReloopResult<ApiKey>> {
		return this.client.fetch<ApiKey>(`/api/api-key/v1/enable/${id}`, {
			method: "POST",
		});
	}

	async disable(id: string): Promise<ReloopResult<ApiKey>> {
		return this.client.fetch<ApiKey>(`/api/api-key/v1/disable/${id}`, {
			method: "POST",
		});
	}

	/** Pauses an API key (alias for {@link disable}). */
	async pause(id: string): Promise<ReloopResult<ApiKey>> {
		return this.disable(id);
	}
}
