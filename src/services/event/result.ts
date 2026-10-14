import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { EventListResponse } from "@/services/event/types";

export type EventResult<T> =
	| { event: T; eventError: null }
	| { event: null; eventError: ReloopApiError };

export type EventListResult =
	| { events: EventListResponse; eventError: null }
	| { events: null; eventError: ReloopApiError };

export function toEventResult<T>(result: ReloopResult<T>): EventResult<T> {
	if (result.error) {
		return { event: null, eventError: result.error };
	}
	return { event: result.response as T, eventError: null };
}

export function toEventListResult(
	result: ReloopResult<EventListResponse>,
): EventListResult {
	if (result.error) {
		return { events: null, eventError: result.error };
	}
	return { events: result.response as EventListResponse, eventError: null };
}
