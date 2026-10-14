import type { ReloopClient } from "@/client";
import { ReloopValidationError } from "@/services/event/errors";
import { requireLimit, requirePage } from "@/services/event/fields";
import { eventsPath } from "@/services/event/paths";
import {
	type EventListResult,
	toEventListResult,
} from "@/services/event/result";
import type {
	EventListResponse,
	ListEventsParams,
} from "@/services/event/types";

export async function listEvents(
	client: ReloopClient,
	params?: ListEventsParams,
): Promise<EventListResult> {
	if (params !== undefined && params !== null && typeof params !== "object") {
		throw new ReloopValidationError(
			"list params must be an object when provided.",
			"params",
		);
	}
	const searchParams = new URLSearchParams();
	if (params?.page !== undefined) {
		searchParams.set("page", requirePage(params.page).toString());
	}
	if (params?.limit !== undefined) {
		searchParams.set("limit", requireLimit(params.limit).toString());
	}
	const result = await client.fetch<EventListResponse>(
		eventsPath(searchParams.toString()),
		{ method: "GET" },
	);
	return toEventListResult(result);
}
