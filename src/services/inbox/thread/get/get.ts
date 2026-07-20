import type { ReloopClient } from "@/client";
import { requireThreadId } from "@/services/inbox/thread/fields";
import { threadById } from "@/services/inbox/thread/paths";
import {
	toThreadResult,
	type ThreadResult,
} from "@/services/inbox/thread/result";
import type { ThreadDetail } from "@/services/inbox/thread/types";

export async function getThread(
	client: ReloopClient,
	id: string,
): Promise<ThreadResult<ThreadDetail>> {
	const threadId = requireThreadId(id);
	const result = await client.fetch<ThreadDetail>(threadById(threadId), {
		method: "GET",
	});
	return toThreadResult(result);
}
