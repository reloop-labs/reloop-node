export interface ApiKey {
	id: string;
	name: string | null;
	start: string | null;
	prefix: string | null;
	organizationId: string;
	userId: string;
	refillInterval: number | null;
	refillAmount: number | null;
	lastRefillAt: string | null;
	enabled: boolean;
	rateLimitEnabled: boolean;
	rateLimitTimeWindow: number;
	rateLimitMax: number;
	requestCount: number;
	remaining: number | null;
	lastRequest: string | null;
	expiresAt: string | null;
	createdAt: string;
	updatedAt: string;
	permissions: string | null;
	metadata: string | null;
	createdBy?: {
		id: string;
		name: string | null;
		image: string | null;
		email: string;
	};
	object: "api_key";
	event: string;
}

export interface ApiKeyWithKey {
	id: string;
	name: string | null;
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

export interface ApiKeyListParams {
	page?: number;
	limit?: number;
	enabled?: boolean;
	userId?: string;
	q?: string;
}

export interface DeleteApiKeyResponse {
	id: string;
	message: string;
	object: "api_key";
	event: string;
}

export interface CreateApiKeyParams {
	name: string;
}

export interface UpdateApiKeyParams {
	name: string;
}
