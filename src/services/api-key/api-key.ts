import type { ReloopClient } from "../../client";
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

	async create(params: CreateApiKeyParams): Promise<ApiKeyWithKey> {
		return this.client.fetch<ApiKeyWithKey>("/api-key/v1/", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}

	async list(params?: ApiKeyListParams): Promise<ApiKeyListResponse> {
		const searchParams = new URLSearchParams();
		if (params?.page !== undefined) searchParams.set("page", params.page.toString());
		if (params?.limit !== undefined) searchParams.set("limit", params.limit.toString());
		if (params?.enabled !== undefined) searchParams.set("enabled", params.enabled.toString());
		if (params?.userId) searchParams.set("userId", params.userId);
		if (params?.q) searchParams.set("q", params.q);

		const queryString = searchParams.toString();
		const path = `/api-key/v1/${queryString ? `?${queryString}` : ""}`;

		return this.client.fetch<ApiKeyListResponse>(path, {
			method: "GET",
		});
	}

	async get(id: string): Promise<ApiKey> {
		return this.client.fetch<ApiKey>(`/api-key/v1/${id}`, {
			method: "GET",
		});
	}

	async update(id: string, params: UpdateApiKeyParams): Promise<ApiKey> {
		return this.client.fetch<ApiKey>(`/api-key/v1/${id}`, {
			method: "PATCH",
			body: JSON.stringify(params),
		});
	}

	async delete(id: string): Promise<DeleteApiKeyResponse> {
		return this.client.fetch<DeleteApiKeyResponse>(`/api-key/v1/${id}`, {
			method: "DELETE",
		});
	}

	async rotate(id: string): Promise<ApiKeyWithKey> {
		return this.client.fetch<ApiKeyWithKey>(`/api-key/v1/rotate/${id}`, {
			method: "POST",
		});
	}

	async enable(id: string): Promise<ApiKey> {
		return this.client.fetch<ApiKey>(`/api-key/v1/enable/${id}`, {
			method: "POST",
		});
	}

	async disable(id: string): Promise<ApiKey> {
		return this.client.fetch<ApiKey>(`/api-key/v1/disable/${id}`, {
			method: "POST",
		});
	}
}
