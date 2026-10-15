import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/automation/errors";
import {
	optionalDescription,
	requireTriggerName,
	requireTriggerRef,
	requireParamsObject,
	requireProperties,
} from "@/services/automation/trigger/fields";
import { triggerById } from "@/services/automation/trigger/paths";
import { type TriggerResult, toTriggerResult } from "@/services/automation/trigger/result";
import type { AutomationTrigger, UpdateTriggerParams } from "@/services/automation/trigger/types";

function validateUpdateParams(
	params: UpdateTriggerParams | null | undefined,
): UpdateTriggerParams {
	const input = requireParamsObject(params, "update");
	const body: UpdateTriggerParams = {};
	if (input.name !== undefined) body.name = requireTriggerName(input.name);
	const description = optionalDescription(input.description);
	if (description !== undefined) body.description = description;
	if (input.properties !== undefined) {
		body.properties = requireProperties(input.properties);
	}
	if (Object.keys(body).length === 0) {
		throw new ReloopValidationError(
			"update requires at least one of name, description or properties.",
			"params",
		);
	}
	return body;
}

export async function updateTrigger(
	client: ReloopClient,
	id: string,
	params: UpdateTriggerParams,
): Promise<TriggerResult<AutomationTrigger>> {
	const ref = requireTriggerRef(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<AutomationTrigger>(triggerById(ref), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return toTriggerResult(result);
}
