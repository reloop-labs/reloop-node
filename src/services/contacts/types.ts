export type ContactStatus = "subscribed" | "unsubscribed" | "blocked";

export type PropertyType = "string" | "number";

export interface ContactChannelInput {
	channelId: string;
	subscription: "opt_in" | "opt_out";
}

export interface ContactGroupRef {
	id: string;
	name: string;
}

export interface ContactChannelRef {
	id: string;
	name: string;
	subscription: "opt_in" | "opt_out";
}

export interface Contact {
	object: "contact";
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	status: ContactStatus;
	properties: Record<string, string | number>;
	groups: ContactGroupRef[];
	channels: ContactChannelRef[];
	suppressionReason: "hard_bounce" | "spam_complaint" | null;
	suppressedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ContactResponse extends Contact {
	event: string;
}

export interface CreateContactParams {
	email: string;
	firstName?: string;
	lastName?: string;
	status?: ContactStatus;
	properties?: Record<string, string | number>;
	groupIds?: string[];
	channels?: ContactChannelInput[];
}

export interface UpdateContactParams {
	email?: string;
	firstName?: string;
	lastName?: string;
	status?: ContactStatus;
	properties?: Record<string, string | number>;
}

export interface ListContactsParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: ContactStatus;
	/** When set, lists contacts in this group instead of the org-wide list. */
	groupId?: string;
}

export interface ContactListResponse {
	object: "contact";
	contacts: Contact[];
	total: number;
	page: number;
	limit: number;
	totalContacts: number;
	subscribedContacts: number;
	unsubscribedContacts: number;
	event: string;
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

export interface DeleteContactResponse {
	success: boolean;
	object: "contact";
	id: string;
	event: string;
}

export interface ContactProperty {
	object: "contact_property";
	id: string;
	propertyName: string;
	propertyType: PropertyType;
	defaultValue: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ContactPropertyResponse extends ContactProperty {
	event: string;
}

export interface ContactPropertyListItem {
	id: string;
	propertyName: string;
	propertyType: PropertyType;
	defaultValue: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreatePropertyParams {
	name: string;
	type: PropertyType;
	fallbackValue?: string;
}

export interface UpdatePropertyParams {
	fallbackValue: string | null;
}

export interface ListPropertiesParams {
	page?: number;
	limit?: number;
	search?: string;
	type?: PropertyType;
}

export interface PropertyListResponse {
	object: "contact_property";
	properties: ContactPropertyListItem[];
	total: number;
	page: number;
	limit: number;
	event: string;
}

export interface DeletePropertyResponse {
	object: "contact_property";
	success: boolean;
	id: string;
	name: string;
	event: string;
}

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
