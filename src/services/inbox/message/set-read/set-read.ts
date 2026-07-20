import type { ReloopClient } from "@/client";
import { requireBoolean, requireMessageId } from "@/services/inbox/message/fields";
import { messageReadPath } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type {
	InboxSuccessResponse,
	SetMessageReadParams,
} from "@/services/inbox/message/types";

export async function setMessageRead(
	client: ReloopClient,
	id: string,
	params: SetMessageReadParams,
): Promise<MessageResult<InboxSuccessResponse>> {
	const messageId = requireMessageId(id);
	const body = { isRead: requireBoolean(params.isRead, "isRead") };
	const result = await client.fetch<InboxSuccessResponse>(
		messageReadPath(messageId),
		{
			method: "PATCH",
			body: JSON.stringify(body),
		},
	);
	return toMessageResult(result);
}
