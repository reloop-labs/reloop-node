import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/errors";
import {
	optionalContactStatus,
	optionalEmail,
	optionalString,
	optionalUpdateProperties,
	requireContactId,
} from "@/services/contacts/fields";
import { contactById } from "@/services/contacts/paths";
import {
	toContactResult,
	type ContactResult,
} from "@/services/contacts/result";
import type {
	ContactResponse,
	UpdateContactParams,
} from "@/services/contacts/types";

function validateUpdateParams(
	params: UpdateContactParams | null | undefined,
): UpdateContactParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}

	const body: UpdateContactParams = {};

	const email = optionalEmail(params.email);
	if (email !== undefined) body.email = email;

	const firstName = optionalString(params.firstName, "firstName");
	if (firstName !== undefined) body.firstName = firstName;

	const lastName = optionalString(params.lastName, "lastName");
	if (lastName !== undefined) body.lastName = lastName;

	const status = optionalContactStatus(params.status);
	if (status !== undefined) body.status = status;

	const properties = optionalUpdateProperties(params.properties);
	if (properties !== undefined) body.properties = properties;

	if (
		body.email === undefined &&
		body.firstName === undefined &&
		body.lastName === undefined &&
		body.status === undefined &&
		body.properties === undefined
	) {
		throw new ReloopValidationError(
			"update requires at least one of email, firstName, lastName, status, or properties.",
			"params",
		);
	}

	return body;
}

export async function updateContact(
	client: ReloopClient,
	id: string,
	params: UpdateContactParams,
): Promise<ContactResult<ContactResponse>> {
	const contactId = requireContactId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<ContactResponse>(contactById(contactId), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return toContactResult(result);
}
