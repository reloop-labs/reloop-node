import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/group/errors";
import {
	requireGroupId,
	requireUpdateGroupName,
} from "@/services/contacts/group/fields";
import { groupById } from "@/services/contacts/group/paths";
import {
	toGroupResult,
	type GroupResult,
} from "@/services/contacts/group/result";
import type {
	ContactGroupResponse,
	UpdateGroupParams,
} from "@/services/contacts/group/types";

function validateUpdateParams(
	params: UpdateGroupParams | null | undefined,
): UpdateGroupParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"update params are required and must be an object.",
			"params",
		);
	}
	return { name: requireUpdateGroupName(params.name) };
}

export async function updateGroup(
	client: ReloopClient,
	id: string,
	params: UpdateGroupParams,
): Promise<GroupResult<ContactGroupResponse>> {
	const groupId = requireGroupId(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<ContactGroupResponse>(groupById(groupId), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return toGroupResult(result);
}
