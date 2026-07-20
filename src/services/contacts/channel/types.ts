import type { ContactResponse } from "@/services/contacts/types";

export type ChannelVisibility = "private" | "public";
export type ChannelSubscription = "opt_in" | "opt_out";

export interface ContactChannel {
	object: "channel";
	id: string;
	name: string;
	description: string | null;
	defaultSubscription: ChannelSubscription;
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
	defaultSubscription: ChannelSubscription;
	visibility: ChannelVisibility;
	createdAt: string;
	updatedAt: string;
	subscriberCount?: number;
}

export interface CreateChannelParams {
	name: string;
	description?: string;
	defaultSubscription?: ChannelSubscription;
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

export interface AddContactToChannelParams {
	contact_id?: string;
	email?: string;
	subscription?: ChannelSubscription;
}

export interface AddContactToChannelResponse {
	contact: ContactResponse;
	subscriptionId: string;
	event: string;
}

export interface UpdateContactChannelParams {
	contact_id?: string;
	email?: string;
	subscription: ChannelSubscription;
}

export interface UpdateContactChannelResponse {
	success: boolean;
	status: "enrolled" | "unenrolled";
	event: string;
}
