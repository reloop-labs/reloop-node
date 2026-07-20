import type { ContactStatus } from "@/services/contacts/types";

export interface ContactGroup {
	object: "contact_group";
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface ContactGroupResponse extends ContactGroup {
	event: string;
}

export interface ContactGroupListItem {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateGroupParams {
	name: string;
}

export interface UpdateGroupParams {
	name: string;
}

export interface ListGroupsParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface GroupListResponse {
	object: "contact_group";
	groups: ContactGroupListItem[];
	total: number;
	page: number;
	limit: number;
	event: string;
}

export interface DeleteGroupResponse {
	object: "contact_group";
	success: boolean;
	id: string;
	name: string;
	event: string;
}

export interface ListGroupContactsParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: ContactStatus;
}

export interface GroupContactItem {
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	status: ContactStatus;
	properties: Record<string, string | number>;
	createdAt: string;
	updatedAt: string;
}

export interface GroupContactListResponse {
	object: "contact_group";
	group: { id: string; name: string };
	contacts: GroupContactItem[];
	total: number;
	page: number;
	limit: number;
	event: string;
}

export interface AddContactToGroupParams {
	contact_id?: string;
	email?: string;
}

export interface AddContactToGroupResponse {
	success: boolean;
	object: "contact";
	id: string;
	event: string;
}

export interface RemoveContactFromGroupParams {
	contact_id?: string;
	email?: string;
}

export interface RemoveContactFromGroupResponse {
	success: boolean;
	object: "contact";
	id: string;
	event: string;
}
