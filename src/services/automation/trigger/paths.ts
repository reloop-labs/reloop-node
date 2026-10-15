/** Triggers are custom events in the API. */
export const TRIGGER_V1 = "/api/workflow/v1/events";

export function triggersPath(queryString = ""): string {
	return `${TRIGGER_V1}${queryString ? `?${queryString}` : ""}`;
}

export function triggerById(id: string): string {
	return `${TRIGGER_V1}/${encodeURIComponent(id)}`;
}

export const AUTOMATION_START = `${TRIGGER_V1}/track`;
