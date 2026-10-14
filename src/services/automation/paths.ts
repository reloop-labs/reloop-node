export const AUTOMATION_V1 = "/api/workflow/v1/automations";

export function automationsPath(queryString = ""): string {
	return `${AUTOMATION_V1}${queryString ? `?${queryString}` : ""}`;
}

export function automationById(id: string): string {
	return `${AUTOMATION_V1}/${encodeURIComponent(id)}`;
}

export function automationAction(
	id: string,
	action: "activate" | "pause" | "enroll",
): string {
	return `${automationById(id)}/${action}`;
}

export function enrollmentsPath(automationId: string, queryString = ""): string {
	return `${automationById(automationId)}/enrollments${queryString ? `?${queryString}` : ""}`;
}

export function enrollmentById(automationId: string, enrollmentId: string): string {
	return `${automationById(automationId)}/enrollments/${encodeURIComponent(enrollmentId)}`;
}
