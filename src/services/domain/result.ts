import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { DomainListResponse } from "@/services/domain/types";

export type DomainResult<T> =
	| { domain: T; domainError: null }
	| { domain: null; domainError: ReloopApiError };

export type DomainListResult =
	| { domains: DomainListResponse; domainError: null }
	| { domains: null; domainError: ReloopApiError };

export function toDomainResult<T>(result: ReloopResult<T>): DomainResult<T> {
	if (result.error) {
		return { domain: null, domainError: result.error };
	}
	return { domain: result.response as T, domainError: null };
}

export function toDomainListResult(
	result: ReloopResult<DomainListResponse>,
): DomainListResult {
	if (result.error) {
		return { domains: null, domainError: result.error };
	}
	return {
		domains: result.response as DomainListResponse,
		domainError: null,
	};
}
