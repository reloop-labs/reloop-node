import type { ReloopClient } from "@/client";
import { requireChannelId } from "@/services/contacts/channel/fields";
import { channelById } from "@/services/contacts/channel/paths";
import {
	toChannelResult,
	type ChannelResult,
} from "@/services/contacts/channel/result";
import type { DeleteChannelResponse } from "@/services/contacts/channel/types";

export async function deleteChannel(
	client: ReloopClient,
	id: string,
): Promise<ChannelResult<DeleteChannelResponse>> {
	const channelId = requireChannelId(id);
	const result = await client.fetch<DeleteChannelResponse>(
		channelById(channelId),
		{ method: "DELETE" },
	);
	return toChannelResult(result);
}
