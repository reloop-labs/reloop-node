import type { ReloopApiError, ReloopResult } from "@/core/result";
import type { ChannelListResponse } from "@/services/contacts/channel/types";

export type ChannelResult<T> =
	| { channel: T; channelError: null }
	| { channel: null; channelError: ReloopApiError };

export type ChannelListResult =
	| { channels: ChannelListResponse; channelError: null }
	| { channels: null; channelError: ReloopApiError };

export function toChannelResult<T>(result: ReloopResult<T>): ChannelResult<T> {
	if (result.error) {
		return { channel: null, channelError: result.error };
	}
	return { channel: result.response as T, channelError: null };
}

export function toChannelListResult(
	result: ReloopResult<ChannelListResponse>,
): ChannelListResult {
	if (result.error) {
		return { channels: null, channelError: result.error };
	}
	return {
		channels: result.response as ChannelListResponse,
		channelError: null,
	};
}
