import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/group/errors";
import { requireLimit, requirePage } from "@/services/contacts/group/fields";
import { groupListPath } from "@/services/contacts/group/paths";
import {
	toGroupListResult,
	type GroupListResult,
} from "@/services/contacts/group/result";
import type {
	GroupListResponse,
	ListGroupsParams,
} from "@/services/contacts/group/types";

function validateListParams(
	params?: ListGroupsParams | null,
): ListGroupsParams | undefined {
	if (params === undefined || params === null) {
		return undefined;
	}
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}

	const out: ListGroupsParams = {};
	if (params.page !== undefined) out.page = requirePage(params.page);
	if (params.limit !== undefined) out.limit = requireLimit(params.limit);
	if (params.search !== undefined) {
		if (typeof params.search !== "string") {
			throw new ReloopValidationError(
				"list search must be a string when provided.",
				"search",
			);
		}
		out.search = params.search;
	}
	return out;
}

export async function listGroups(
	client: ReloopClient,
	params?: ListGroupsParams,
): Promise<GroupListResult> {
	const valid = validateListParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.page !== undefined) searchParams.set("page", valid.page.toString());
	if (valid?.limit !== undefined) {
		searchParams.set("limit", valid.limit.toString());
	}
	if (valid?.search) searchParams.set("search", valid.search);

	const result = await client.fetch<GroupListResponse>(
		groupListPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toGroupListResult(result);
}
