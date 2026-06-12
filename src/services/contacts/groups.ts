import type { ReloopClient } from "../../client";
import type { ReloopResult } from "../../core/result";
import type {
	AddContactToGroupParams,
	AddContactToGroupResponse,
	GroupContactListResponse,
	ListContactsParams,
	RemoveContactFromGroupParams,
	RemoveContactFromGroupResponse,
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

export class ContactGroupsService {
	constructor(private readonly client: ReloopClient) {}

	async addContact(
		groupId: string,
		params: AddContactToGroupParams,
	): Promise<ReloopResult<AddContactToGroupResponse>> {
		return this.client.fetch<AddContactToGroupResponse>(
			`/api/contacts/group/${groupId}`,
			{
				method: "POST",
				body: JSON.stringify(params),
			},
		);
	}

	async removeContact(
		groupId: string,
		params: RemoveContactFromGroupParams,
	): Promise<ReloopResult<RemoveContactFromGroupResponse>> {
		return this.client.fetch<RemoveContactFromGroupResponse>(
			`/api/contacts/group/${groupId}`,
			{
				method: "DELETE",
				body: JSON.stringify(params),
			},
		);
	}

	async listContacts(
		groupId: string,
		params?: ListContactsParams,
	): Promise<ReloopResult<GroupContactListResponse>> {
		const searchParams = new URLSearchParams();
		appendContactQuery(searchParams, params);
		const queryString = searchParams.toString();
		const path = `/api/contacts/v1/groups/${groupId}/contacts${
			queryString ? `?${queryString}` : ""
		}`;

		return this.client.fetch<GroupContactListResponse>(path, {
			method: "GET",
		});
	}
}
