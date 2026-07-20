export const GROUPS_V1 = "/api/contacts/v1/groups";
export const GROUP_MEMBERSHIP = "/api/contacts/group";

export function groupCreatePath(): string {
	return `${GROUPS_V1}/create`;
}

export function groupListPath(queryString: string): string {
	return `${GROUPS_V1}/list${queryString ? `?${queryString}` : ""}`;
}

export function groupById(id: string): string {
	return `${GROUPS_V1}/${id}`;
}

export function groupContactsPath(id: string, queryString: string): string {
	return `${GROUPS_V1}/${id}/contacts${queryString ? `?${queryString}` : ""}`;
}

export function groupMembershipPath(id: string): string {
	return `${GROUP_MEMBERSHIP}/${id}`;
}
