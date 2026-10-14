import type { ReloopClient } from "@/client";
import { requireEventRef } from "@/services/event/fields";
import { eventById } from "@/services/event/paths";
import { type EventResult, toEventResult } from "@/services/event/result";
import type { DeleteEventResponse } from "@/services/event/types";

export async function deleteEvent(
	client: ReloopClient,
	id: string,
): Promise<EventResult<DeleteEventResponse>> {
	const ref = requireEventRef(id);
	const result = await client.fetch<DeleteEventResponse>(eventById(ref), {
		method: "DELETE",
	});
	return toEventResult(result);
}
