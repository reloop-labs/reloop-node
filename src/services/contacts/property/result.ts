import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { PropertyListResponse } from "@/services/contacts/property/types";

export type PropertyResult<T> =
	| { property: T; propertyError: null }
	| { property: null; propertyError: ReloopApiError };

export type PropertyListResult =
	| { properties: PropertyListResponse; propertyError: null }
	| { properties: null; propertyError: ReloopApiError };

export function toPropertyResult<T>(result: ReloopResult<T>): PropertyResult<T> {
	if (result.error) {
		return { property: null, propertyError: result.error };
	}
	return { property: result.response as T, propertyError: null };
}

export function toPropertyListResult(
	result: ReloopResult<PropertyListResponse>,
): PropertyListResult {
	if (result.error) {
		return { properties: null, propertyError: result.error };
	}
	return {
		properties: result.response as PropertyListResponse,
		propertyError: null,
	};
}
