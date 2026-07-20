import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/domain/errors";
import {
	optionalDomainStatus,
	requireLimit,
	requirePage,
} from "@/services/domain/fields";
import { domainListPath } from "@/services/domain/paths";
import {
	toDomainListResult,
	type DomainListResult,
} from "@/services/domain/result";
import type {
	DomainListResponse,
	ListDomainsParams,
} from "@/services/domain/types";

function validateListParams(
	params?: ListDomainsParams | null,
): ListDomainsParams | undefined {
	if (params === undefined || params === null) {
		return undefined;
	}
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}

	const out: ListDomainsParams = {};
	if (params.page !== undefined) out.page = requirePage(params.page);
	if (params.limit !== undefined) out.limit = requireLimit(params.limit);
	if (params.q !== undefined) {
		if (typeof params.q !== "string") {
			throw new ReloopValidationError(
				"list q must be a string when provided.",
				"q",
			);
		}
		out.q = params.q;
	}
	if (params.status !== undefined) {
		out.status = optionalDomainStatus(params.status);
	}
	return out;
}

export async function listDomains(
	client: ReloopClient,
	params?: ListDomainsParams,
): Promise<DomainListResult> {
	const valid = validateListParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.page !== undefined) searchParams.set("page", valid.page.toString());
	if (valid?.limit !== undefined) {
		searchParams.set("limit", valid.limit.toString());
	}
	if (valid?.q) searchParams.set("q", valid.q);
	if (valid?.status) searchParams.set("status", valid.status);

	const result = await client.fetch<DomainListResponse>(
		domainListPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toDomainListResult(result);
}
