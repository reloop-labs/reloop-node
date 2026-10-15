import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/automation/errors";
import { requireLimit, requirePage } from "@/services/automation/trigger/fields";
import { triggersPath } from "@/services/automation/trigger/paths";
import {
	type TriggerListResult,
	toTriggerListResult,
} from "@/services/automation/trigger/result";
import type {
	TriggerListResponse,
	ListTriggersParams,
} from "@/services/automation/trigger/types";

export async function listTriggers(
	client: ReloopClient,
	params?: ListTriggersParams,
): Promise<TriggerListResult> {
	if (params !== undefined && params !== null && typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}
	const searchParams = new URLSearchParams();
	if (params?.page !== undefined) {
		searchParams.set("page", requirePage(params.page).toString());
	}
	if (params?.limit !== undefined) {
		searchParams.set("limit", requireLimit(params.limit).toString());
	}
	const result = await client.fetch<TriggerListResponse>(
		triggersPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toTriggerListResult(result);
}
