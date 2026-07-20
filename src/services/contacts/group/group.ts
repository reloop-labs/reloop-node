import type { ReloopClient } from "@/client";
import { addContactToGroup } from "@/services/contacts/group/add-contact/add-contact";
import { createGroup } from "@/services/contacts/group/create/create";
import { deleteGroup } from "@/services/contacts/group/delete/delete";
import { getGroup } from "@/services/contacts/group/get/get";
import { listGroups } from "@/services/contacts/group/list/list";
import { listGroupContacts } from "@/services/contacts/group/list-contacts/list-contacts";
import { removeContactFromGroup } from "@/services/contacts/group/remove-contact/remove-contact";
import type {
	GroupContactsResult,
	GroupListResult,
	GroupResult,
} from "@/services/contacts/group/result";
import type {
	AddContactToGroupParams,
	AddContactToGroupResponse,
	ContactGroup,
	ContactGroupResponse,
	CreateGroupParams,
	DeleteGroupResponse,
	ListGroupContactsParams,
	ListGroupsParams,
	RemoveContactFromGroupParams,
	RemoveContactFromGroupResponse,
	UpdateGroupParams,
} from "@/services/contacts/group/types";
import { updateGroup } from "@/services/contacts/group/update/update";

export class GroupService {
	constructor(private readonly client: ReloopClient) {}

	async create(
		params: CreateGroupParams,
	): Promise<GroupResult<ContactGroupResponse>> {
		return createGroup(this.client, params);
	}

	async list(params?: ListGroupsParams): Promise<GroupListResult> {
		return listGroups(this.client, params);
	}

	async get(id: string): Promise<GroupResult<ContactGroup>> {
		return getGroup(this.client, id);
	}

	async update(
		id: string,
		params: UpdateGroupParams,
	): Promise<GroupResult<ContactGroupResponse>> {
		return updateGroup(this.client, id, params);
	}

	async delete(id: string): Promise<GroupResult<DeleteGroupResponse>> {
		return deleteGroup(this.client, id);
	}

	async listContacts(
		id: string,
		params?: ListGroupContactsParams,
	): Promise<GroupContactsResult> {
		return listGroupContacts(this.client, id, params);
	}

	async addContact(
		id: string,
		params: AddContactToGroupParams,
	): Promise<GroupResult<AddContactToGroupResponse>> {
		return addContactToGroup(this.client, id, params);
	}

	async removeContact(
		id: string,
		params: RemoveContactFromGroupParams,
	): Promise<GroupResult<RemoveContactFromGroupResponse>> {
		return removeContactFromGroup(this.client, id, params);
	}
}
