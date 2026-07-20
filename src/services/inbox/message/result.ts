import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { Message } from "@/services/inbox/message/types";

export type MessageResult<T> =
	| { message: T; messageError: null }
	| { message: null; messageError: ReloopApiError };

export type MessageListResult =
	| { messages: Message[]; messageError: null }
	| { messages: null; messageError: ReloopApiError };

export function toMessageResult<T>(result: ReloopResult<T>): MessageResult<T> {
	if (result.error) {
		return { message: null, messageError: result.error };
	}
	return { message: result.response as T, messageError: null };
}

export function toMessageListResult(
	result: ReloopResult<Message[]>,
): MessageListResult {
	if (result.error) {
		return { messages: null, messageError: result.error };
	}
	return { messages: result.response as Message[], messageError: null };
}
