import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/message/errors";
import {
	buildComposeBody,
	optionalRecipients,
	requireMessageId,
} from "@/services/inbox/message/fields";
import { messageReplyAllPath } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type {
	ComposeMessageParams,
	SendEmailResponse,
} from "@/services/inbox/message/types";

function validateReplyAllParams(
	params: ComposeMessageParams | null | undefined,
): ComposeMessageParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"replyAll params are required and must be an object.",
			"params",
		);
	}
	const body = buildComposeBody(params) as ComposeMessageParams;
	const bcc = optionalRecipients(params.bcc, "bcc");
	if (bcc !== undefined) body.bcc = bcc;
	return body;
}

export async function replyAllToMessage(
	client: ReloopClient,
	id: string,
	params: ComposeMessageParams,
): Promise<MessageResult<SendEmailResponse>> {
	const messageId = requireMessageId(id);
	const body = validateReplyAllParams(params);
	const result = await client.fetch<SendEmailResponse>(
		messageReplyAllPath(messageId),
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
	return toMessageResult(result);
}
