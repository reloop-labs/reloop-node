import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import { ContactChannelsService } from "./channels";
import { ContactGroupsService } from "./groups";
import type {
	Contact,
	ContactGroup,
	ContactGroupResponse,
	ContactListResponse,
	ContactPropertyResponse,
	ContactResponse,
	CreateContactParams,
	CreateGroupParams,
	CreatePropertyParams,
	DeleteContactResponse,
	DeleteGroupResponse,
	DeletePropertyResponse,
	GroupContactListResponse,
	GroupListResponse,
	ListContactsParams,
	ListGroupsParams,
	ListPropertiesParams,
	PropertyListResponse,
	UpdateContactParams,
	UpdateGroupParams,
	UpdatePropertyParams,
} from "./types";

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
	public readonly groups: ContactGroupsService;
	public readonly channels: ContactChannelsService;

	constructor(private readonly client: ReloopClient) {
		this.groups = new ContactGroupsService(client);
		this.channels = new ContactChannelsService(client);
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
	): Promise<ReloopResult<ContactListResponse | GroupContactListResponse>> {
		if (params?.groupId) {
			const { groupId, ...query } = params;
			return this.groups.listContacts(groupId, query);
		}

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

	async createProperty(
		params: CreatePropertyParams,
	): Promise<ReloopResult<ContactPropertyResponse>> {
		return this.client.fetch<ContactPropertyResponse>(
			"/api/contacts/v1/properties/create",
			{
				method: "POST",
				body: JSON.stringify(params),
			},
		);
	}

	async listProperties(
		params?: ListPropertiesParams,
	): Promise<ReloopResult<PropertyListResponse>> {
		const searchParams = new URLSearchParams();
		if (params?.page !== undefined) searchParams.set("page", params.page.toString());
		if (params?.limit !== undefined) searchParams.set("limit", params.limit.toString());
		if (params?.search) searchParams.set("search", params.search);
		if (params?.type) searchParams.set("type", params.type);

		const queryString = searchParams.toString();
		const path = `/api/contacts/v1/properties/list${
			queryString ? `?${queryString}` : ""
		}`;

		return this.client.fetch<PropertyListResponse>(path, { method: "GET" });
	}

	async updateProperty(
		propertyId: string,
		params: UpdatePropertyParams,
	): Promise<ReloopResult<ContactPropertyResponse>> {
		return this.client.fetch<ContactPropertyResponse>(
			`/api/contacts/v1/properties/${propertyId}`,
			{
				method: "PATCH",
				body: JSON.stringify(params),
			},
		);
	}

	async deleteProperty(propertyId: string): Promise<ReloopResult<DeletePropertyResponse>> {
		return this.client.fetch<DeletePropertyResponse>(
			`/api/contacts/v1/properties/${propertyId}`,
			{ method: "DELETE" },
		);
	}

	async createGroup(params: CreateGroupParams): Promise<ReloopResult<ContactGroupResponse>> {
		return this.client.fetch<ContactGroupResponse>(
			"/api/contacts/v1/groups/create",
			{
				method: "POST",
				body: JSON.stringify(params),
			},
		);
	}

	async listGroups(params?: ListGroupsParams): Promise<ReloopResult<GroupListResponse>> {
		const searchParams = new URLSearchParams();
		if (params?.page !== undefined) searchParams.set("page", params.page.toString());
		if (params?.limit !== undefined) searchParams.set("limit", params.limit.toString());
		if (params?.search) searchParams.set("search", params.search);

		const queryString = searchParams.toString();
		const path = `/api/contacts/v1/groups/list${
			queryString ? `?${queryString}` : ""
		}`;

		return this.client.fetch<GroupListResponse>(path, { method: "GET" });
	}

	async getGroup(groupId: string): Promise<ReloopResult<ContactGroup>> {
		return this.client.fetch<ContactGroup>(
			`/api/contacts/v1/groups/${groupId}`,
			{ method: "GET" },
		);
	}

	async updateGroup(
		groupId: string,
		params: UpdateGroupParams,
	): Promise<ReloopResult<ContactGroupResponse>> {
		return this.client.fetch<ContactGroupResponse>(
			`/api/contacts/v1/groups/${groupId}`,
			{
				method: "PATCH",
				body: JSON.stringify(params),
			},
		);
	}

	async deleteGroup(groupId: string): Promise<ReloopResult<DeleteGroupResponse>> {
		return this.client.fetch<DeleteGroupResponse>(
			`/api/contacts/v1/groups/${groupId}`,
			{ method: "DELETE" },
		);
	}
}
