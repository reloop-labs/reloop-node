import type { ReloopClient } from "@/client";
import { requireGroupId } from "@/services/contacts/group/fields";
import { groupById } from "@/services/contacts/group/paths";
import {
	toGroupResult,
	type GroupResult,
} from "@/services/contacts/group/result";
import type { ContactGroup } from "@/services/contacts/group/types";

export async function getGroup(
	client: ReloopClient,
	id: string,
): Promise<GroupResult<ContactGroup>> {
	const groupId = requireGroupId(id);
	const result = await client.fetch<ContactGroup>(groupById(groupId), {
		method: "GET",
	});
	return toGroupResult(result);
}
