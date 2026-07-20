import type { ReloopClient } from "@/client";
import { requireMessageId } from "@/services/inbox/message/fields";
import { messageRawPath } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type { MessageRaw } from "@/services/inbox/message/types";

export async function getRawMessage(
	client: ReloopClient,
	id: string,
): Promise<MessageResult<MessageRaw>> {
	const messageId = requireMessageId(id);
	const result = await client.fetch<MessageRaw>(messageRawPath(messageId), {
		method: "GET",
	});
	return toMessageResult(result);
}
