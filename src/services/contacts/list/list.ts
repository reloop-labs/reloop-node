import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/errors";
import {
	optionalContactStatus,
	requireLimit,
	requirePage,
} from "@/services/contacts/fields";
import { contactListPath } from "@/services/contacts/paths";
import {
	toContactListResult,
	type ContactListResult,
} from "@/services/contacts/result";
import type {
	ContactListResponse,
	ListContactsParams,
} from "@/services/contacts/types";

function validateListParams(
	params?: ListContactsParams | null,
): ListContactsParams | undefined {
	if (params === undefined || params === null) {
		return undefined;
	}
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}

	const out: ListContactsParams = {};
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
	if (params.status !== undefined) {
		out.status = optionalContactStatus(params.status, "status");
	}
	return out;
}

export async function listContacts(
	client: ReloopClient,
	params?: ListContactsParams,
): Promise<ContactListResult> {
	const valid = validateListParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.page !== undefined) searchParams.set("page", valid.page.toString());
	if (valid?.limit !== undefined) {
		searchParams.set("limit", valid.limit.toString());
	}
	if (valid?.search) searchParams.set("search", valid.search);
	if (valid?.status) searchParams.set("status", valid.status);

	const result = await client.fetch<ContactListResponse>(
		contactListPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toContactListResult(result);
}
