import type { ReloopClient } from "@/client";
import { requireMessageId } from "@/services/inbox/message/fields";
import { messagePendingCancelPath } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type { InboxSuccessResponse } from "@/services/inbox/message/types";

export async function cancelPendingMessage(
	client: ReloopClient,
	id: string,
): Promise<MessageResult<InboxSuccessResponse>> {
	const messageId = requireMessageId(id);
	const result = await client.fetch<InboxSuccessResponse>(
		messagePendingCancelPath(messageId),
		{ method: "POST" },
	);
	return toMessageResult(result);
}
