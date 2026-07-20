import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/message/errors";
import { buildComposeBody, requireMessageId } from "@/services/inbox/message/fields";
import { messageReplyPath } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type {
	ComposeMessageParams,
	SendEmailResponse,
} from "@/services/inbox/message/types";

function validateComposeParams(
	params: ComposeMessageParams | null | undefined,
): ComposeMessageParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"compose params are required and must be an object.",
			"params",
		);
	}
	return buildComposeBody(params) as ComposeMessageParams;
}

export async function replyToMessage(
	client: ReloopClient,
	id: string,
	params: ComposeMessageParams,
): Promise<MessageResult<SendEmailResponse>> {
	const messageId = requireMessageId(id);
	const body = validateComposeParams(params);
	const result = await client.fetch<SendEmailResponse>(
		messageReplyPath(messageId),
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
	return toMessageResult(result);
}
