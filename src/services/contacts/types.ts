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

export interface AddContactToChannelParams {
	contact_id?: string;
	email?: string;
	subscription?: "opt_in" | "opt_out";
}

export interface AddContactToChannelResponse {
	contact: ContactResponse;
	subscriptionId: string;
	event: string;
}

export interface UpdateContactChannelParams {
	contact_id?: string;
	email?: string;
	subscription: "opt_in" | "opt_out";
}

export interface UpdateContactChannelResponse {
	success: boolean;
	status: "enrolled" | "unenrolled";
	event: string;
}

export type ChannelVisibility = "private" | "public";

export interface ContactChannel {
	object: "channel";
	id: string;
	name: string;
	description: string | null;
	defaultSubscription: "opt_in" | "opt_out";
	visibility: ChannelVisibility;
	createdAt: string;
	updatedAt: string;
}

export interface ContactChannelResponse extends ContactChannel {
	event: string;
}

export interface ContactChannelListItem {
	id: string;
	name: string;
	description: string | null;
	defaultSubscription: "opt_in" | "opt_out";
	visibility: ChannelVisibility;
	createdAt: string;
	updatedAt: string;
	subscriberCount?: number;
}

export interface CreateChannelParams {
	name: string;
	description?: string;
	defaultSubscription?: "opt_in" | "opt_out";
	visibility?: ChannelVisibility;
}

export interface UpdateChannelParams {
	name?: string;
	description?: string | null;
	visibility?: ChannelVisibility;
}

export interface ListChannelsParams {
	page?: number;
	limit?: number;
}

export interface ChannelListResponse {
	object: "channel";
	channels: ContactChannelListItem[];
	total: number;
	page: number;
	limit: number;
	event: string;
}

export interface DeleteChannelResponse {
	object: "channel";
	success: boolean;
	id: string;
	name: string;
	event: string;
}
