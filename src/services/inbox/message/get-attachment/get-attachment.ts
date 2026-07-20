import type { ReloopClient } from "@/client";
import {
	requireAttachmentId,
	requireMessageId,
} from "@/services/inbox/message/fields";
import { messageAttachmentPath } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type { MessageAttachment } from "@/services/inbox/types";

export async function getMessageAttachment(
	client: ReloopClient,
	id: string,
	attachmentId: string,
): Promise<MessageResult<MessageAttachment>> {
	const messageId = requireMessageId(id);
	const attachment = requireAttachmentId(attachmentId);
	const result = await client.fetch<MessageAttachment>(
		messageAttachmentPath(messageId, attachment),
		{ method: "GET" },
	);
	return toMessageResult(result);
}
