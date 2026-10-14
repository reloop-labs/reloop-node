import type { ReloopApiError, ReloopResult } from "@/core/result";
import type {
	AutomationListResponse,
	EnrollmentListResponse,
} from "@/services/automation/types";

export type AutomationResult<T> =
	| { automation: T; automationError: null }
	| { automation: null; automationError: ReloopApiError };

export type AutomationListResult =
	| { automations: AutomationListResponse; automationError: null }
	| { automations: null; automationError: ReloopApiError };

export function toAutomationResult<T>(
	result: ReloopResult<T>,
): AutomationResult<T> {
	if (result.error) {
		return { automation: null, automationError: result.error };
	}
	return { automation: result.response as T, automationError: null };
}

export function toAutomationListResult(
	result: ReloopResult<AutomationListResponse>,
): AutomationListResult {
	if (result.error) {
		return { automations: null, automationError: result.error };
	}
	return {
		automations: result.response as AutomationListResponse,
		automationError: null,
	};
}

export type EnrollmentResult<T> =
	| { enrollment: T; enrollmentError: null }
	| { enrollment: null; enrollmentError: ReloopApiError };

export type EnrollmentListResult =
	| { enrollments: EnrollmentListResponse; enrollmentError: null }
	| { enrollments: null; enrollmentError: ReloopApiError };

export function toEnrollmentResult<T>(
	result: ReloopResult<T>,
): EnrollmentResult<T> {
	if (result.error) {
		return { enrollment: null, enrollmentError: result.error };
	}
	return { enrollment: result.response as T, enrollmentError: null };
}

export function toEnrollmentListResult(
	result: ReloopResult<EnrollmentListResponse>,
): EnrollmentListResult {
	if (result.error) {
		return { enrollments: null, enrollmentError: result.error };
	}
	return {
		enrollments: result.response as EnrollmentListResponse,
		enrollmentError: null,
	};
}
