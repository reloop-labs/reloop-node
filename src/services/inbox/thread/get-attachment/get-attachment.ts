import type { ReloopClient } from "@/client";
import {
	requireAttachmentId,
	requireThreadId,
} from "@/services/inbox/thread/fields";
import { threadAttachmentPath } from "@/services/inbox/thread/paths";
import {
	toThreadResult,
	type ThreadResult,
} from "@/services/inbox/thread/result";
import type { MessageAttachment } from "@/services/inbox/types";

export async function getThreadAttachment(
	client: ReloopClient,
	id: string,
	attachmentId: string,
): Promise<ThreadResult<MessageAttachment>> {
	const threadId = requireThreadId(id);
	const attachment = requireAttachmentId(attachmentId);
	const result = await client.fetch<MessageAttachment>(
		threadAttachmentPath(threadId, attachment),
		{ method: "GET" },
	);
	return toThreadResult(result);
}
