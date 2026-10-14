import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/automation/errors";
import {
	optionalDescription,
	optionalStatus,
	requireConnections,
	requireName,
	requireParamsObject,
	requireSteps,
} from "@/services/automation/fields";
import { automationsPath } from "@/services/automation/paths";
import {
	type AutomationResult,
	toAutomationResult,
} from "@/services/automation/result";
import type {
	Automation,
	CreateAutomationParams,
} from "@/services/automation/types";

function validateCreateParams(
	params: CreateAutomationParams | null | undefined,
): CreateAutomationParams {
	const input = requireParamsObject(params, "create");
	const body: CreateAutomationParams = { name: requireName(input.name) };

	const description = optionalDescription(input.description);
	if (typeof description === "string") body.description = description;

	const status = optionalStatus(input.status, ["draft", "active"] as const);
	if (status) body.status = status;

	if (input.connections !== undefined && input.steps === undefined) {
		throw new ReloopValidationError(
			"create connections need steps to connect.",
			"connections",
		);
	}
	if (input.steps !== undefined) body.steps = requireSteps(input.steps);
	if (input.connections !== undefined) {
		body.connections = requireConnections(input.connections);
	}
	return body;
}

export async function createAutomation(
	client: ReloopClient,
	params: CreateAutomationParams,
): Promise<AutomationResult<Automation>> {
	const body = validateCreateParams(params);
	const result = await client.fetch<Automation>(automationsPath(), {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toAutomationResult(result);
}
