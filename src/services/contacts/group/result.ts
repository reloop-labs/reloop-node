import type { ReloopApiError, ReloopResult } from "@/core/result";
import type {
	GroupContactListResponse,
	GroupListResponse,
} from "@/services/contacts/group/types";

export type GroupResult<T> =
	| { group: T; groupError: null }
	| { group: null; groupError: ReloopApiError };

export type GroupListResult =
	| { groups: GroupListResponse; groupError: null }
	| { groups: null; groupError: ReloopApiError };

export type GroupContactsResult =
	| { contacts: GroupContactListResponse; groupError: null }
	| { contacts: null; groupError: ReloopApiError };

export function toGroupResult<T>(result: ReloopResult<T>): GroupResult<T> {
	if (result.error) {
		return { group: null, groupError: result.error };
	}
	return { group: result.response as T, groupError: null };
}

export function toGroupListResult(
	result: ReloopResult<GroupListResponse>,
): GroupListResult {
	if (result.error) {
		return { groups: null, groupError: result.error };
	}
	return { groups: result.response as GroupListResponse, groupError: null };
}

export function toGroupContactsResult(
	result: ReloopResult<GroupContactListResponse>,
): GroupContactsResult {
	if (result.error) {
		return { contacts: null, groupError: result.error };
	}
	return {
		contacts: result.response as GroupContactListResponse,
		groupError: null,
	};
}
