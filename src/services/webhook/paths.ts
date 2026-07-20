export const WEBHOOK_V1 = "/api/webhook/v1";

export function webhookCreatePath(): string {
	return `${WEBHOOK_V1}/`;
}

export function webhookListPath(queryString: string): string {
	return `${WEBHOOK_V1}${queryString ? `?${queryString}` : ""}`;
}

export function webhookById(id: string): string {
	return `${WEBHOOK_V1}/${id}`;
}

export function webhookTriggerPath(): string {
	return `${WEBHOOK_V1}/trigger`;
}

export function webhookDeliveriesPath(
	webhookId: string,
	queryString: string,
): string {
	return `${WEBHOOK_V1}/${webhookId}/deliveries${
		queryString ? `?${queryString}` : ""
	}`;
}

export function webhookDeliveryRetryPath(deliveryId: string): string {
	return `/api/webhook/deliveries/${deliveryId}/retry`;
}
