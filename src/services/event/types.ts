export type EventPropertyType = "string" | "number" | "boolean";

/** A property the event's payload can carry. */
export interface EventPropertyParams {
	/** The key in `properties` when tracking. Starts with a letter; letters, digits and `_`. */
	name: string;
	/** Defaults to `string`. */
	propertyType?: EventPropertyType;
	/** Tracking without it fails. Defaults to `false`. */
	required?: boolean;
	/** Used when tracking leaves it out. */
	defaultValue?: string | null;
	description?: string | null;
}

export interface EventProperty {
	id: string;
	name: string;
	propertyType: EventPropertyType;
	required: boolean;
	defaultValue: string | null;
	description: string | null;
	createdAt: string;
	updatedAt: string;
}

/** A custom event your app tracks to start automations. */
export interface CustomEvent {
	id: string;
	organizationId: string;
	name: string;
	/**
	 * What you pass as `event` when tracking. Always starts with `trigger.`
	 * (e.g. `trigger.user.signed_up`); the prefix is optional when you pass it.
	 */
	key: string;
	description: string | null;
	properties: EventProperty[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateEventParams {
	name: string;
	/** Defaults to one made from `name`. `trigger.` is added in front if missing. */
	key?: string;
	description?: string;
	properties?: EventPropertyParams[];
}

export interface UpdateEventParams {
	name?: string;
	description?: string | null;
	/** Replaces every property. */
	properties?: EventPropertyParams[];
}

export interface ListEventsParams {
	page?: number;
	limit?: number;
}

export interface EventListResponse {
	events: CustomEvent[];
	total: number;
	page: number;
	limit: number;
}

export interface DeleteEventResponse {
	success: boolean;
	id: string;
}

/**
 * Pass `contactId`, or `email` to find the contact (it is created if it does
 * not exist yet; `firstName` / `lastName` are used only then).
 */
export interface TrackEventParams {
	/** The event's key, e.g. `user.signed_up` (same as `trigger.user.signed_up`). */
	event: string;
	contactId?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	/** Conditions read them as `trigger.<name>`. */
	properties?: Record<string, unknown>;
}

export interface TrackEventResponse {
	success: boolean;
	eventId: string;
	eventKey: string;
	contactId: string;
	/** `true` when `email` did not match a contact and one was created. */
	contactCreated: boolean;
	/** How many active automations this started. */
	enrollments: number;
	/** The properties after defaults were applied. */
	properties: Record<string, unknown>;
}
