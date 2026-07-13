import type { ReloopClient } from "#src/client";
import type { ReloopResult } from "#src/core/result";
import type {
	AddContactToChannelParams,
	AddContactToChannelResponse,
	ChannelListResponse,
	ContactChannel,
	ContactChannelResponse,
	CreateChannelParams,
	DeleteChannelResponse,
	ListChannelsParams,
	UpdateChannelParams,
	UpdateContactChannelParams,
	UpdateContactChannelResponse,
} from "#src/services/contacts/types";

export class ContactChannelsService {
	constructor(private readonly client: ReloopClient) {}

	async create(
		params: CreateChannelParams,
	): Promise<ReloopResult<ContactChannelResponse>> {
		return this.client.fetch<ContactChannelResponse>(
			"/api/contacts/v1/channels/create",
			{
				method: "POST",
				body: JSON.stringify(params),
			},
		);
	}

	async list(
		params?: ListChannelsParams,
	): Promise<ReloopResult<ChannelListResponse>> {
		const searchParams = new URLSearchParams();
		if (params?.page !== undefined) searchParams.set("page", params.page.toString());
		if (params?.limit !== undefined) searchParams.set("limit", params.limit.toString());

		const queryString = searchParams.toString();
		const path = `/api/contacts/v1/channels/list${
			queryString ? `?${queryString}` : ""
		}`;

		return this.client.fetch<ChannelListResponse>(path, { method: "GET" });
	}

	async get(channelId: string): Promise<ReloopResult<ContactChannel>> {
		return this.client.fetch<ContactChannel>(
			`/api/contacts/v1/channels/${channelId}`,
			{ method: "GET" },
		);
	}

	async update(
		channelId: string,
		params: UpdateChannelParams,
	): Promise<ReloopResult<ContactChannelResponse>> {
		return this.client.fetch<ContactChannelResponse>(
			`/api/contacts/v1/channels/${channelId}`,
			{
				method: "PATCH",
				body: JSON.stringify(params),
			},
		);
	}

	async delete(channelId: string): Promise<ReloopResult<DeleteChannelResponse>> {
		return this.client.fetch<DeleteChannelResponse>(
			`/api/contacts/v1/channels/${channelId}`,
			{ method: "DELETE" },
		);
	}

	async addContact(
		channelId: string,
		params: AddContactToChannelParams,
	): Promise<ReloopResult<AddContactToChannelResponse>> {
		return this.client.fetch<AddContactToChannelResponse>(
			`/api/contacts/channel/${channelId}`,
			{
				method: "POST",
				body: JSON.stringify(params),
			},
		);
	}

	async updateSubscription(
		channelId: string,
		params: UpdateContactChannelParams,
	): Promise<ReloopResult<UpdateContactChannelResponse>> {
		return this.client.fetch<UpdateContactChannelResponse>(
			`/api/contacts/channel/${channelId}`,
			{
				method: "PATCH",
				body: JSON.stringify(params),
			},
		);
	}
}
