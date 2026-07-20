import type { ReloopClient } from "@/client";
import { requireBoolean, requireMessageId } from "@/services/inbox/message/fields";
import { messageStarPath } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type {
	InboxSuccessResponse,
	SetMessageStarParams,
} from "@/services/inbox/message/types";

export async function setMessageStar(
	client: ReloopClient,
	id: string,
	params: SetMessageStarParams,
): Promise<MessageResult<InboxSuccessResponse>> {
	const messageId = requireMessageId(id);
	const body = { isStarred: requireBoolean(params.isStarred, "isStarred") };
	const result = await client.fetch<InboxSuccessResponse>(
		messageStarPath(messageId),
		{
			method: "PATCH",
			body: JSON.stringify(body),
		},
	);
	return toMessageResult(result);
}
