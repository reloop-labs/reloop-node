import type { ReloopClient } from "@/client";
import { requireDeliveryId } from "@/services/webhook/fields";
import { webhookDeliveryRetryPath } from "@/services/webhook/paths";
import {
	toWebhookResult,
	type WebhookResult,
} from "@/services/webhook/result";
import type { RetryWebhookDeliveryResponse } from "@/services/webhook/types";

export async function retryWebhookDelivery(
	client: ReloopClient,
	deliveryId: string,
): Promise<WebhookResult<RetryWebhookDeliveryResponse>> {
	const id = requireDeliveryId(deliveryId);
	const result = await client.fetch<RetryWebhookDeliveryResponse>(
		webhookDeliveryRetryPath(id),
		{ method: "POST" },
	);
	return toWebhookResult(result);
}
