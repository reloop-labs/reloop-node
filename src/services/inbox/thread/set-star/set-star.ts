import type { ReloopClient } from "@/client";
import { requireBoolean, requireThreadId } from "@/services/inbox/thread/fields";
import { threadStarPath } from "@/services/inbox/thread/paths";
import {
	toThreadResult,
	type ThreadResult,
} from "@/services/inbox/thread/result";
import type {
	InboxSuccessResponse,
	SetThreadStarParams,
} from "@/services/inbox/thread/types";

export async function setThreadStar(
	client: ReloopClient,
	id: string,
	params: SetThreadStarParams,
): Promise<ThreadResult<InboxSuccessResponse>> {
	const threadId = requireThreadId(id);
	const body = { isStarred: requireBoolean(params.isStarred, "isStarred") };
	const result = await client.fetch<InboxSuccessResponse>(
		threadStarPath(threadId),
		{
			method: "PATCH",
			body: JSON.stringify(body),
		},
	);
	return toThreadResult(result);
}
