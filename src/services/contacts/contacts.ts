import type { ReloopClient } from "@/client";
import { createContact } from "@/services/contacts/create/create";
import { deleteContact } from "@/services/contacts/delete/delete";
import { getContact } from "@/services/contacts/get/get";
import { listContacts } from "@/services/contacts/list/list";
import type {
	ContactListResult,
	ContactResult,
} from "@/services/contacts/result";
import type {
	Contact,
	ContactResponse,
	CreateContactParams,
	DeleteContactResponse,
	ListContactsParams,
	UpdateContactParams,
} from "@/services/contacts/types";
import { updateContact } from "@/services/contacts/update/update";
import { ChannelService } from "@/services/contacts/channel/channel";
import { GroupService } from "@/services/contacts/group/group";
import { PropertyService } from "@/services/contacts/property/property";

export class ContactsService {
	public readonly properties: PropertyService;
	public readonly groups: GroupService;
	public readonly channels: ChannelService;

	constructor(private readonly client: ReloopClient) {
		this.properties = new PropertyService(client);
		this.groups = new GroupService(client);
		this.channels = new ChannelService(client);
	}

	async create(
		params: CreateContactParams,
	): Promise<ContactResult<ContactResponse>> {
		return createContact(this.client, params);
	}

	async get(id: string): Promise<ContactResult<Contact>> {
		return getContact(this.client, id);
	}

	async list(params?: ListContactsParams): Promise<ContactListResult> {
		return listContacts(this.client, params);
	}

	async update(
		id: string,
		params: UpdateContactParams,
	): Promise<ContactResult<ContactResponse>> {
		return updateContact(this.client, id, params);
	}

	async delete(id: string): Promise<ContactResult<DeleteContactResponse>> {
		return deleteContact(this.client, id);
	}
}
