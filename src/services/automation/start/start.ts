import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/automation/errors";
import {
	requireContactTarget,
	requireParamsObject,
} from "@/services/automation/fields";
import {
	type AutomationResult,
	toAutomationResult,
} from "@/services/automation/result";
import { requireTriggerRef } from "@/services/automation/trigger/fields";
import { AUTOMATION_START } from "@/services/automation/trigger/paths";
import type {
	StartAutomationParams,
	StartAutomationResponse,
} from "@/services/automation/types";

function validateStartParams(
	params: StartAutomationParams | null | undefined,
): StartAutomationParams {
	const input = requireParamsObject(params, "start");
	const event = requireTriggerRef(input.event, "event");
	const body: StartAutomationParams = {
		event,
		...requireContactTarget(input as unknown as Record<string, unknown>),
	};
	if (input.properties !== undefined) {
		if (
			typeof input.properties !== "object" ||
			input.properties === null ||
			Array.isArray(input.properties)
		) {
			throw new ReloopValidationError(
				"start properties must be an object.",
				"properties",
			);
		}
		body.properties = input.properties;
	}
	return body;
}

export async function startAutomation(
	client: ReloopClient,
	params: StartAutomationParams,
): Promise<AutomationResult<StartAutomationResponse>> {
	const body = validateStartParams(params);
	const result = await client.fetch<StartAutomationResponse>(AUTOMATION_START, {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toAutomationResult(result);
}
