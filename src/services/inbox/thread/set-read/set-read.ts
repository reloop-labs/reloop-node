import type { ReloopClient } from "@/client";
import { requireBoolean, requireThreadId } from "@/services/inbox/thread/fields";
import { threadReadPath } from "@/services/inbox/thread/paths";
import {
	toThreadResult,
	type ThreadResult,
} from "@/services/inbox/thread/result";
import type {
	InboxSuccessResponse,
	SetThreadReadParams,
} from "@/services/inbox/thread/types";

export async function setThreadRead(
	client: ReloopClient,
	id: string,
	params: SetThreadReadParams,
): Promise<ThreadResult<InboxSuccessResponse>> {
	const threadId = requireThreadId(id);
	const body = { isRead: requireBoolean(params.isRead, "isRead") };
	const result = await client.fetch<InboxSuccessResponse>(
		threadReadPath(threadId),
		{
			method: "PATCH",
			body: JSON.stringify(body),
		},
	);
	return toThreadResult(result);
}
