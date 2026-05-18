import type { ReloopClient } from "@/client";
import type { PaginatedResponse } from "@/core/types";
import type { ApiKey, ApiKeyWithKey } from "@/services/api-key/types";

export class ApiKeyService {
	constructor(private readonly client: ReloopClient) {}

	async create(params: { name: string }): Promise<ApiKeyWithKey> {
		return this.client.fetch<ApiKeyWithKey>("/api-key/v1/", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}

	async list(params?: {
		page?: number;
		limit?: number;
	}): Promise<PaginatedResponse<ApiKey>> {
		const searchParams = new URLSearchParams();
		if (params?.page) searchParams.set("page", params.page.toString());
		if (params?.limit) searchParams.set("limit", params.limit.toString());

		const queryString = searchParams.toString();
		const path = `/api-key/v1/${queryString ? `?${queryString}` : ""}`;

		return this.client.fetch<PaginatedResponse<ApiKey>>(path, {
			method: "GET",
		});
	}

	async get(id: string): Promise<ApiKey> {
		return this.client.fetch<ApiKey>(`/api-key/v1/${id}`, {
			method: "GET",
		});
	}

	async update(id: string, params: { name: string }): Promise<ApiKey> {
		return this.client.fetch<ApiKey>(`/api-key/v1/${id}`, {
			method: "PATCH",
			body: JSON.stringify(params),
		});
	}

	async delete(id: string): Promise<void> {
		return this.client.fetch<void>(`/api-key/v1/${id}`, {
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
