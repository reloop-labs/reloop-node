import { ReloopClient } from "./client";
import type { ReloopClientOptions } from "./core/types";
import { ApiKeyService } from "./services/api-key/api-key";
import { AudienceService } from "./services/audience/audience";
import { DomainService } from "./services/domain/domain";
import { MailService } from "./services/mail/mail";

export class Reloop {
	public apiKey: ApiKeyService;
	public audience: AudienceService;
	public domain: DomainService;
	public mail: MailService;
	private client: ReloopClient;

	constructor(options: ReloopClientOptions) {
		this.client = new ReloopClient(options);
		this.apiKey = new ApiKeyService(this.client);
		this.audience = new AudienceService(this.client);
		this.domain = new DomainService(this.client);
		this.mail = new MailService(this.client);
	}
}

export * from "./client";
export * from "./core/types";
export * from "./services/api-key/api-key";
export * from "./services/api-key/types";
export * from "./services/mail/mail";
export * from "./services/mail/types";
export * from "./services/audience/audience";
export * from "./services/audience/groups";
export * from "./services/audience/types";
export * from "./services/domain/domain";
export * from "./services/domain/types";
