export type ContactStatus = "subscribed" | "unsubscribed" | "blocked";

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

export interface DeleteContactResponse {
	success: boolean;
	object: "contact";
	id: string;
	event: string;
}
