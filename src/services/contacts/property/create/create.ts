import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/property/errors";
import {
	optionalFallbackValue,
	requirePropertyName,
	requirePropertyType,
} from "@/services/contacts/property/fields";
import { propertyCreatePath } from "@/services/contacts/property/paths";
import {
	toPropertyResult,
	type PropertyResult,
} from "@/services/contacts/property/result";
import type {
	ContactPropertyResponse,
	CreatePropertyParams,
} from "@/services/contacts/property/types";

function validateCreateParams(
	params: CreatePropertyParams | null | undefined,
): CreatePropertyParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"create params are required and must be an object.",
			"params",
		);
	}
	const body: CreatePropertyParams = {
		name: requirePropertyName(params.name),
		type: requirePropertyType(params.type),
	};
	const fallbackValue = optionalFallbackValue(params.fallbackValue);
	if (fallbackValue !== undefined) {
		body.fallbackValue = fallbackValue;
	}
	return body;
}

export async function createProperty(
	client: ReloopClient,
	params: CreatePropertyParams,
): Promise<PropertyResult<ContactPropertyResponse>> {
	const body = validateCreateParams(params);
	const result = await client.fetch<ContactPropertyResponse>(
		propertyCreatePath(),
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
	return toPropertyResult(result);
}
