export type TriggerPropertyType = "string" | "number" | "boolean";

/** A property the trigger's payload can carry. */
export interface TriggerPropertyParams {
	/** The key in `properties` when starting. Starts with a letter; letters, digits and `_`. */
	name: string;
	/** Defaults to `string`. */
	propertyType?: TriggerPropertyType;
	/** Starting without it fails. Defaults to `false`. */
	required?: boolean;
	/** Used when starting leaves it out. */
	defaultValue?: string | null;
	description?: string | null;
}

export interface TriggerProperty {
	id: string;
	name: string;
	propertyType: TriggerPropertyType;
	required: boolean;
	defaultValue: string | null;
	description: string | null;
	createdAt: string;
	updatedAt: string;
}

/** An event your app sends with `automations.start` to start automations. */
export interface AutomationTrigger {
	id: string;
	organizationId: string;
	name: string;
	/**
	 * What you pass as `event` to `automations.start`. Always starts with `trigger.`
	 * (e.g. `trigger.user.signed_up`); the prefix is optional when you pass it.
	 */
	key: string;
	description: string | null;
	properties: TriggerProperty[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateTriggerParams {
	name: string;
	/** Defaults to one made from `name`. `trigger.` is added in front if missing. */
	key?: string;
	description?: string;
	properties?: TriggerPropertyParams[];
}

export interface UpdateTriggerParams {
	name?: string;
	description?: string | null;
	/** Replaces every property. */
	properties?: TriggerPropertyParams[];
}

export interface ListTriggersParams {
	page?: number;
	limit?: number;
}

export interface TriggerListResponse {
	/** Named `events` by the API. */
	events: AutomationTrigger[];
	total: number;
	page: number;
	limit: number;
}

export interface DeleteTriggerResponse {
	success: boolean;
	id: string;
}
