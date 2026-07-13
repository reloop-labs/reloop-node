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

/**
 * API key resource module — one method per backend route under `/api/api-key/v1`.
 * Wire contract: create, list, get, update, delete, rotate, enable, disable.
 */
export class ApiKeyService {
	constructor(private readonly client: ReloopClient) {}

	/** POST `/api/api-key/v1/` — creates a key; response includes the secret once. */
	async create(params: CreateApiKeyParams): Promise<ReloopResult<ApiKeyWithKey>> {
		return this.client.fetch<ApiKeyWithKey>("/api/api-key/v1/", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}

	/** GET `/api/api-key/v1/` — list with optional page, limit, enabled, userId, q. */
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

	/** GET `/api/api-key/v1/:id` */
	async get(id: string): Promise<ReloopResult<ApiKey>> {
		return this.client.fetch<ApiKey>(`/api/api-key/v1/${id}`, {
			method: "GET",
		});
	}

	/** PATCH `/api/api-key/v1/:id` */
	async update(id: string, params: UpdateApiKeyParams): Promise<ReloopResult<ApiKey>> {
		return this.client.fetch<ApiKey>(`/api/api-key/v1/${id}`, {
			method: "PATCH",
			body: JSON.stringify(params),
		});
	}

	/** DELETE `/api/api-key/v1/:id` */
	async delete(id: string): Promise<ReloopResult<DeleteApiKeyResponse>> {
		return this.client.fetch<DeleteApiKeyResponse>(`/api/api-key/v1/${id}`, {
			method: "DELETE",
		});
	}

	/** POST `/api/api-key/v1/rotate/:id` — returns a new secret once. */
	async rotate(id: string): Promise<ReloopResult<ApiKeyWithKey>> {
		return this.client.fetch<ApiKeyWithKey>(`/api/api-key/v1/rotate/${id}`, {
			method: "POST",
		});
	}

	/** POST `/api/api-key/v1/enable/:id` */
	async enable(id: string): Promise<ReloopResult<ApiKey>> {
		return this.client.fetch<ApiKey>(`/api/api-key/v1/enable/${id}`, {
			method: "POST",
		});
	}

	/** POST `/api/api-key/v1/disable/:id` */
	async disable(id: string): Promise<ReloopResult<ApiKey>> {
		return this.client.fetch<ApiKey>(`/api/api-key/v1/disable/${id}`, {
			method: "POST",
		});
	}
}
