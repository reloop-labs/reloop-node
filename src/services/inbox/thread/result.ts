import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { Thread } from "@/services/inbox/thread/types";

export type ThreadResult<T> =
	| { thread: T; threadError: null }
	| { thread: null; threadError: ReloopApiError };

export type ThreadListResult =
	| { threads: Thread[]; threadError: null }
	| { threads: null; threadError: ReloopApiError };

export function toThreadResult<T>(result: ReloopResult<T>): ThreadResult<T> {
	if (result.error) {
		return { thread: null, threadError: result.error };
	}
	return { thread: result.response as T, threadError: null };
}

export function toThreadListResult(
	result: ReloopResult<Thread[]>,
): ThreadListResult {
	if (result.error) {
		return { threads: null, threadError: result.error };
	}
	return { threads: result.response as Thread[], threadError: null };
}
