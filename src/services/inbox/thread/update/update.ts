import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/thread/errors";
import {
	optionalBoolean,
	optionalThreadStatus,
	requireThreadId,
} from "@/services/inbox/thread/fields";
import { threadById } from "@/services/inbox/thread/paths";
import {
	toThreadResult,
	type ThreadResult,
} from "@/services/inbox/thread/result";
import type {
	InboxSuccessResponse,
	UpdateThreadParams,
} from "@/services/inbox/thread/types";

function validateUpdateParams(
	params: UpdateThreadParams | null | undefined,
): UpdateThreadParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}

	const body: UpdateThreadParams = {};
	const isRead = optionalBoolean(params.isRead, "isRead");
	if (isRead !== undefined) body.isRead = isRead;

	const isStarred = optionalBoolean(params.isStarred, "isStarred");
	if (isStarred !== undefined) body.isStarred = isStarred;

	const isImportant = optionalBoolean(params.isImportant, "isImportant");
	if (isImportant !== undefined) body.isImportant = isImportant;

	const isPinned = optionalBoolean(params.isPinned, "isPinned");
	if (isPinned !== undefined) body.isPinned = isPinned;

	const status = optionalThreadStatus(params.status);
	if (status !== undefined) body.status = status;

	if (
		body.isRead === undefined &&
		body.isStarred === undefined &&
		body.isImportant === undefined &&
		body.isPinned === undefined &&
		body.status === undefined
	) {
		throw new ReloopValidationError(
			"update requires at least one of isRead, isStarred, isImportant, isPinned, or status.",
			"params",
		);
	}

	return body;
}

export async function updateThread(
	client: ReloopClient,
	id: string,
	params: UpdateThreadParams,
): Promise<ThreadResult<InboxSuccessResponse>> {
	const threadId = requireThreadId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<InboxSuccessResponse>(threadById(threadId), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return toThreadResult(result);
}
