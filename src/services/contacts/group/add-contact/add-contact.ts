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
	AddContactToGroupParams,
	AddContactToGroupResponse,
} from "@/services/contacts/group/types";

function validateAddParams(
	params: AddContactToGroupParams | null | undefined,
): AddContactToGroupParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"addContact params are required and must be an object.",
			"params",
		);
	}
	return requireMembershipIdentifier(params);
}

export async function addContactToGroup(
	client: ReloopClient,
	id: string,
	params: AddContactToGroupParams,
): Promise<GroupResult<AddContactToGroupResponse>> {
	const groupId = requireGroupId(id);
	const body = validateAddParams(params);
	const result = await client.fetch<AddContactToGroupResponse>(
		groupMembershipPath(groupId),
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
	return toGroupResult(result);
}
