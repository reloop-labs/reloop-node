import { ReloopClient } from "#src/client";
import type { ReloopClientOptions } from "#src/core/types";
import { ApiKeyService } from "#src/services/api-key/api-key";
import { ContactsService } from "#src/services/contacts/contacts";
import { DomainService } from "#src/services/domain/domain";
import { MailService } from "#src/services/mail/mail";
import { WebhookService } from "#src/services/webhook/webhook";

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

export type { ReloopClientOptions } from "#src/core/types";
export {
	ReloopApiError,
	type ReloopApiErrorBody,
	type ReloopResult,
	ok,
	err,
} from "#src/core/result";

export type {
	ApiKey,
	ApiKeyCreatedBy,
	ApiKeyListParams,
	ApiKeyListResponse,
	ApiKeyWithKey,
	CreateApiKeyParams,
	DeleteApiKeyResponse,
	UpdateApiKeyParams,
} from "#src/services/api-key/types";
export { ReloopValidationError } from "#src/services/api-key/errors";

export * from "#src/services/mail/mail";
export * from "#src/services/mail/types";
export * from "#src/services/contacts/contacts";
export * from "#src/services/contacts/channels";
export * from "#src/services/contacts/groups";
export * from "#src/services/contacts/types";
export * from "#src/services/domain/domain";
export * from "#src/services/domain/types";
export * from "#src/services/webhook/webhook";
export * from "#src/services/webhook/types";
export * from "#src/services/webhook/verify";
