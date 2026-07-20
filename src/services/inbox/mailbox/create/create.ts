import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/inbox/mailbox/errors";
import {
	optionalString,
	requireNonEmptyString,
} from "@/services/inbox/mailbox/fields";
import { mailboxCreatePath } from "@/services/inbox/mailbox/paths";
import {
	toMailboxResult,
	type MailboxResult,
} from "@/services/inbox/mailbox/result";
import type {
	CreateMailboxParams,
	CreateMailboxResponse,
} from "@/services/inbox/mailbox/types";

function validateCreateParams(
	params: CreateMailboxParams | null | undefined,
): CreateMailboxParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"create params are required and must be an object.",
			"params",
		);
	}

	const body: CreateMailboxParams = {
		domainId: requireNonEmptyString(params.domainId, "domainId"),
		email: requireNonEmptyString(params.email, "email"),
	};

	const password = optionalString(params.password, "password");
	if (password !== undefined) body.password = password;

	const quota = optionalString(params.quota, "quota");
	if (quota !== undefined) body.quota = quota;

	const displayName = optionalString(params.displayName, "displayName");
	if (displayName !== undefined) body.displayName = displayName;

	return body;
}

export async function createMailbox(
	client: ReloopClient,
	params: CreateMailboxParams,
): Promise<MailboxResult<CreateMailboxResponse>> {
	const body = validateCreateParams(params);
	const result = await client.fetch<CreateMailboxResponse>(
		mailboxCreatePath(),
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
	return toMailboxResult(result);
}
