import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { TriggerListResponse } from "@/services/automation/trigger/types";

export type TriggerResult<T> =
	| { trigger: T; triggerError: null }
	| { trigger: null; triggerError: ReloopApiError };

export type TriggerListResult =
	| { triggers: TriggerListResponse; triggerError: null }
	| { triggers: null; triggerError: ReloopApiError };

export function toTriggerResult<T>(result: ReloopResult<T>): TriggerResult<T> {
	if (result.error) {
		return { trigger: null, triggerError: result.error };
	}
	return { trigger: result.response as T, triggerError: null };
}

export function toTriggerListResult(
	result: ReloopResult<TriggerListResponse>,
): TriggerListResult {
	if (result.error) {
		return { triggers: null, triggerError: result.error };
	}
	return { triggers: result.response as TriggerListResponse, triggerError: null };
}
