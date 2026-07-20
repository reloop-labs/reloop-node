import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/message/errors";
import {
	buildComposeBody,
	requireMessageId,
	requireRecipients,
} from "@/services/inbox/message/fields";
import { messageForwardPath } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type {
	ForwardMessageParams,
	SendEmailResponse,
} from "@/services/inbox/message/types";

function validateForwardParams(
	params: ForwardMessageParams | null | undefined,
): ForwardMessageParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"forward params are required and must be an object.",
			"params",
		);
	}
	return {
		to: requireRecipients(params.to, "to"),
		...buildComposeBody(params),
	};
}

export async function forwardMessage(
	client: ReloopClient,
	id: string,
	params: ForwardMessageParams,
): Promise<MessageResult<SendEmailResponse>> {
	const messageId = requireMessageId(id);
	const body = validateForwardParams(params);
	const result = await client.fetch<SendEmailResponse>(
		messageForwardPath(messageId),
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
	return toMessageResult(result);
}
