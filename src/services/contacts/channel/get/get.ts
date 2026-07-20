import type { ReloopClient } from "@/client";
import { requireChannelId } from "@/services/contacts/channel/fields";
import { channelById } from "@/services/contacts/channel/paths";
import {
	toChannelResult,
	type ChannelResult,
} from "@/services/contacts/channel/result";
import type { ContactChannel } from "@/services/contacts/channel/types";

export async function getChannel(
	client: ReloopClient,
	id: string,
): Promise<ChannelResult<ContactChannel>> {
	const channelId = requireChannelId(id);
	const result = await client.fetch<ContactChannel>(channelById(channelId), {
		method: "GET",
	});
	return toChannelResult(result);
}
