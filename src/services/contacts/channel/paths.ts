export const CHANNELS_V1 = "/api/contacts/v1/channels";
export const CHANNEL_MEMBERSHIP = "/api/contacts/channel";

export function channelCreatePath(): string {
	return `${CHANNELS_V1}/create`;
}

export function channelListPath(queryString: string): string {
	return `${CHANNELS_V1}/list${queryString ? `?${queryString}` : ""}`;
}

export function channelById(id: string): string {
	return `${CHANNELS_V1}/${id}`;
}

export function channelMembershipPath(id: string): string {
	return `${CHANNEL_MEMBERSHIP}/${id}`;
}
