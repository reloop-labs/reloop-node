import type { ReloopClient } from "@/client";
import { requireAutomationId } from "@/services/automation/fields";
import { automationAction } from "@/services/automation/paths";
import {
	type AutomationResult,
	toAutomationResult,
} from "@/services/automation/result";
import type { Automation } from "@/services/automation/types";

export async function activateAutomation(
	client: ReloopClient,
	id: string,
): Promise<AutomationResult<Automation>> {
	const automationId = requireAutomationId(id);
	const result = await client.fetch<Automation>(
		automationAction(automationId, "activate"),
		{ method: "POST" },
	);
	return toAutomationResult(result);
}
