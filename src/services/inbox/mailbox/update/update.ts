import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/mailbox/errors";
import {
	optionalMailboxStatus,
	optionalString,
	requireMailboxId,
} from "@/services/inbox/mailbox/fields";
import { mailboxById } from "@/services/inbox/mailbox/paths";
import {
	toMailboxResult,
	type MailboxResult,
} from "@/services/inbox/mailbox/result";
import type {
	InboxSuccessResponse,
	UpdateMailboxParams,
} from "@/services/inbox/mailbox/types";

function validateUpdateParams(
	params: UpdateMailboxParams | null | undefined,
): UpdateMailboxParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}

	const body: UpdateMailboxParams = {};

	const displayName = optionalString(params.displayName, "displayName");
	if (displayName !== undefined) body.displayName = displayName;

	const status = optionalMailboxStatus(params.status);
	if (status !== undefined) body.status = status;

	const quota = optionalString(params.quota, "quota");
	if (quota !== undefined) body.quota = quota;

	if (
		body.displayName === undefined &&
		body.status === undefined &&
		body.quota === undefined
	) {
		throw new ReloopValidationError(
			"update requires at least one of displayName, status, or quota.",
			"params",
		);
	}

	return body;
}

export async function updateMailbox(
	client: ReloopClient,
	id: string,
	params: UpdateMailboxParams,
): Promise<MailboxResult<InboxSuccessResponse>> {
	const mailboxId = requireMailboxId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<InboxSuccessResponse>(
		mailboxById(mailboxId),
		{
			method: "PATCH",
			body: JSON.stringify(body),
		},
	);
	return toMailboxResult(result);
}
