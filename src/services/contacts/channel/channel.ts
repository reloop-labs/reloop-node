import type { ReloopClient } from "@/client";
import { addContactToChannel } from "@/services/contacts/channel/add-contact/add-contact";
import { createChannel } from "@/services/contacts/channel/create/create";
import { deleteChannel } from "@/services/contacts/channel/delete/delete";
import { getChannel } from "@/services/contacts/channel/get/get";
import { listChannels } from "@/services/contacts/channel/list/list";
import type {
	ChannelListResult,
	ChannelResult,
} from "@/services/contacts/channel/result";
import type {
	AddContactToChannelParams,
	AddContactToChannelResponse,
	ContactChannel,
	ContactChannelResponse,
	CreateChannelParams,
	DeleteChannelResponse,
	ListChannelsParams,
	UpdateChannelParams,
	UpdateContactChannelParams,
	UpdateContactChannelResponse,
} from "@/services/contacts/channel/types";
import { updateChannel } from "@/services/contacts/channel/update/update";
import { updateChannelSubscription } from "@/services/contacts/channel/update-subscription/update-subscription";

export class ChannelService {
	constructor(private readonly client: ReloopClient) {}

	async create(
		params: CreateChannelParams,
	): Promise<ChannelResult<ContactChannelResponse>> {
		return createChannel(this.client, params);
	}

	async list(params?: ListChannelsParams): Promise<ChannelListResult> {
		return listChannels(this.client, params);
	}

	async get(id: string): Promise<ChannelResult<ContactChannel>> {
		return getChannel(this.client, id);
	}

	async update(
		id: string,
		params: UpdateChannelParams,
	): Promise<ChannelResult<ContactChannelResponse>> {
		return updateChannel(this.client, id, params);
	}

	async delete(id: string): Promise<ChannelResult<DeleteChannelResponse>> {
		return deleteChannel(this.client, id);
	}

	async addContact(
		id: string,
		params: AddContactToChannelParams,
	): Promise<ChannelResult<AddContactToChannelResponse>> {
		return addContactToChannel(this.client, id, params);
	}

	async updateSubscription(
		id: string,
		params: UpdateContactChannelParams,
	): Promise<ChannelResult<UpdateContactChannelResponse>> {
		return updateChannelSubscription(this.client, id, params);
	}
}
