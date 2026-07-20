import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/errors";
import {
	optionalChannels,
	optionalContactStatus,
	optionalCreateProperties,
	optionalGroupIds,
	optionalString,
	requireEmail,
} from "@/services/contacts/fields";
import { contactCreatePath } from "@/services/contacts/paths";
import {
	toContactResult,
	type ContactResult,
} from "@/services/contacts/result";
import type {
	ContactResponse,
	CreateContactParams,
} from "@/services/contacts/types";

function validateCreateParams(
	params: CreateContactParams | null | undefined,
): CreateContactParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"create params are required and must be an object.",
			"params",
		);
	}

	const body: CreateContactParams = {
		email: requireEmail(params.email),
	};

	const firstName = optionalString(params.firstName, "firstName");
	if (firstName !== undefined) body.firstName = firstName;

	const lastName = optionalString(params.lastName, "lastName");
	if (lastName !== undefined) body.lastName = lastName;

	const status = optionalContactStatus(params.status);
	if (status !== undefined) body.status = status;

	const properties = optionalCreateProperties(params.properties);
	if (properties !== undefined) body.properties = properties;

	const groupIds = optionalGroupIds(params.groupIds);
	if (groupIds !== undefined) body.groupIds = groupIds;

	const channels = optionalChannels(params.channels);
	if (channels !== undefined) body.channels = channels;

	return body;
}

export async function createContact(
	client: ReloopClient,
	params: CreateContactParams,
): Promise<ContactResult<ContactResponse>> {
	const body = validateCreateParams(params);
	const result = await client.fetch<ContactResponse>(contactCreatePath(), {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toContactResult(result);
}
