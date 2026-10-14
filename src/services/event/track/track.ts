import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/event/errors";
import {
	requireContactTarget,
	requireEventRef,
	requireParamsObject,
} from "@/services/event/fields";
import { EVENT_TRACK } from "@/services/event/paths";
import { type EventResult, toEventResult } from "@/services/event/result";
import type {
	TrackEventParams,
	TrackEventResponse,
} from "@/services/event/types";

function validateTrackParams(
	params: TrackEventParams | null | undefined,
): TrackEventParams {
	const input = requireParamsObject(params, "track");
	const event = requireEventRef(input.event, "event");
	const body: TrackEventParams = {
		event,
		...requireContactTarget(input as unknown as Record<string, unknown>),
	};
	if (input.properties !== undefined) {
		if (
			typeof input.properties !== "object" ||
			input.properties === null ||
			Array.isArray(input.properties)
		) {
			throw new ReloopValidationError(
				"track properties must be an object.",
				"properties",
			);
		}
		body.properties = input.properties;
	}
	return body;
}

export async function trackEvent(
	client: ReloopClient,
	params: TrackEventParams,
): Promise<EventResult<TrackEventResponse>> {
	const body = validateTrackParams(params);
	const result = await client.fetch<TrackEventResponse>(EVENT_TRACK, {
		method: "POST",
		body: JSON.stringify(body),
	});
	return toEventResult(result);
}
