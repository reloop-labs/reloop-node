import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/automation/errors";
import {
	optionalDescription,
	optionalStatus,
	requireAutomationId,
	requireConnections,
	requireName,
	requireParamsObject,
	requireSteps,
} from "@/services/automation/fields";
import { automationById } from "@/services/automation/paths";
import {
	type AutomationResult,
	toAutomationResult,
} from "@/services/automation/result";
import type {
	Automation,
	UpdateAutomationParams,
} from "@/services/automation/types";

function validateUpdateParams(
	params: UpdateAutomationParams | null | undefined,
): UpdateAutomationParams {
	const input = requireParamsObject(params, "update");
	const body: UpdateAutomationParams = {};

	if (input.name !== undefined) body.name = requireName(input.name);
	const description = optionalDescription(input.description);
	if (description !== undefined) body.description = description;
	const status = optionalStatus(input.status, ["active", "paused"] as const);
	if (status) body.status = status;

	if (input.connections !== undefined && input.steps === undefined) {
		throw new ReloopValidationError(
			"update connections need steps: they replace the whole flow together.",
			"connections",
		);
	}
	if (input.steps !== undefined) {
		body.steps = requireSteps(input.steps);
		body.connections = requireConnections(input.connections ?? []);
	}

	if (Object.keys(body).length === 0) {
		throw new ReloopValidationError(
			"update requires at least one of name, description, steps or status.",
			"params",
		);
	}
	return body;
}

export async function updateAutomation(
	client: ReloopClient,
	id: string,
	params: UpdateAutomationParams,
): Promise<AutomationResult<Automation>> {
	const automationId = requireAutomationId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<Automation>(automationById(automationId), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return toAutomationResult(result);
}
