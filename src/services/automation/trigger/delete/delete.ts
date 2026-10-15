import type { ReloopClient } from "@/client";
import { requireTriggerRef } from "@/services/automation/trigger/fields";
import { triggerById } from "@/services/automation/trigger/paths";
import { type TriggerResult, toTriggerResult } from "@/services/automation/trigger/result";
import type { DeleteTriggerResponse } from "@/services/automation/trigger/types";

export async function deleteTrigger(
	client: ReloopClient,
	id: string,
): Promise<TriggerResult<DeleteTriggerResponse>> {
	const ref = requireTriggerRef(id);
	const result = await client.fetch<DeleteTriggerResponse>(triggerById(ref), {
		method: "DELETE",
	});
	return toTriggerResult(result);
}
