import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/automation/errors";
import {
	optionalEnrollmentStatus,
	requireAutomationId,
	requireLimit,
	requirePage,
} from "@/services/automation/fields";
import { enrollmentsPath } from "@/services/automation/paths";
import {
	type EnrollmentListResult,
	toEnrollmentListResult,
} from "@/services/automation/result";
import type {
	EnrollmentListResponse,
	ListEnrollmentsParams,
} from "@/services/automation/types";

export async function listEnrollments(
	client: ReloopClient,
	automationId: string,
	params?: ListEnrollmentsParams,
): Promise<EnrollmentListResult> {
	const id = requireAutomationId(automationId, "automationId");
	if (params !== undefined && params !== null && typeof params !== "object") {
		throw new ReloopValidationError(
			"enrollments list params must be an object when provided.",
			"params",
		);
	}
	const searchParams = new URLSearchParams();
	if (params?.page !== undefined) {
		searchParams.set("page", requirePage(params.page).toString());
	}
	if (params?.limit !== undefined) {
		searchParams.set("limit", requireLimit(params.limit).toString());
	}
	const status = optionalEnrollmentStatus(params?.status);
	if (status) searchParams.set("status", status);

	const result = await client.fetch<EnrollmentListResponse>(
		enrollmentsPath(id, searchParams.toString()),
		{ method: "GET" },
	);
	return toEnrollmentListResult(result);
}
