import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/contacts/group/errors";
import { requireCreateGroupName } from "@/services/contacts/group/fields";
import { groupCreatePath } from "@/services/contacts/group/paths";
import {
	toGroupResult,
	type GroupResult,
} from "@/services/contacts/group/result";
import type {
	ContactGroupResponse,
	CreateGroupParams,
} from "@/services/contacts/group/types";

function validateCreateParams(
	params: CreateGroupParams | null | undefined,
): CreateGroupParams {
	if (params === null || params === undefined || typeof params !== "object") {
		throw new ReloopValidationError(
			"create params are required and must be an object.",
			"params",
		);
	}
	return { name: requireCreateGroupName(params.name) };
}

export async function createGroup(
	client: ReloopClient,
	params: CreateGroupParams,
): Promise<GroupResult<ContactGroupResponse>> {
	const body = validateCreateParams(params);
	const result = await client.fetch<ContactGroupResponse>(groupCreatePath(), {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toGroupResult(result);
}
