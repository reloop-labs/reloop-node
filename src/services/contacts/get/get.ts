import type { ReloopClient } from "@/client";
import { requireContactId } from "@/services/contacts/fields";
import { contactRetrievePath } from "@/services/contacts/paths";
import {
	toContactResult,
	type ContactResult,
} from "@/services/contacts/result";
import type { Contact } from "@/services/contacts/types";

export async function getContact(
	client: ReloopClient,
	id: string,
): Promise<ContactResult<Contact>> {
	const contactId = requireContactId(id);
	const result = await client.fetch<Contact>(contactRetrievePath(contactId), {
		method: "GET",
	});
	return toContactResult(result);
}
