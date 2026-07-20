import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/channel/errors";
import {
	optionalChannelName,
	optionalNullableDescription,
	optionalVisibility,
	requireChannelId,
} from "@/services/contacts/channel/fields";
import { channelById } from "@/services/contacts/channel/paths";
import {
	toChannelResult,
	type ChannelResult,
} from "@/services/contacts/channel/result";
import type {
	ContactChannelResponse,
	UpdateChannelParams,
} from "@/services/contacts/channel/types";

function validateUpdateParams(
	params: UpdateChannelParams | null | undefined,
): UpdateChannelParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}

	const body: UpdateChannelParams = {};
	const name = optionalChannelName(params.name);
	if (name !== undefined) body.name = name;

	const description = optionalNullableDescription(params.description);
	if (description !== undefined) body.description = description;

	const visibility = optionalVisibility(params.visibility);
	if (visibility !== undefined) body.visibility = visibility;

	if (
		body.name === undefined &&
		body.description === undefined &&
		body.visibility === undefined
	) {
		throw new ReloopValidationError(
			"update requires at least one of name, description, or visibility.",
			"params",
		);
	}

	return body;
}

export async function updateChannel(
	client: ReloopClient,
	id: string,
	params: UpdateChannelParams,
): Promise<ChannelResult<ContactChannelResponse>> {
	const channelId = requireChannelId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<ContactChannelResponse>(
		channelById(channelId),
		{
			method: "PATCH",
			body: JSON.stringify(body),
		},
	);
	return toChannelResult(result);
}
