import type { ReloopClient } from "@/client";
import { requireEventRef } from "@/services/event/fields";
import { eventById } from "@/services/event/paths";
import { type EventResult, toEventResult } from "@/services/event/result";
import type { CustomEvent } from "@/services/event/types";

export async function getEvent(
	client: ReloopClient,
	idOrKey: string,
): Promise<EventResult<CustomEvent>> {
	const ref = requireEventRef(idOrKey);
	const result = await client.fetch<CustomEvent>(eventById(ref), {
		method: "GET",
	});
	return toEventResult(result);
}
