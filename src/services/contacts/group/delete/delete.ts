import type { ReloopClient } from "@/client";
import { requireGroupId } from "@/services/contacts/group/fields";
import { groupById } from "@/services/contacts/group/paths";
import {
	toGroupResult,
	type GroupResult,
} from "@/services/contacts/group/result";
import type { DeleteGroupResponse } from "@/services/contacts/group/types";

export async function deleteGroup(
	client: ReloopClient,
	id: string,
): Promise<GroupResult<DeleteGroupResponse>> {
	const groupId = requireGroupId(id);
	const result = await client.fetch<DeleteGroupResponse>(groupById(groupId), {
		method: "DELETE",
	});
	return toGroupResult(result);
}
