import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { ApiKeyListResponse } from "@/services/api-key/types";

export type ApiKeyResult<T> =
	| { apiKey: T; apiKeyError: null }
	| { apiKey: null; apiKeyError: ReloopApiError };

export type ApiKeyListResult =
	| { apiKeys: ApiKeyListResponse; apiKeyError: null }
	| { apiKeys: null; apiKeyError: ReloopApiError };

export function toApiKeyResult<T>(result: ReloopResult<T>): ApiKeyResult<T> {
	if (result.error) {
		return { apiKey: null, apiKeyError: result.error };
	}
	return { apiKey: result.response as T, apiKeyError: null };
}

export function toApiKeyListResult(
	result: ReloopResult<ApiKeyListResponse>,
): ApiKeyListResult {
	if (result.error) {
		return { apiKeys: null, apiKeyError: result.error };
	}
	return { apiKeys: result.response as ApiKeyListResponse, apiKeyError: null };
}
