import type { ReloopClient } from "@/client";
import { requirePropertyId } from "@/services/contacts/property/fields";
import { propertyById } from "@/services/contacts/property/paths";
import {
	toPropertyResult,
	type PropertyResult,
} from "@/services/contacts/property/result";
import type { DeletePropertyResponse } from "@/services/contacts/property/types";

export async function deleteProperty(
	client: ReloopClient,
	id: string,
): Promise<PropertyResult<DeletePropertyResponse>> {
	const propertyId = requirePropertyId(id);
	const result = await client.fetch<DeletePropertyResponse>(
		propertyById(propertyId),
		{ method: "DELETE" },
	);
	return toPropertyResult(result);
}
