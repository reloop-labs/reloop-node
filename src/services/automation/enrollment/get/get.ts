import type { ReloopClient } from "@/client";
import {
	requireAutomationId,
	requireEnrollmentId,
} from "@/services/automation/fields";
import { enrollmentById } from "@/services/automation/paths";
import {
	type EnrollmentResult,
	toEnrollmentResult,
} from "@/services/automation/result";
import type { EnrollmentDetail } from "@/services/automation/types";

export async function getEnrollment(
	client: ReloopClient,
	automationId: string,
	enrollmentId: string,
): Promise<EnrollmentResult<EnrollmentDetail>> {
	const id = requireAutomationId(automationId, "automationId");
	const enrollment = requireEnrollmentId(enrollmentId);
	const result = await client.fetch<EnrollmentDetail>(
		enrollmentById(id, enrollment),
		{ method: "GET" },
	);
	return toEnrollmentResult(result);
}
