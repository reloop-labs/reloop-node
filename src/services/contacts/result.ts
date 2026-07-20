import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { ContactListResponse } from "@/services/contacts/types";

export type ContactResult<T> =
	| { contact: T; contactError: null }
	| { contact: null; contactError: ReloopApiError };

export type ContactListResult =
	| { contacts: ContactListResponse; contactError: null }
	| { contacts: null; contactError: ReloopApiError };

export function toContactResult<T>(result: ReloopResult<T>): ContactResult<T> {
	if (result.error) {
		return { contact: null, contactError: result.error };
	}
	return { contact: result.response as T, contactError: null };
}

export function toContactListResult(
	result: ReloopResult<ContactListResponse>,
): ContactListResult {
	if (result.error) {
		return { contacts: null, contactError: result.error };
	}
	return {
		contacts: result.response as ContactListResponse,
		contactError: null,
	};
}
