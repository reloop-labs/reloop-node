import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/channel/errors";
import {
	requireChannelId,
	requireMembershipIdentifier,
	requireSubscription,
} from "@/services/contacts/channel/fields";
import { channelMembershipPath } from "@/services/contacts/channel/paths";
import {
	toChannelResult,
	type ChannelResult,
} from "@/services/contacts/channel/result";
import type {
	UpdateContactChannelParams,
	UpdateContactChannelResponse,
} from "@/services/contacts/channel/types";

function validateUpdateParams(
	params: UpdateContactChannelParams | null | undefined,
): UpdateContactChannelParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"updateSubscription params are required and must be an object.",
			"params",
		);
	}

	return {
		...requireMembershipIdentifier(params),
		subscription: requireSubscription(params.subscription, "subscription"),
	};
}

export async function updateChannelSubscription(
	client: ReloopClient,
	id: string,
	params: UpdateContactChannelParams,
): Promise<ChannelResult<UpdateContactChannelResponse>> {
	const channelId = requireChannelId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<UpdateContactChannelResponse>(
		channelMembershipPath(channelId),
		{
			method: "PATCH",
			body: JSON.stringify(body),
		},
	);
	return toChannelResult(result);
}
