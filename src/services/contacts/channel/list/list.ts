import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/channel/errors";
import { requireLimit, requirePage } from "@/services/contacts/channel/fields";
import { channelListPath } from "@/services/contacts/channel/paths";
import {
	toChannelListResult,
	type ChannelListResult,
} from "@/services/contacts/channel/result";
import type {
	ChannelListResponse,
	ListChannelsParams,
} from "@/services/contacts/channel/types";

function validateListParams(
	params?: ListChannelsParams | null,
): ListChannelsParams | undefined {
	if (params === undefined || params === null) {
		return undefined;
	}
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}

	const out: ListChannelsParams = {};
	if (params.page !== undefined) out.page = requirePage(params.page);
	if (params.limit !== undefined) out.limit = requireLimit(params.limit);
	return out;
}

export async function listChannels(
	client: ReloopClient,
	params?: ListChannelsParams,
): Promise<ChannelListResult> {
	const valid = validateListParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.page !== undefined) searchParams.set("page", valid.page.toString());
	if (valid?.limit !== undefined) {
		searchParams.set("limit", valid.limit.toString());
	}

	const result = await client.fetch<ChannelListResponse>(
		channelListPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toChannelListResult(result);
}
