import type { ReloopClient } from "@/client";
import { requireMessageId } from "@/services/inbox/message/fields";
import { messageById } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type { Message } from "@/services/inbox/message/types";

export async function getMessage(
	client: ReloopClient,
	id: string,
): Promise<MessageResult<Message>> {
	const messageId = requireMessageId(id);
	const result = await client.fetch<Message>(messageById(messageId), {
		method: "GET",
	});
	return toMessageResult(result);
}
