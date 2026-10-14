import type { ReloopClient } from "@/client";
import { requireAutomationId } from "@/services/automation/fields";
import { automationById } from "@/services/automation/paths";
import {
	type AutomationResult,
	toAutomationResult,
} from "@/services/automation/result";
import type { DeleteAutomationResponse } from "@/services/automation/types";

export async function deleteAutomation(
	client: ReloopClient,
	id: string,
): Promise<AutomationResult<DeleteAutomationResponse>> {
	const automationId = requireAutomationId(id);
	const result = await client.fetch<DeleteAutomationResponse>(
		automationById(automationId),
		{ method: "DELETE" },
	);
	return toAutomationResult(result);
}
