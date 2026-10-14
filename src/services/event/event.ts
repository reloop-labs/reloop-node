import type { ReloopClient } from "@/client";
import { createEvent } from "@/services/event/create/create";
import { deleteEvent } from "@/services/event/delete/delete";
import { getEvent } from "@/services/event/get/get";
import { listEvents } from "@/services/event/list/list";
import type { EventListResult, EventResult } from "@/services/event/result";
import { trackEvent } from "@/services/event/track/track";
import type {
	CreateEventParams,
	CustomEvent,
	DeleteEventResponse,
	ListEventsParams,
	TrackEventParams,
	TrackEventResponse,
	UpdateEventParams,
} from "@/services/event/types";
import { updateEvent } from "@/services/event/update/update";

/** Custom events that start automations. Not related to webhook events. */
export class EventService {
	constructor(private readonly client: ReloopClient) {}

	/**
	 * Records that something happened to a contact and starts every active
	 * automation triggered by this event.
	 */
	async track(
		params: TrackEventParams,
	): Promise<EventResult<TrackEventResponse>> {
		return trackEvent(this.client, params);
	}

	async create(params: CreateEventParams): Promise<EventResult<CustomEvent>> {
		return createEvent(this.client, params);
	}

	async list(params?: ListEventsParams): Promise<EventListResult> {
		return listEvents(this.client, params);
	}

	/** Takes the event's id or its key (the `trigger.` prefix is optional). */
	async get(idOrKey: string): Promise<EventResult<CustomEvent>> {
		return getEvent(this.client, idOrKey);
	}

	/** `properties` replaces every property. */
	async update(
		id: string,
		params: UpdateEventParams,
	): Promise<EventResult<CustomEvent>> {
		return updateEvent(this.client, id, params);
	}

	async delete(id: string): Promise<EventResult<DeleteEventResponse>> {
		return deleteEvent(this.client, id);
	}
}
