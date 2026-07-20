import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/mail/errors";
import { requireMailString, requireRecipient } from "@/services/mail/fields";
import { mailSendPath } from "@/services/mail/paths";
import { toEmailResult, type EmailResult } from "@/services/mail/result";
import type { SendMailParams, SendMailResponse } from "@/services/mail/types";

function validateSendParams(
	params: SendMailParams | null | undefined,
): SendMailParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"send params are required and must be an object.",
			"params",
		);
	}

	return {
		...params,
		from: requireMailString(params.from, "from"),
		to: requireRecipient(params.to, "to"),
		subject: requireMailString(params.subject, "subject"),
	};
}

export async function sendEmail(
	client: ReloopClient,
	params: SendMailParams,
): Promise<EmailResult> {
	const body = validateSendParams(params);
	const result = await client.fetch<SendMailResponse>(mailSendPath(), {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toEmailResult(result);
}
