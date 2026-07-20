import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/property/errors";
import {
	requireNullableFallbackValue,
	requirePropertyId,
} from "@/services/contacts/property/fields";
import { propertyById } from "@/services/contacts/property/paths";
import {
	toPropertyResult,
	type PropertyResult,
} from "@/services/contacts/property/result";
import type {
	ContactPropertyResponse,
	UpdatePropertyParams,
} from "@/services/contacts/property/types";

function validateUpdateParams(
	params: UpdatePropertyParams | null | undefined,
): UpdatePropertyParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}
	return {
		fallbackValue: requireNullableFallbackValue(params.fallbackValue),
	};
}

export async function updateProperty(
	client: ReloopClient,
	id: string,
	params: UpdatePropertyParams,
): Promise<PropertyResult<ContactPropertyResponse>> {
	const propertyId = requirePropertyId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<ContactPropertyResponse>(
		propertyById(propertyId),
		{
			method: "PATCH",
			body: JSON.stringify(body),
		},
	);
	return toPropertyResult(result);
}
