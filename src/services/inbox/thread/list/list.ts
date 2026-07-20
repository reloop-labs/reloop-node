import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/thread/errors";
import {
	optionalBoolean,
	optionalThreadFilter,
	requireLimit,
	requireOffset,
} from "@/services/inbox/thread/fields";
import { threadListPath } from "@/services/inbox/thread/paths";
import {
	toThreadListResult,
	type ThreadListResult,
} from "@/services/inbox/thread/result";
import type { ListThreadsParams, Thread } from "@/services/inbox/thread/types";

function validateListParams(
	params?: ListThreadsParams | null,
): ListThreadsParams | undefined {
	if (params === undefined || params === null) return undefined;
	if (typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}

	const out: ListThreadsParams = {};
	if (params.mailboxId !== undefined) {
		if (typeof params.mailboxId !== "string") {
			throw new ReloopValidationError(
				"list mailboxId must be a string when provided.",
				"mailboxId",
			);
		}
		out.mailboxId = params.mailboxId;
	}
	if (params.limit !== undefined) out.limit = requireLimit(params.limit);
	if (params.offset !== undefined) out.offset = requireOffset(params.offset);
	if (params.folder !== undefined) {
		if (typeof params.folder !== "string") {
			throw new ReloopValidationError(
				"list folder must be a string when provided.",
				"folder",
			);
		}
		out.folder = params.folder;
	}
	if (params.q !== undefined) {
		if (typeof params.q !== "string") {
			throw new ReloopValidationError(
				"list q must be a string when provided.",
				"q",
			);
		}
		out.q = params.q;
	}
	if (params.isPinned !== undefined) {
		out.isPinned = optionalBoolean(params.isPinned, "isPinned");
	}
	if (params.filter !== undefined) {
		out.filter = optionalThreadFilter(params.filter);
	}
	return out;
}

export async function listThreads(
	client: ReloopClient,
	params?: ListThreadsParams,
): Promise<ThreadListResult> {
	const valid = validateListParams(params);
	const searchParams = new URLSearchParams();
	if (valid?.mailboxId) searchParams.set("mailboxId", valid.mailboxId);
	if (valid?.limit !== undefined) searchParams.set("limit", valid.limit.toString());
	if (valid?.offset !== undefined) {
		searchParams.set("offset", valid.offset.toString());
	}
	if (valid?.folder) searchParams.set("folder", valid.folder);
	if (valid?.q) searchParams.set("q", valid.q);
	if (valid?.isPinned !== undefined) {
		searchParams.set("isPinned", valid.isPinned.toString());
	}
	if (valid?.filter) searchParams.set("filter", valid.filter);

	const result = await client.fetch<Thread[]>(
		threadListPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toThreadListResult(result);
}
