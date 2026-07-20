import type { ReloopClient } from "@/client";
import { sendEmail } from "@/services/mail/send/send";
import type { EmailResult } from "@/services/mail/result";
import type { SendMailParams } from "@/services/mail/types";

export class MailService {
	constructor(private readonly client: ReloopClient) {}

	async send(params: SendMailParams): Promise<EmailResult> {
		return sendEmail(this.client, params);
	}
}
