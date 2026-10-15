import type { ReloopClient } from "@/client";
import { requireTriggerRef } from "@/services/automation/trigger/fields";
import { triggerById } from "@/services/automation/trigger/paths";
import { type TriggerResult, toTriggerResult } from "@/services/automation/trigger/result";
import type { AutomationTrigger } from "@/services/automation/trigger/types";

export async function getTrigger(
	client: ReloopClient,
	idOrKey: string,
): Promise<TriggerResult<AutomationTrigger>> {
	const ref = requireTriggerRef(idOrKey);
	const result = await client.fetch<AutomationTrigger>(triggerById(ref), {
		method: "GET",
	});
	return toTriggerResult(result);
}
