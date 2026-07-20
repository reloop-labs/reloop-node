import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/channel/errors";
import {
	optionalDescription,
	optionalSubscription,
	optionalVisibility,
	requireChannelName,
} from "@/services/contacts/channel/fields";
import { channelCreatePath } from "@/services/contacts/channel/paths";
import {
	toChannelResult,
	type ChannelResult,
} from "@/services/contacts/channel/result";
import type {
	ContactChannelResponse,
	CreateChannelParams,
} from "@/services/contacts/channel/types";

function validateCreateParams(
	params: CreateChannelParams | null | undefined,
): CreateChannelParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"create params are required and must be an object.",
			"params",
		);
	}

	const body: CreateChannelParams = {
		name: requireChannelName(params.name),
	};

	const description = optionalDescription(params.description);
	if (description !== undefined) body.description = description;

	const defaultSubscription = optionalSubscription(
		params.defaultSubscription,
		"defaultSubscription",
	);
	if (defaultSubscription !== undefined) {
		body.defaultSubscription = defaultSubscription;
	}

	const visibility = optionalVisibility(params.visibility);
	if (visibility !== undefined) body.visibility = visibility;

	return body;
}

export async function createChannel(
	client: ReloopClient,
	params: CreateChannelParams,
): Promise<ChannelResult<ContactChannelResponse>> {
	const body = validateCreateParams(params);
	const result = await client.fetch<ContactChannelResponse>(
		channelCreatePath(),
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
	return toChannelResult(result);
}
