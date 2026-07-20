import type { ReloopClient } from "@/client";
import type { ReloopResult } from "@/core/result";
import { ChannelService } from "@/services/contacts/channel/channel";
import { GroupService } from "@/services/contacts/group/group";
import { PropertyService } from "@/services/contacts/property/property";
import type {
	Contact,
	ContactListResponse,
	ContactResponse,
	CreateContactParams,
	DeleteContactResponse,
	ListContactsParams,
	UpdateContactParams,
} from "@/services/contacts/types";

function appendContactQuery(
	searchParams: URLSearchParams,
	params?: ListContactsParams,
): void {
	if (params?.page !== undefined) searchParams.set("page", params.page.toString());
	if (params?.limit !== undefined) searchParams.set("limit", params.limit.toString());
	if (params?.search) searchParams.set("search", params.search);
	if (params?.status) searchParams.set("status", params.status);
}

export class ContactsService {
	public readonly properties: PropertyService;
	public readonly groups: GroupService;
	public readonly channels: ChannelService;

	constructor(private readonly client: ReloopClient) {
		this.properties = new PropertyService(client);
		this.groups = new GroupService(client);
		this.channels = new ChannelService(client);
	}

	async create(params: CreateContactParams): Promise<ReloopResult<ContactResponse>> {
		return this.client.fetch<ContactResponse>("/api/contacts/create", {
			method: "POST",
			body: JSON.stringify(params),
		});
	}

	async get(contactId: string): Promise<ReloopResult<Contact>> {
		return this.client.fetch<Contact>(
			`/api/contacts/retrieve/${contactId}`,
			{ method: "GET" },
		);
	}

	async list(
		params?: ListContactsParams,
	): Promise<ReloopResult<ContactListResponse>> {
		const searchParams = new URLSearchParams();
		appendContactQuery(searchParams, params);
		const queryString = searchParams.toString();
		const path = `/api/contacts/list${queryString ? `?${queryString}` : ""}`;

		return this.client.fetch<ContactListResponse>(path, { method: "GET" });
	}

	async update(
		contactId: string,
		params: UpdateContactParams,
	): Promise<ReloopResult<ContactResponse>> {
		return this.client.fetch<ContactResponse>(`/api/contacts/${contactId}`, {
			method: "PATCH",
			body: JSON.stringify(params),
		});
	}

	async delete(contactId: string): Promise<ReloopResult<DeleteContactResponse>> {
		return this.client.fetch<DeleteContactResponse>(
			`/api/contacts/${contactId}`,
			{ method: "DELETE" },
		);
	}
}
