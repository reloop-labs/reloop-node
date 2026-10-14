import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/automation/errors";
import { requireLimit, requirePage } from "@/services/automation/fields";
import { automationsPath } from "@/services/automation/paths";
import {
	type AutomationListResult,
	toAutomationListResult,
} from "@/services/automation/result";
import type {
	AutomationListResponse,
	ListAutomationsParams,
} from "@/services/automation/types";

export async function listAutomations(
	client: ReloopClient,
	params?: ListAutomationsParams,
): Promise<AutomationListResult> {
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
	const result = await client.fetch<AutomationListResponse>(
		automationsPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toAutomationListResult(result);
}
