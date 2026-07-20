export const PROPERTIES_V1 = "/api/contacts/v1/properties";

export function propertyCreatePath(): string {
	return `${PROPERTIES_V1}/create`;
}

export function propertyListPath(queryString: string): string {
	return `${PROPERTIES_V1}/list${queryString ? `?${queryString}` : ""}`;
}

export function propertyById(id: string): string {
	return `${PROPERTIES_V1}/${id}`;
}
