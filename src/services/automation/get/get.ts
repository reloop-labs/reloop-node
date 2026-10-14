import type { ReloopClient } from "@/client";
import { requireAutomationId } from "@/services/automation/fields";
import { automationById } from "@/services/automation/paths";
import {
	type AutomationResult,
	toAutomationResult,
} from "@/services/automation/result";
import type { Automation } from "@/services/automation/types";

export async function getAutomation(
	client: ReloopClient,
	id: string,
): Promise<AutomationResult<Automation>> {
	const automationId = requireAutomationId(id);
	const result = await client.fetch<Automation>(automationById(automationId), {
		method: "GET",
	});
	return toAutomationResult(result);
}
