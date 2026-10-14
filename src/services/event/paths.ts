export const EVENT_V1 = "/api/workflow/v1/events";

export function eventsPath(queryString = ""): string {
	return `${EVENT_V1}${queryString ? `?${queryString}` : ""}`;
}

export function eventById(id: string): string {
	return `${EVENT_V1}/${encodeURIComponent(id)}`;
}

export const EVENT_TRACK = `${EVENT_V1}/track`;
