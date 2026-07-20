import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/property/errors";
import {
	requireLimit,
	requirePage,
	requirePropertyType,
} from "@/services/contacts/property/fields";
import { propertyListPath } from "@/services/contacts/property/paths";
import {
	toPropertyListResult,
	type PropertyListResult,
} from "@/services/contacts/property/result";
import type {
	ListPropertiesParams,
	PropertyListResponse,
} from "@/services/contacts/property/types";

function validateListParams(
	params?: ListPropertiesParams | null,
): ListPropertiesParams | undefined {
	if (params === undefined || params === null) {
		return undefined;
	}
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}

	const out: ListPropertiesParams = {};

	if (params.page !== undefined) {
		out.page = requirePage(params.page);
	}
	if (params.limit !== undefined) {
		out.limit = requireLimit(params.limit);
	}
	if (params.search !== undefined) {
		if (typeof params.search !== "string") {
			throw new ReloopValidationError(
				"list search must be a string when provided.",
				"search",
			);
		}
		out.search = params.search;
	}
	if (params.type !== undefined) {
		out.type = requirePropertyType(params.type);
	}

	return out;
}

export async function listProperties(
	client: ReloopClient,
	params?: ListPropertiesParams,
): Promise<PropertyListResult> {
	const valid = validateListParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.page !== undefined) searchParams.set("page", valid.page.toString());
	if (valid?.limit !== undefined) {
		searchParams.set("limit", valid.limit.toString());
	}
	if (valid?.search) searchParams.set("search", valid.search);
	if (valid?.type) searchParams.set("type", valid.type);

	const path = propertyListPath(searchParams.toString());
	const result = await client.fetch<PropertyListResponse>(path, {
		method: "GET",
	});
	return toPropertyListResult(result);
}
