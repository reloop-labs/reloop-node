import { ReloopClient } from "@/client";
import type { ReloopClientOptions } from "@/core/types";
import { ApiKeyService } from "@/services/api-key/api-key";
import { ContactsService } from "@/services/contacts/contacts";
import { DomainService } from "@/services/domain/domain";
import { MailService } from "@/services/mail/mail";
import { WebhookService } from "@/services/webhook/webhook";

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

export type { ReloopClientOptions } from "@/core/types";
export {
	ReloopApiError,
	type ReloopApiErrorBody,
	type ReloopResult,
	ok,
	err,
} from "@/core/result";

export type {
	ApiKey,
	ApiKeyCreatedBy,
	ApiKeyListParams,
	ApiKeyListResponse,
	ApiKeyWithKey,
	CreateApiKeyParams,
	DeleteApiKeyResponse,
	UpdateApiKeyParams,
} from "@/services/api-key/types";
export type {
	ApiKeyListResult,
	ApiKeyResult,
} from "@/services/api-key/result";
export { ReloopValidationError } from "@/services/api-key/errors";

export type { EmailResult } from "@/services/mail/result";
export * from "@/services/mail/mail";
export * from "@/services/mail/types";
export * from "@/services/contacts/contacts";
export * from "@/services/contacts/types";
export type {
	ContactListResult,
	ContactResult,
} from "@/services/contacts/result";
export type {
	ContactProperty,
	ContactPropertyListItem,
	ContactPropertyResponse,
	CreatePropertyParams,
	DeletePropertyResponse,
	ListPropertiesParams,
	PropertyListResponse,
	PropertyType,
	UpdatePropertyParams,
} from "@/services/contacts/property/types";
export type {
	PropertyListResult,
	PropertyResult,
} from "@/services/contacts/property/result";
export type {
	AddContactToGroupParams,
	AddContactToGroupResponse,
	ContactGroup,
	ContactGroupListItem,
	ContactGroupResponse,
	CreateGroupParams,
	DeleteGroupResponse,
	GroupContactItem,
	GroupContactListResponse,
	GroupListResponse,
	ListGroupContactsParams,
	ListGroupsParams,
	RemoveContactFromGroupParams,
	RemoveContactFromGroupResponse,
	UpdateGroupParams,
} from "@/services/contacts/group/types";
export type {
	GroupContactsResult,
	GroupListResult,
	GroupResult,
} from "@/services/contacts/group/result";
export type {
	AddContactToChannelParams,
	AddContactToChannelResponse,
	ChannelListResponse,
	ChannelSubscription,
	ChannelVisibility,
	ContactChannel,
	ContactChannelListItem,
	ContactChannelResponse,
	CreateChannelParams,
	DeleteChannelResponse,
	ListChannelsParams,
	UpdateChannelParams,
	UpdateContactChannelParams,
	UpdateContactChannelResponse,
} from "@/services/contacts/channel/types";
export type {
	ChannelListResult,
	ChannelResult,
} from "@/services/contacts/channel/result";
export * from "@/services/domain/domain";
export * from "@/services/domain/types";
export type {
	DomainListResult,
	DomainResult,
} from "@/services/domain/result";
export * from "@/services/webhook/webhook";
export * from "@/services/webhook/types";
export type {
	WebhookDeliveryListResult,
	WebhookListResult,
	WebhookResult,
} from "@/services/webhook/result";
export {
	verifyWebhook,
	WEBHOOK_SIGNATURE_HEADER,
	WEBHOOK_TIMESTAMP_HEADER,
} from "@/services/webhook/verify/verify";
