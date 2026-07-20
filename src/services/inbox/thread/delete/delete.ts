import type { ReloopClient } from "@/client";
import { requireThreadId } from "@/services/inbox/thread/fields";
import { threadById } from "@/services/inbox/thread/paths";
import {
	toThreadResult,
	type ThreadResult,
} from "@/services/inbox/thread/result";
import type { InboxSuccessResponse } from "@/services/inbox/thread/types";

export async function deleteThread(
	client: ReloopClient,
	id: string,
): Promise<ThreadResult<InboxSuccessResponse>> {
	const threadId = requireThreadId(id);
	const result = await client.fetch<InboxSuccessResponse>(threadById(threadId), {
		method: "DELETE",
	});
	return toThreadResult(result);
}
