import type { ReloopClient } from "@/client";
import { getEnrollment } from "@/services/automation/enrollment/get/get";
import { listEnrollments } from "@/services/automation/enrollment/list/list";
import type {
	EnrollmentListResult,
	EnrollmentResult,
} from "@/services/automation/result";
import type {
	EnrollmentDetail,
	ListEnrollmentsParams,
} from "@/services/automation/types";

export class EnrollmentService {
	constructor(private readonly client: ReloopClient) {}

	/** Contacts that have gone through an automation, newest first. */
	async list(
		automationId: string,
		params?: ListEnrollmentsParams,
	): Promise<EnrollmentListResult> {
		return listEnrollments(this.client, automationId, params);
	}

	/** One enrollment with what happened at each step. */
	async get(
		automationId: string,
		enrollmentId: string,
	): Promise<EnrollmentResult<EnrollmentDetail>> {
		return getEnrollment(this.client, automationId, enrollmentId);
	}
}
