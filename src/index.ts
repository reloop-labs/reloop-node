import { ReloopClient } from "./client";
import type { ReloopClientOptions } from "./core/types";
import { ApiKeyService } from "./services/api-key/api-key";
import { MailService } from "./services/mail/mail";

export class Reloop {
	public apiKeys: ApiKeyService;
	public mail: MailService;
	private client: ReloopClient;

	constructor(options: ReloopClientOptions) {
		this.client = new ReloopClient(options);
		this.apiKeys = new ApiKeyService(this.client);
		this.mail = new MailService(this.client);
	}
}

export * from "./client";
export * from "./core/types";
export * from "./services/api-key/api-key";
export * from "./services/api-key/types";
export * from "./services/mail/mail";
export * from "./services/mail/types";
