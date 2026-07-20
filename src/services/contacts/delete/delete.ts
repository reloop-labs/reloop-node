import type { ReloopClient } from "@/client";
import { requireContactId } from "@/services/contacts/fields";
import { contactById } from "@/services/contacts/paths";
import {
	toContactResult,
	type ContactResult,
} from "@/services/contacts/result";
import type { DeleteContactResponse } from "@/services/contacts/types";

export async function deleteContact(
	client: ReloopClient,
	id: string,
): Promise<ContactResult<DeleteContactResponse>> {
	const contactId = requireContactId(id);
	const result = await client.fetch<DeleteContactResponse>(
		contactById(contactId),
		{ method: "DELETE" },
	);
	return toContactResult(result);
}
