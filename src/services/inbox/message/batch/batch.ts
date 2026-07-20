import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/message/errors";
import { requireIdArray } from "@/services/inbox/message/fields";
import { messageBatchPath } from "@/services/inbox/message/paths";
import {
	toMessageListResult,
	type MessageListResult,
} from "@/services/inbox/message/result";
import type { BatchMessagesParams, Message } from "@/services/inbox/message/types";

function validateBatchParams(
	params: BatchMessagesParams | null | undefined,
): BatchMessagesParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"batch params are required and must be an object.",
			"params",
		);
	}
	return { ids: requireIdArray(params.ids) };
}

export async function batchMessages(
	client: ReloopClient,
	params: BatchMessagesParams,
): Promise<MessageListResult> {
	const body = validateBatchParams(params);
	const result = await client.fetch<Message[]>(messageBatchPath(), {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toMessageListResult(result);
}
