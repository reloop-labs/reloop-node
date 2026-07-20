export const CONTACTS_BASE = "/api/contacts";

export function contactCreatePath(): string {
	return `${CONTACTS_BASE}/create`;
}

export function contactRetrievePath(id: string): string {
	return `${CONTACTS_BASE}/retrieve/${id}`;
}

export function contactListPath(queryString: string): string {
	return `${CONTACTS_BASE}/list${queryString ? `?${queryString}` : ""}`;
}

export function contactById(id: string): string {
	return `${CONTACTS_BASE}/${id}`;
}
