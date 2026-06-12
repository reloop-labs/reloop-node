import { ReloopClient } from "./client";
import type { ReloopClientOptions } from "./core/types";
import { ApiKeyService } from "./services/api-key/api-key";
import { ContactsService } from "./services/contacts/contacts";
import { DomainService } from "./services/domain/domain";
import { MailService } from "./services/mail/mail";
import { WebhookService } from "./services/webhook/webhook";

export class Reloop {
	public apiKey: ApiKeyService;
	public contacts: ContactsService;
	public domain: DomainService;
	public webhook: WebhookService;
	public mail: MailService;
	private client: ReloopClient;

	constructor(options: ReloopClientOptions) {
		this.client = new ReloopClient(options);
		this.apiKey = new ApiKeyService(this.client);
		this.contacts = new ContactsService(this.client);
		this.domain = new DomainService(this.client);
		this.webhook = new WebhookService(this.client);
		this.mail = new MailService(this.client);
	}
}

export default Reloop;

export * from "./client";
export * from "./core/types";
export * from "./core/result";
export * from "./services/api-key/api-key";
export * from "./services/api-key/types";
export * from "./services/mail/mail";
export * from "./services/mail/types";
export * from "./services/contacts/contacts";
export * from "./services/contacts/channels";
export * from "./services/contacts/groups";
export * from "./services/contacts/types";
export * from "./services/domain/domain";
export * from "./services/domain/types";
export * from "./services/webhook/webhook";
export * from "./services/webhook/types";
export * from "./services/webhook/verify";
