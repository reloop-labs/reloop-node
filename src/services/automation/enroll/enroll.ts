import type { ReloopClient } from "@/client";
import {
	requireAutomationId,
	requireContactTarget,
	requireParamsObject,
} from "@/services/automation/fields";
import { automationAction } from "@/services/automation/paths";
import {
	type EnrollmentResult,
	toEnrollmentResult,
} from "@/services/automation/result";
import type {
	EnrollContactParams,
	EnrollContactResponse,
} from "@/services/automation/types";

export async function enrollContact(
	client: ReloopClient,
	id: string,
	params: EnrollContactParams,
): Promise<EnrollmentResult<EnrollContactResponse>> {
	const automationId = requireAutomationId(id);
	const input = requireParamsObject(params, "enroll");
	const body = requireContactTarget(input as Record<string, unknown>);
	const result = await client.fetch<EnrollContactResponse>(
		automationAction(automationId, "enroll"),
		{ method: "POST", body: JSON.stringify(body) },
	);
	return toEnrollmentResult(result);
}
