import type { ReloopClient } from "@/client";
import {
	optionalDescription,
	requireEventName,
	requireParamsObject,
	requireProperties,
} from "@/services/event/fields";
import { eventsPath } from "@/services/event/paths";
import { type EventResult, toEventResult } from "@/services/event/result";
import type { CreateEventParams, CustomEvent } from "@/services/event/types";

function validateCreateParams(
	params: CreateEventParams | null | undefined,
): CreateEventParams {
	const input = requireParamsObject(params, "create");
	const body: CreateEventParams = { name: requireEventName(input.name) };
	if (input.key !== undefined) body.key = requireEventName(input.key, "key");
	const description = optionalDescription(input.description);
	if (typeof description === "string") body.description = description;
	if (input.properties !== undefined) {
		body.properties = requireProperties(input.properties);
	}
	return body;
}

export async function createEvent(
	client: ReloopClient,
	params: CreateEventParams,
): Promise<EventResult<CustomEvent>> {
	const body = validateCreateParams(params);
	const result = await client.fetch<CustomEvent>(eventsPath(), {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toEventResult(result);
}
