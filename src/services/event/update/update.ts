import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/event/errors";
import {
	optionalDescription,
	requireEventName,
	requireEventRef,
	requireParamsObject,
	requireProperties,
} from "@/services/event/fields";
import { eventById } from "@/services/event/paths";
import { type EventResult, toEventResult } from "@/services/event/result";
import type { CustomEvent, UpdateEventParams } from "@/services/event/types";

function validateUpdateParams(
	params: UpdateEventParams | null | undefined,
): UpdateEventParams {
	const input = requireParamsObject(params, "update");
	const body: UpdateEventParams = {};
	if (input.name !== undefined) body.name = requireEventName(input.name);
	const description = optionalDescription(input.description);
	if (description !== undefined) body.description = description;
	if (input.properties !== undefined) {
		body.properties = requireProperties(input.properties);
	}
	if (Object.keys(body).length === 0) {
		throw new ReloopValidationError(
			"update requires at least one of name, description or properties.",
			"params",
		);
	}
	return body;
}

export async function updateEvent(
	client: ReloopClient,
	id: string,
	params: UpdateEventParams,
): Promise<EventResult<CustomEvent>> {
	const ref = requireEventRef(id);
	const body = validateUpdateParams(params);
	const result = await client.fetch<CustomEvent>(eventById(ref), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return toEventResult(result);
}
