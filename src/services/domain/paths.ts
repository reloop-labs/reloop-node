export const DOMAIN_V1 = "/api/domain/v1";

export function domainCreatePath(): string {
	return `${DOMAIN_V1}/create`;
}

export function domainListPath(queryString: string): string {
	return `${DOMAIN_V1}/list${queryString ? `?${queryString}` : ""}`;
}

export function domainById(id: string): string {
	return `${DOMAIN_V1}/${id}`;
}

export function domainVerifyPath(id: string): string {
	return `${DOMAIN_V1}/verify/${id}`;
}
