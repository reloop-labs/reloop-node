import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/group/errors";
import {
	requireGroupId,
	requireMembershipIdentifier,
} from "@/services/contacts/group/fields";
import { groupMembershipPath } from "@/services/contacts/group/paths";
import {
	toGroupResult,
	type GroupResult,
} from "@/services/contacts/group/result";
import type {
	RemoveContactFromGroupParams,
	RemoveContactFromGroupResponse,
} from "@/services/contacts/group/types";

function validateRemoveParams(
	params: RemoveContactFromGroupParams | null | undefined,
): RemoveContactFromGroupParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"removeContact params are required and must be an object.",
			"params",
		);
	}
	return requireMembershipIdentifier(params);
}

export async function removeContactFromGroup(
	client: ReloopClient,
	id: string,
	params: RemoveContactFromGroupParams,
): Promise<GroupResult<RemoveContactFromGroupResponse>> {
	const groupId = requireGroupId(id);
	const body = validateRemoveParams(params);
	const result = await client.fetch<RemoveContactFromGroupResponse>(
		groupMembershipPath(groupId),
		{
			method: "DELETE",
			body: JSON.stringify(body),
		},
	);
	return toGroupResult(result);
}
