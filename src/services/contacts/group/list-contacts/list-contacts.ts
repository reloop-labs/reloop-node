import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/group/errors";
import {
	requireContactStatus,
	requireGroupId,
	requireLimit,
	requirePage,
} from "@/services/contacts/group/fields";
import { groupContactsPath } from "@/services/contacts/group/paths";
import {
	toGroupContactsResult,
	type GroupContactsResult,
} from "@/services/contacts/group/result";
import type {
	GroupContactListResponse,
	ListGroupContactsParams,
} from "@/services/contacts/group/types";

function validateListContactsParams(
	params?: ListGroupContactsParams | null,
): ListGroupContactsParams | undefined {
	if (params === undefined || params === null) {
		return undefined;
	}
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"listContacts params must be an object when provided.",
			"params",
		);
	}

	const out: ListGroupContactsParams = {};
	if (params.page !== undefined) out.page = requirePage(params.page);
	if (params.limit !== undefined) out.limit = requireLimit(params.limit);
	if (params.search !== undefined) {
		if (typeof params.search !== "string") {
			throw new ReloopValidationError(
				"listContacts search must be a string when provided.",
				"search",
			);
		}
		out.search = params.search;
	}
	if (params.status !== undefined) {
		out.status = requireContactStatus(params.status);
	}
	return out;
}

export async function listGroupContacts(
	client: ReloopClient,
	id: string,
	params?: ListGroupContactsParams,
): Promise<GroupContactsResult> {
	const groupId = requireGroupId(id);
	const valid = validateListContactsParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.page !== undefined) searchParams.set("page", valid.page.toString());
	if (valid?.limit !== undefined) {
		searchParams.set("limit", valid.limit.toString());
	}
	if (valid?.search) searchParams.set("search", valid.search);
	if (valid?.status) searchParams.set("status", valid.status);

	const result = await client.fetch<GroupContactListResponse>(
		groupContactsPath(groupId, searchParams.toString()),
		{ method: "GET" },
	);
	return toGroupContactsResult(result);
}
