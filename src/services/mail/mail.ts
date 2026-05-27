import type { ReloopClient } from "../../client";
import type { SendMailParams, SendMailResponse } from "./types";

export class MailService {
	constructor(private readonly client: ReloopClient) {}

	async send(params: SendMailParams): Promise<SendMailResponse> {
		return this.client.fetch<SendMailResponse>("/api/mail/v1/send", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}
}
