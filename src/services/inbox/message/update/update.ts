import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/message/errors";
import {
	optionalBoolean,
	requireMessageId,
} from "@/services/inbox/message/fields";
import { messageById } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type {
	InboxSuccessResponse,
	UpdateMessageParams,
} from "@/services/inbox/message/types";

function validateUpdateParams(
	params: UpdateMessageParams | null | undefined,
): UpdateMessageParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}

	const body: UpdateMessageParams = {};
	const isRead = optionalBoolean(params.isRead, "isRead");
	if (isRead !== undefined) body.isRead = isRead;
	const isStarred = optionalBoolean(params.isStarred, "isStarred");
	if (isStarred !== undefined) body.isStarred = isStarred;
	const isSpam = optionalBoolean(params.isSpam, "isSpam");
	if (isSpam !== undefined) body.isSpam = isSpam;

	if (
		body.isRead === undefined &&
		body.isStarred === undefined &&
		body.isSpam === undefined
	) {
		throw new ReloopValidationError(
			"update requires at least one of isRead, isStarred, or isSpam.",
			"params",
		);
	}

	return body;
}

export async function updateMessage(
	client: ReloopClient,
	id: string,
	params: UpdateMessageParams,
): Promise<MessageResult<InboxSuccessResponse>> {
	const messageId = requireMessageId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<InboxSuccessResponse>(
		messageById(messageId),
		{
			method: "PATCH",
			body: JSON.stringify(body),
		},
	);
	return toMessageResult(result);
}
