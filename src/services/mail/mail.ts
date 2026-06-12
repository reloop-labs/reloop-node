import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import type { SendMailParams, SendMailResponse } from "./types";

export class MailService {
	constructor(private readonly client: ReloopClient) {}

	async send(params: SendMailParams): Promise<ReloopResult<SendMailResponse>> {
		return this.client.fetch<SendMailResponse>("/api/mail/v1/send", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}
}
