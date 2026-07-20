import type { ReloopClient } from "@/client";
import { requireMessageId } from "@/services/inbox/message/fields";
import { messageById } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type { InboxSuccessResponse } from "@/services/inbox/message/types";

export async function deleteMessage(
	client: ReloopClient,
	id: string,
): Promise<MessageResult<InboxSuccessResponse>> {
	const messageId = requireMessageId(id);
	const result = await client.fetch<InboxSuccessResponse>(
		messageById(messageId),
		{ method: "DELETE" },
	);
	return toMessageResult(result);
}
