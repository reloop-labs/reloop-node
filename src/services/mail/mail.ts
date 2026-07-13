import type { ReloopClient } from "#src/client";
import type { ReloopResult } from "#src/core/result";
import type { SendMailParams, SendMailResponse } from "#src/services/mail/types";

export class MailService {
	constructor(private readonly client: ReloopClient) {}

	async send(params: SendMailParams): Promise<ReloopResult<SendMailResponse>> {
		return this.client.fetch<SendMailResponse>("/api/mail/v1/send", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}
}
