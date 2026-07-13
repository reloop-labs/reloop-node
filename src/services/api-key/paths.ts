
export const API_KEY_V1 = "/api/api-key/v1";

export function apiKeyById(id: string): string {
	return `${API_KEY_V1}/${id}`;
}

export function apiKeyRotate(id: string): string {
	return `${API_KEY_V1}/rotate/${id}`;
}

export function apiKeyEnable(id: string): string {
	return `${API_KEY_V1}/enable/${id}`;
}

export function apiKeyDisable(id: string): string {
	return `${API_KEY_V1}/disable/${id}`;
}

export function apiKeyListPath(queryString: string): string {

	return `${API_KEY_V1}/${queryString ? `?${queryString}` : ""}`;
}
