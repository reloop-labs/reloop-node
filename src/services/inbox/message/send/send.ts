import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/message/errors";
import {
	optionalAttachments,
	optionalNumber,
	optionalRecipients,
	optionalString,
	requireNonEmptyString,
	requireRecipients,
} from "@/services/inbox/message/fields";
import { messageSendPath } from "@/services/inbox/message/paths";
import {
	toMessageResult,
	type MessageResult,
} from "@/services/inbox/message/result";
import type {
	SendEmailOrPendingResponse,
	SendMessageParams,
} from "@/services/inbox/message/types";

function validateSendParams(
	params: SendMessageParams | null | undefined,
): SendMessageParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"send params are required and must be an object.",
			"params",
		);
	}

	const body: SendMessageParams = {
		mailboxId: requireNonEmptyString(params.mailboxId, "mailboxId"),
		to: requireRecipients(params.to, "to"),
		subject: requireNonEmptyString(params.subject, "subject"),
	};

	const text = optionalString(params.text, "text");
	if (text !== undefined) body.text = text;
	const html = optionalString(params.html, "html");
	if (html !== undefined) body.html = html;
	const cc = optionalRecipients(params.cc, "cc");
	if (cc !== undefined) body.cc = cc;
	const bcc = optionalRecipients(params.bcc, "bcc");
	if (bcc !== undefined) body.bcc = bcc;
	const attachments = optionalAttachments(params.attachments);
	if (attachments !== undefined) body.attachments = attachments;
	const scheduledAt = optionalString(params.scheduledAt, "scheduledAt");
	if (scheduledAt !== undefined) body.scheduledAt = scheduledAt;
	const undoWindowSeconds = optionalNumber(
		params.undoWindowSeconds,
		"undoWindowSeconds",
	);
	if (undoWindowSeconds !== undefined) body.undoWindowSeconds = undoWindowSeconds;

	return body;
}

export async function sendMessage(
	client: ReloopClient,
	params: SendMessageParams,
): Promise<MessageResult<SendEmailOrPendingResponse>> {
	const body = validateSendParams(params);
	const result = await client.fetch<SendEmailOrPendingResponse>(
		messageSendPath(),
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
	return toMessageResult(result);
}
