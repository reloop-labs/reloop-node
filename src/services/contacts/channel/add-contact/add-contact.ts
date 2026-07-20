import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/channel/errors";
import {
	optionalSubscription,
	requireChannelId,
	requireMembershipIdentifier,
} from "@/services/contacts/channel/fields";
import { channelMembershipPath } from "@/services/contacts/channel/paths";
import {
	toChannelResult,
	type ChannelResult,
} from "@/services/contacts/channel/result";
import type {
	AddContactToChannelParams,
	AddContactToChannelResponse,
} from "@/services/contacts/channel/types";

function validateAddParams(
	params: AddContactToChannelParams | null | undefined,
): AddContactToChannelParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"addContact params are required and must be an object.",
			"params",
		);
	}

	const body: AddContactToChannelParams = requireMembershipIdentifier(params);
	const subscription = optionalSubscription(params.subscription, "subscription");
	if (subscription !== undefined) body.subscription = subscription;
	return body;
}

export async function addContactToChannel(
	client: ReloopClient,
	id: string,
	params: AddContactToChannelParams,
): Promise<ChannelResult<AddContactToChannelResponse>> {
	const channelId = requireChannelId(id);
	const body = validateAddParams(params);
	const result = await client.fetch<AddContactToChannelResponse>(
		channelMembershipPath(channelId),
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
	return toChannelResult(result);
}
