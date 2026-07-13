/**
 * Types mirror the backend api-key service OpenAPI models (`ApiKeyModel`).
 * Field names and nullability match the wire JSON 1:1.
 * Runtime input checks live next to each op (throw before any HTTP call).
 */

/** Creator summary optionally embedded on get/list detail responses. */
export interface ApiKeyCreatedBy {
	id: string;
	name: string | null;
	image: string | null;
	email: string;
}

/** Full API key record (list item / get / update / enable / disable). */
export interface ApiKey {
	id: string;
	name: string | null;
	/** Start of the API key (for display). */
	start: string | null;
	prefix: string | null;
	/** Refill interval in milliseconds. */
	refillInterval: number | null;
	refillAmount: number | null;
	lastRefillAt: string | null;
	enabled: boolean;
	rateLimitEnabled: boolean;
	/** Rate limit time window in milliseconds. */
	rateLimitTimeWindow: number;
	rateLimitMax: number;
	requestCount: number;
	remaining: number | null;
	lastRequest: string | null;
	expiresAt: string | null;
	createdAt: string;
	updatedAt: string;
	/** Comma-separated permissions. */
	permissions: string | null;
	/** JSON metadata string. */
	metadata: string | null;
	createdBy?: ApiKeyCreatedBy;
	object: "api_key";
	event: string;
}

/** Create/rotate response — includes full secret once. */
export interface ApiKeyWithKey {
	id: string;
	name: string | null;
	/** Full API key (only shown once). */
	key: string;
	enabled: boolean;
	createdAt: string;
	updatedAt: string;
	permissions: string | null;
	object: "api_key";
	event: string;
}

export interface ApiKeyListResponse {
	object: "api_key";
	apiKeys: ApiKey[];
	total: number;
	page: number;
	limit: number;
	event: string;
}

/** Query params for GET `/api/api-key/v1/` (backend `apiKeyQuery`). */
export interface ApiKeyListParams {
	page?: number;
	limit?: number;
	enabled?: boolean;
	userId?: string;
	/** Search query to filter keys by name. */
	q?: string;
}

export interface DeleteApiKeyResponse {
	id: string;
	message: string;
	object: "api_key";
	event: string;
}

/** POST body for create (backend `createApiKeyBody`). */
export interface CreateApiKeyParams {
	name: string;
}

/** PATCH body for update (backend `updateApiKeyBody`). */
export interface UpdateApiKeyParams {
	name: string;
}
