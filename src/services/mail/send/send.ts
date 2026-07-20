import type { ReloopClient } from "@/client";
import { mailSendPath } from "@/services/mail/paths";
import { toEmailResult, type EmailResult } from "@/services/mail/result";
import type { SendMailParams, SendMailResponse } from "@/services/mail/types";

export async function sendEmail(
	client: ReloopClient,
	params: SendMailParams,
): Promise<EmailResult> {
	const result = await client.fetch<SendMailResponse>(mailSendPath(), {
		method: "POST",
		body: JSON.stringify(params),
	});
	return toEmailResult(result);
}
