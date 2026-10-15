import type { ReloopClient } from "@/client";
import {
	optionalDescription,
	requireTriggerName,
	requireParamsObject,
	requireProperties,
} from "@/services/automation/trigger/fields";
import { triggersPath } from "@/services/automation/trigger/paths";
import { type TriggerResult, toTriggerResult } from "@/services/automation/trigger/result";
import type { CreateTriggerParams, AutomationTrigger } from "@/services/automation/trigger/types";

function validateCreateParams(
	params: CreateTriggerParams | null | undefined,
): CreateTriggerParams {
	const input = requireParamsObject(params, "create");
	const body: CreateTriggerParams = { name: requireTriggerName(input.name) };
	if (input.key !== undefined) body.key = requireTriggerName(input.key, "key");
	const description = optionalDescription(input.description);
	if (typeof description === "string") body.description = description;
	if (input.properties !== undefined) {
		body.properties = requireProperties(input.properties);
	}
	return body;
}

export async function createTrigger(
	client: ReloopClient,
	params: CreateTriggerParams,
): Promise<TriggerResult<AutomationTrigger>> {
	const body = validateCreateParams(params);
	const result = await client.fetch<AutomationTrigger>(triggersPath(), {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toTriggerResult(result);
}
